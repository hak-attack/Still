import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
} from 'react'
import { randomBytes } from '../lib/crypto/bytes'
import { decryptJournalEnvelope, parseEnvelopeJson } from '../lib/crypto/decrypt'
import { deriveKeyFromPassphrase } from '../lib/crypto/deriveKey'
import { encryptJournalStore } from '../lib/crypto/encrypt'
import { clearSessionCrypto, setSessionCrypto } from '../lib/crypto/session'
import {
  clearEncryptedEnvelope,
  hasEncryptedEnvelope,
  loadEncryptedEnvelope,
  saveEncryptedEnvelope,
} from '../lib/db/storage'
import { addDays, todayKey } from '../lib/date/dateHelpers'
import { buildExportPayload } from '../features/backup/exportJournal'
import { downloadFile } from '../lib/utils/downloadFile'
import { mergeJournalStores } from '../features/journal/mergeStores'
import { persistJournalStore } from '../features/journal/persist'
import {
  createEmptyJournalStore,
  type JournalEntry,
  type JournalStore,
} from '../types/journal'

type SaveStatus = 'idle' | 'saving' | 'saved'

type State = {
  isUnlocked: boolean
  store: JournalStore | null
  currentDate: string
  saveStatus: SaveStatus
  unlockError: string | null
  theme: 'ivory' | 'stone' | 'clay'
}

type Action =
  | { type: 'unlock'; store: JournalStore }
  | { type: 'lock' }
  | { type: 'unlock_error'; message: string | null }
  | { type: 'set_date'; date: string }
  | { type: 'set_content'; date: string; content: string }
  | { type: 'save_status'; status: SaveStatus }
  | { type: 'replace_store'; store: JournalStore }
  | { type: 'set_theme'; theme: State['theme'] }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'unlock':
      return {
        ...state,
        isUnlocked: true,
        store: action.store,
        unlockError: null,
        saveStatus: 'idle',
      }
    case 'lock':
      return {
        ...state,
        isUnlocked: false,
        store: null,
        currentDate: todayKey(),
        saveStatus: 'idle',
        unlockError: null,
      }
    case 'unlock_error':
      return { ...state, unlockError: action.message }
    case 'set_date':
      return { ...state, currentDate: action.date }
    case 'set_content': {
      if (!state.store) return state
      const now = new Date().toISOString()
      const prev = state.store.entries[action.date]
      const entry: JournalEntry = prev
        ? {
            ...prev,
            content: action.content,
            updatedAt: now,
          }
        : {
            date: action.date,
            content: action.content,
            createdAt: now,
            updatedAt: now,
          }
      const entries = { ...state.store.entries }
      if (action.content.trim().length === 0) {
        delete entries[action.date]
      } else {
        entries[action.date] = entry
      }
      return {
        ...state,
        store: { ...state.store, entries },
      }
    }
    case 'save_status':
      return { ...state, saveStatus: action.status }
    case 'replace_store':
      return state.isUnlocked ? { ...state, store: action.store } : state
    case 'set_theme':
      return { ...state, theme: action.theme }
    default:
      return state
  }
}

const initialState = (): State => ({
  isUnlocked: false,
  store: null,
  currentDate: todayKey(),
  saveStatus: 'idle',
  unlockError: null,
  theme: 'ivory',
})

type Ctx = {
  state: State
  dispatch: Dispatch<Action>
  hasExistingJournal: boolean
  unlockBusy: boolean
  unlock: (passphrase: string) => Promise<void>
  goPrevDay: () => void
  goNextDay: () => void
  setCurrentDate: (d: string) => Promise<void>
  updateEntryContent: (date: string, content: string) => void
  flushSave: () => Promise<void>
  lock: () => void
  exportBackup: () => Promise<void>
  importBackup: (text: string, passphrase: string, mode: 'merge' | 'replace') => Promise<void>
  clearAllData: () => Promise<void>
  setTheme: (t: State['theme']) => void
}

const AppCtx = createContext<Ctx | null>(null)

