import { cn } from '../../lib/utils/cn'

export type SaveStatus = 'idle' | 'saving' | 'saved'

type Props = {
  status: SaveStatus
  className?: string
}

export function SaveIndicator({ status, className }: Props) {
  const label =
    status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved' : '\u00a0'
  return (
    <p
      className={cn(
        'block min-h-[1.25rem] whitespace-nowrap text-left text-xs tracking-wide text-[var(--still-muted)] transition-opacity',
        status === 'idle' && 'opacity-0',
        className,
      )}
      aria-live="polite"
    >
      {label}
    </p>
  )
}
