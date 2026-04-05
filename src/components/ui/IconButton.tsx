import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils/cn'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string
}

export function IconButton({ className, label, children, ...props }: Props) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        'flex h-11 w-11 items-center justify-center rounded-full text-[var(--still-text)]',
        'transition-colors hover:bg-[var(--still-surface)] active:bg-[var(--still-border)]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--still-accent)]',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
