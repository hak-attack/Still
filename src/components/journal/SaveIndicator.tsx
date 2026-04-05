import { cn } from '../../lib/utils/cn'

type Status = 'idle' | 'saving' | 'saved'

type Props = {
  status: Status
  className?: string
}

export function SaveIndicator({ status, className }: Props) {
  const label =
    status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved' : '\u00a0'
  return (
    <p
      className={cn(
        'min-h-[1.25rem] text-xs tracking-wide text-[var(--still-muted)] transition-opacity',
        status === 'idle' && 'opacity-0',
        className,
      )}
      aria-live="polite"
    >
      {label}
    </p>
  )
}
