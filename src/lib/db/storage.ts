import { idbGet, idbRemove, idbSet, idbSupported } from './indexedDb'

const STORAGE_KEY = 'still.encrypted.envelope.v1'
const RECORD_ID = 'journal'

export async function loadEncryptedEnvelope(): Promise<string | null> {
  if (idbSupported()) {
    const v = await idbGet(RECORD_ID)
    if (v) return v
  }
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export async function saveEncryptedEnvelope(json: string): Promise<void> {
  if (idbSupported()) {
    try {
      await idbSet(RECORD_ID, json)
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch {
        /* ignore */
      }
      return
    } catch {
      /* fall through to localStorage */
    }
  }
  localStorage.setItem(STORAGE_KEY, json)
}

export async function clearEncryptedEnvelope(): Promise<void> {
  await idbRemove(RECORD_ID)
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

export async function hasEncryptedEnvelope(): Promise<boolean> {
  const v = await loadEncryptedEnvelope()
  return v != null && v.length > 0
}
