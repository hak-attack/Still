import { formatDayMonthYear, formatWeekdayLong, isTodayKey } from '../../lib/date/formatDate'
import { cn } from '../../lib/utils/cn'

type Props = {
  dateKey: string
  className?: string
}

export function DateHeader({ dateKey, className }: Props) {
  const today = isTodayKey(dateKey)
  const dmy = formatDayMonthYear(dateKey)
  const weekday = formatWeekdayLong(dateKey)

  return (
    <header
      className={cn(
        'relative space-y-1 border-l-[3px] border-[var(--still-accent)] pl-4 sm:pl-5 md:pl-6',
        className,
      )}
    >
      {today ? (
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--still-accent)]">
          Today
        </p>
      ) : null}
      <div className="space-y-0.5">
        <p className="font-[family-name:var(--font-display)] text-[1.35rem] font-medium leading-tight tracking-[-0.02em] text-[var(--still-text)] sm:text-[1.5rem]">
          {dmy}
        </p>
        <p className="text-[0.95rem] font-medium capitalize text-[var(--still-muted)]">{weekday}</p>
      </div>
    </header>
  )
}
