import type { ReactNode } from 'react'
import { cn } from '../../lib/utils/cn'

type Props = {
  children: ReactNode
  className?: string
}

export function AppShell({ children, className }: Props) {
  return (
    <div
      className={cn(
        'mx-auto flex min-h-dvh max-w-lg flex-col px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]',
        className,
      )}
    >
      {children}
    </div>
  )
}
