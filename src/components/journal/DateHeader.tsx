import { formatLongDate, isTodayKey } from '../../lib/date/formatDate'
import { cn } from '../../lib/utils/cn'

type Props = {
  dateKey: string
  className?: string
}

export function DateHeader({ dateKey, className }: Props) {
  const today = isTodayKey(dateKey)
  return (
    <header
      className={cn(
        'relative space-y-1.5 border-l-[3px] border-[var(--still-accent)] pl-4 sm:space-y-2 sm:pl-5 md:pl-6',
        className,
      )}
    >
      {today ? (
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--still-accent)]">
          Today
        </p>
      ) : null}
      <h1 className="font-[family-name:var(--font-display)] text-[1.75rem] font-medium leading-[1.12] tracking-[-0.02em] text-[var(--still-text)] sm:text-[2rem]">
        {formatLongDate(dateKey)}
      </h1>
    </header>
  )
}
