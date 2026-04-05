import type { InputHTMLAttributes } from 'react'
import { cn } from '../../lib/utils/cn'

type Props = InputHTMLAttributes<HTMLInputElement>

export function Input({ className, ...props }: Props) {
  return (
    <input
      className={cn(
        'w-full rounded-[var(--radius-still)] border border-[var(--still-border)] bg-[var(--still-surface)]/40 backdrop-blur-[2px]',
        'px-4 py-3 text-[1rem] text-[var(--still-text)] placeholder:text-[var(--still-muted)]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--still-accent)]',
        className,
      )}
      {...props}
    />
  )
}
