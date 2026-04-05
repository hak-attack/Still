import {
  daysInMonth,
  parseDateKey,
  startOfMonth,
  toDateKey,
  weekdayIndexMondayFirst,
} from '../../lib/date/dateHelpers'
import { formatMonthYear } from '../../lib/date/formatDate'
import { cn } from '../../lib/utils/cn'
import { IconButton } from '../ui/IconButton'

type Props = {
  /** First day of visible month */
  monthAnchor: Date
  onMonthChange: (d: Date) => void
  selectedDateKey: string
  onSelectDate: (dateKey: string) => void
  hasEntry: (dateKey: string) => boolean
}

export function CalendarGrid({
  monthAnchor,
  onMonthChange,
  selectedDateKey,
  onSelectDate,
  hasEntry,
}: Props) {
  const start = startOfMonth(monthAnchor)
  const lead = weekdayIndexMondayFirst(start)
  const total = daysInMonth(start)
  const cells: (string | null)[] = []
  for (let i = 0; i < lead; i++) cells.push(null)
  for (let d = 1; d <= total; d++) {
    const day = new Date(start.getFullYear(), start.getMonth(), d)
    cells.push(toDateKey(day))
  }

  function prevMonth() {
    const d = new Date(start.getFullYear(), start.getMonth() - 1, 1)
    onMonthChange(d)
  }

  function nextMonth() {
    const d = new Date(start.getFullYear(), start.getMonth() + 1, 1)
    onMonthChange(d)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <IconButton label="Previous month" onClick={prevMonth}>
          <Chevron dir="left" />
        </IconButton>
        <p className="font-[family-name:var(--font-display)] text-lg text-[var(--still-text)]">
          {formatMonthYear(start)}
        </p>
        <IconButton label="Next month" onClick={nextMonth}>
          <Chevron dir="right" />
        </IconButton>
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center text-[0.7rem] font-medium uppercase tracking-wider text-[var(--still-muted)]">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((key, i) =>
          key ? (
            <button
              key={key + i}
              type="button"
              onClick={() => onSelectDate(key)}
              className={cn(
                'relative flex aspect-square max-h-11 items-center justify-center rounded-lg text-sm transition-colors',
                key === selectedDateKey
                  ? 'bg-[var(--still-accent)] text-white'
                  : 'text-[var(--still-text)] hover:bg-[var(--still-surface)]',
              )}
            >
              {parseDateKey(key).getDate()}
              {hasEntry(key) ? (
                <span
                  className={cn(
                    'absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full',
                    key === selectedDateKey ? 'bg-white/90' : 'bg-[var(--still-accent)]/70',
                  )}
                />
              ) : null}
            </button>
          ) : (
            <div key={`e-${i}`} />
          ),
        )}
      </div>
    </div>
  )
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d={dir === 'left' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