function loadTheme(): State['theme'] {
  try {
    const v = localStorage.getItem('still.theme') as State['theme'] | null
    if (v === 'stone' || v === 'clay' || v === 'ivory') return v
  } catch {
    /* ignore */
  }
  return 'ivory'
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState)
  const [hasExistingJournal, setHasExistingJournal] = useState(false)
  const [unlockBusy, setUnlockBusy] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const themeLoaded = useRef(false)
  const storeRef = useRef<JournalStore | null>(null)

  useEffect(() => {
    storeRef.current = state.store
  }, [state.store])

  useEffect(() => {
    void hasEncryptedEnvelope().then(setHasExistingJournal)
  }, [state.isUnlocked])

  useEffect(() => {
    if (themeLoaded.current) return
    themeLoaded.current = true
    const t = loadTheme()
    dispatch({ type: 'set_theme', theme: t })
  }, [])

  useEffect(() => {
    if (state.theme === 'ivory') {
      delete document.documentElement.dataset.theme
    } else {
      document.documentElement.dataset.theme = state.theme
    }
    try {
      localStorage.setItem('still.theme', state.theme)
    } catch {
      /* ignore */
    }
  }, [state.theme])

  const flushSave = useCallback(async () => {
    if (!state.isUnlocked) return
    const store = storeRef.current
    if (!store) return
    dispatch({ type: 'save_status', status: 'saving' })
    try {
      await persistJournalStore(store)
      dispatch({ type: 'save_status', status: 'saved' })
      window.setTimeout(() => dispatch({ type: 'save_status', status: 'idle' }), 2000)
    } catch {
      dispatch({ type: 'save_status', status: 'idle' })
    }
  }, [state.isUnlocked])

  const scheduleSave = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      saveTimer.current = null
      void flushSave()
    }, 600)
  }, [flushSave])

  const updateEntryContent = useCallback(
    (date: string, content: string) => {
      dispatch({ type: 'set_content', date, content })
      scheduleSave()
    },
    [scheduleSave],
  )

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [])

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'hidden') void flushSave()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [flushSave])

  const unlock = useCallback(async (passphrase: string) => {
    setUnlockBusy(true)
    dispatch({ type: 'unlock_error', message: null })
    try {
      const existing = await loadEncryptedEnvelope()
      if (existing) {
        const env = parseEnvelopeJson(existing)
        try {
          const { store, salt, key } = await decryptJournalEnvelope(passphrase, env)
          setSessionCrypto(key, salt)
          dispatch({ type: 'unlock', store })
          dispatch({ type: 'set_date', date: todayKey() })
        } catch (e) {
          const msg =
            e instanceof Error && e.message === 'DECRYPT_FAILED'
              ? "That passphrase didn't unlock this journal."
              : "That passphrase didn't unlock this journal."
          dispatch({ type: 'unlock_error', message: msg })
        }
      } else {
        const salt = randomBytes(16)
        const key = await deriveKeyFromPassphrase(passphrase, salt)
        const store = createEmptyJournalStore()
        const env = await encryptJournalStore(key, salt, store)
        await saveEncryptedEnvelope(JSON.stringify(env))
        setSessionCrypto(key, salt)
        dispatch({ type: 'unlock', store })
        dispatch({ type: 'set_date', date: todayKey() })
        setHasExistingJournal(true)
      }
    } catch {
      dispatch({
        type: 'unlock_error',
        message: 'Something went wrong. Please try again.',
      })
    } finally {
      setUnlockBusy(false)
    }
  }, [])

  const lock = useCallback(() => {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current)
      saveTimer.current = null
    }
    void flushSave().finally(() => {
      clearSessionCrypto()
      dispatch({ type: 'lock' })
    })
  }, [flushSave])

  const goPrevDay = useCallback(async () => {
    await flushSave()
    dispatch({ type: 'set_date', date: addDays(state.currentDate, -1) })
  }, [flushSave, state.currentDate])

  const goNextDay = useCallback(async () => {
    await flushSave()
    dispatch({ type: 'set_date', date: addDays(state.currentDate, 1) })
  }, [flushSave, state.currentDate])

  const setCurrentDate = useCallback(
    async (date: string) => {
      await flushSave()
      dispatch({ type: 'set_date', date })
    },
    [flushSave],
  )

  const exportBackup = useCallback(async () => {
    if (!state.store) return
    const payload = await buildExportPayload(state.store)
    const name = `still-backup-${todayKey()}.still`
    downloadFile(name, payload, 'application/json')
  }, [state.store])

  const importBackup = useCallback(
    async (text: string, passphrase: string, mode: 'merge' | 'replace') => {
      const envelope = parseEnvelopeJson(text)
      const { store: imported, salt, key } = await decryptJournalEnvelope(passphrase, envelope)
      if (mode === 'replace') {
        await saveEncryptedEnvelope(JSON.stringify(envelope))
        setSessionCrypto(key, salt)
        dispatch({ type: 'replace_store', store: imported })
      } else {
        const current = storeRef.current
        if (!current) throw new Error('NOT_UNLOCKED')
        const merged = mergeJournalStores(current, imported)
        await persistJournalStore(merged)
        dispatch({ type: 'replace_store', store: merged })
      }
    },
    [],
  )

  const clearAllData = useCallback(async () => {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current)
      saveTimer.current = null
    }
    await clearEncryptedEnvelope()
    clearSessionCrypto()
    setHasExistingJournal(false)
    dispatch({ type: 'lock' })
  }, [])

  const setTheme = useCallback((t: State['theme']) => {
    dispatch({ type: 'set_theme', theme: t })
  }, [])

  const value = useMemo<Ctx>(
    () => ({
      state,
      dispatch,
      hasExistingJournal,
      unlockBusy,
      unlock,
      goPrevDay,
      goNextDay,
      setCurrentDate,
      updateEntryContent,
      flushSave,
      lock,
      exportBackup,
      importBackup,
      clearAllData,
      setTheme,
    }),
    [
      state,
      hasExistingJournal,
      unlockBusy,
      unlock,
      goPrevDay,
      goNextDay,
      setCurrentDate,
      updateEntryContent,
      flushSave,
      lock,
      exportBackup,
      importBackup,
      clearAllData,
      setTheme,
    ],
  )

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}

/* Hook lives alongside provider; split would duplicate large context wiring. */
// eslint-disable-next-line react-refresh/only-export-components -- useApp is the public API for this module
export function useApp(): Ctx {
  const c = useContext(AppCtx)
  if (!c) throw new Error('useApp outside AppProvider')
  return c
}
