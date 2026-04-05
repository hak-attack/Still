import { formatLongDate, isTodayKey } from '../../lib/date/formatDate'
import { cn } from '../../lib/utils/cn'

type Props = {
  dateKey: string
  className?: string
}

export function DateHeader({ dateKey, className }: Props) {
  const today = isTodayKey(dateKey)
  return (
    <header className={cn('space-y-1', className)}>
      {today ? (
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--still-muted)]">Today</p>
      ) : null}
      <h1 className="font-[family-name:var(--font-display)] text-[1.65rem] font-medium leading-tight text-[var(--still-text)] sm:text-[1.85rem]">
        {formatLongDate(dateKey)}
      </h1>
    </header>
  )
}
