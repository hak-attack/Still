import { useCallback, useMemo, useRef, useState } from 'react'
import { CalendarSheet } from '../components/calendar/CalendarSheet'
import { DateHeader } from '../components/journal/DateHeader'
import { EntryEditor } from '../components/journal/EntryEditor'
import { JournalPager } from '../components/journal/JournalPager'
import { SaveIndicator } from '../components/journal/SaveIndicator'
import { AppShell } from '../components/layout/AppShell'
import { IconButton } from '../components/ui/IconButton'
import { navigateHash } from './hashRoute'
import { useApp } from './providers'

const PROMPTS = [
  'What’s on your mind today?',
  'What felt still?',
  'One thing worth remembering…',
]

export function JournalScreen() {
  const {
    state,
    goPrevDay,
    goNextDay,
    setCurrentDate,
    updateEntryContent,
    flushSave,
  } = useApp()
  const [calendarOpen, setCalendarOpen] = useState(false)
  const touchRef = useRef<{ x: number; t: number } | null>(null)

  const store = state.store!
  const dateKey = state.currentDate
  const entry = store.entries[dateKey]
  const content = entry?.content ?? ''

  const onThisDay = useMemo(() => {
    const [, mm, dd] = dateKey.split('-')
    const suffix = `${mm}-${dd}`
    const out: { date: string; preview: string }[] = []
    for (const [d, e] of Object.entries(store.entries)) {
      if (d === dateKey) continue
      if (!d.endsWith(suffix) || e.content.trim().length === 0) continue
      const y = d.slice(0, 4)
      const preview = e.content.trim().slice(0, 72) + (e.content.trim().length > 72 ? '…' : '')
      out.push({ date: `${y}`, preview })
    }
    out.sort((a, b) => b.date.localeCompare(a.date))
    return out.slice(0, 3)
  }, [store.entries, dateKey])

  const applyPrompt = useCallback(
    (p: string) => {
      const next = content ? `${content}\n\n${p}\n` : `${p}\n`
      updateEntryContent(dateKey, next)
    },
    [content, dateKey, updateEntryContent],
  )

  function onTouchStart(e: React.TouchEvent) {
    const t = e.changedTouches[0]
    if (!t) return
    touchRef.current = { x: t.clientX, t: Date.now() }
  }

  function onTouchEnd(e: React.TouchEvent) {
    const start = touchRef.current
    touchRef.current = null
    if (!start) return
    const t = e.changedTouches[0]
    if (!t) return
    const dx = t.clientX - start.x
    const dt = Date.now() - start.t
    if (dt > 650) return
    if (dx > 56) void goPrevDay()
    else if (dx < -56) void goNextDay()
  }

  return (
    <AppShell className="relative">
      <div className="mb-2 flex items-start justify-between gap-2">
        <SaveIndicator status={state.saveStatus} className="pt-1" />
        <div className="flex shrink-0 gap-0.5">
          <IconButton label="Open calendar" onClick={() => setCalendarOpen(true)}>
            <CalendarIcon />
          </IconButton>
          <IconButton label="Settings" onClick={() => navigateHash('settings')}>
            <GearIcon />
          </IconButton>
        </div>
      </div>

      <JournalPager onPrev={() => void goPrevDay()} onNext={() => void goNextDay()}>
        <article
          key={dateKey}
          className="page-enter space-y-4 pb-8"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <DateHeader dateKey={dateKey} />

          <div className="still-editor-rail relative pl-4 sm:pl-6">
            <EntryEditor
              value={content}
              onChange={(v) => updateEntryContent(dateKey, v)}
              onBlur={() => void flushSave()}
              placeholder="What’s on your mind today?"
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {PROMPTS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => applyPrompt(p)}
                className="rounded-full border border-[var(--still-border)] bg-[var(--still-surface)]/60 px-3 py-1.5 text-left text-xs text-[var(--still-muted)] transition-colors hover:border-[var(--still-accent)]/40 hover:text-[var(--still-text)]"
              >
                {p}
              </button>
            ))}
          </div>

          {onThisDay.length > 0 ? (
            <section className="border-t border-[var(--still-border)] pt-6">
              <h2 className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-[var(--still-muted)]">
                On this day
              </h2>
              <ul className="space-y-3">
                {onThisDay.map((row) => (
                  <li key={row.date}>
                    <button
                      type="button"
                      onClick={() => void setCurrentDate(`${row.date}-${dateKey.slice(5)}`)}
                      className="w-full rounded-lg bg-[var(--still-surface)]/50 px-3 py-2 text-left text-sm text-[var(--still-text)] transition-colors hover:bg-[var(--still-surface)]"
                    >
                      <span className="block text-xs text-[var(--still-muted)]">{row.date}</span>
                      <span className="line-clamp-2 text-[var(--still-text)]/90">{row.preview}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </article>
      </JournalPager>

      <CalendarSheet
        key={calendarOpen ? dateKey : 'calendar-idle'}
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        selectedDateKey={dateKey}
        onSelectDate={(d) => void setCurrentDate(d)}
        store={store}
      />
    </AppShell>
  )
}

function CalendarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
