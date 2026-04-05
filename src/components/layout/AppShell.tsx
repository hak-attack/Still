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
        'mx-auto flex min-h-dvh max-w-xl flex-col px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pl-8 sm:pr-6',
        className,
      )}
    >
      {children}
    </div>
  )
}
