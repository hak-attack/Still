import { useMemo, useRef, useState } from 'react'
import { CalendarSheet } from '../components/calendar/CalendarSheet'
import { DateHeader } from '../components/journal/DateHeader'
import { EntryEditor } from '../components/journal/EntryEditor'
import { JournalDock } from '../components/journal/JournalDock'
import { AppShell } from '../components/layout/AppShell'
import { navigateHash } from './hashRoute'
import { useApp } from './providers'

/** Space for floating dock + safe area so content clears the bar */
const DOCK_BOTTOM_PAD =
  'pb-[calc(5.75rem+env(safe-area-inset-bottom,0px))] sm:pb-[calc(6rem+env(safe-area-inset-bottom,0px))]'

export function JournalScreen() {
  const { state, goPrevDay, goNextDay, setCurrentDate, updateEntryContent, flushSave } = useApp()
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
    <AppShell className="relative min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain">
        <article
          key={dateKey}
          className={`page-enter flex min-w-0 flex-col gap-5 ${DOCK_BOTTOM_PAD} sm:gap-6`}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <DateHeader dateKey={dateKey} className="shrink-0" />

          <div className="still-editor-rail shrink-0 pl-3 sm:pl-5">
            <EntryEditor
              value={content}
              onChange={(v) => updateEntryContent(dateKey, v)}
              onBlur={() => void flushSave()}
              placeholder="What’s on your mind today?"
            />
          </div>

          {onThisDay.length > 0 ? (
            <section className="shrink-0 border-t border-[var(--still-border)] pt-6">
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
      </div>

      <JournalDock
        saveStatus={state.saveStatus}
        onOpenCalendar={() => setCalendarOpen(true)}
        onOpenSettings={() => navigateHash('settings')}
      />

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
