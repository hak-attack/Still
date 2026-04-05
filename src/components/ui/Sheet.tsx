import { useEffect, type ReactNode } from 'react'
import { cn } from '../../lib/utils/cn'

type Props = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  className?: string
}

export function Sheet({ open, onClose, title, children, className }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
      <button
        type="button"
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative max-h-[85dvh] overflow-hidden rounded-t-[var(--radius-still)] border border-[var(--still-border)]',
          'bg-[var(--still-bg)] shadow-[0_-8px_40px_rgba(0,0,0,0.08)]',
          'animate-[sheetUp_0.3s_ease-out]',
          className,
        )}
      >
        <div className="flex items-center justify-between border-b border-[var(--still-border)] px-4 py-3">
          <h2 id="sheet-title" className="font-[family-name:var(--font-display)] text-lg text-[var(--still-text)]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1 text-sm text-[var(--still-muted)] hover:bg-[var(--still-surface)]"
          >
            Done
          </button>
        </div>
        <div className="max-h-[calc(85dvh-3.5rem)] overflow-y-auto overscroll-contain p-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          {children}
        </div>
      </div>
      <style>{`
        @keyframes sheetUp {
          from { transform: translateY(100%); opacity: 0.9; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
