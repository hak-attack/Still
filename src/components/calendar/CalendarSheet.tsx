import { useMemo, useState } from 'react'
import { parseDateKey, startOfMonth } from '../../lib/date/dateHelpers'
import type { JournalStore } from '../../types/journal'
import { Sheet } from '../ui/Sheet'
import { CalendarGrid } from './CalendarGrid'

type Props = {
  open: boolean
  onClose: () => void
  selectedDateKey: string
  onSelectDate: (dateKey: string) => void
  store: JournalStore
}

function entryDatesSet(store: JournalStore): Set<string> {
  const s = new Set<string>()
  for (const [date, e] of Object.entries(store.entries)) {
    if (e.content.trim().length > 0) s.add(date)
  }
  return s
}

export function CalendarSheet({ open, onClose, selectedDateKey, onSelectDate, store }: Props) {
  const [monthAnchor, setMonthAnchor] = useState(() => startOfMonth(parseDateKey(selectedDateKey)))
  const markers = useMemo(() => entryDatesSet(store), [store])

  return (
    <Sheet open={open} onClose={onClose} title="Jump to date">
      <CalendarGrid
        monthAnchor={monthAnchor}
        onMonthChange={setMonthAnchor}
        selectedDateKey={selectedDateKey}
        onSelectDate={(key) => {
          onSelectDate(key)
          onClose()
        }}
        hasEntry={(key) => markers.has(key)}
      />
    </Sheet>
  )
}
