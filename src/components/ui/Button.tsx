import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils/cn'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'subtle'
}

export function Button({ className, variant = 'primary', type = 'button', ...props }: Props) {
  return (
    <button
      type={type}
      className={cn(
        'min-h-11 rounded-[var(--radius-still)] px-5 text-[0.95rem] font-medium transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--still-accent)]',
        'disabled:opacity-45 disabled:pointer-events-none',
        variant === 'primary' &&
          'bg-[var(--still-accent)] text-[var(--still-on-accent)] shadow-[0_2px_20px_-4px_var(--still-accent-glow)] active:scale-[0.99] transition-transform duration-200',
        variant === 'ghost' && 'bg-transparent text-[var(--still-text)] active:bg-[var(--still-surface)]',
        variant === 'subtle' &&
          'bg-[var(--still-surface)] text-[var(--still-text)] border border-[var(--still-border)]',
        className,
      )}
      {...props}
    />
  )
}
