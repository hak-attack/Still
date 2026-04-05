import type { ReactNode } from 'react'
import { cn } from '../../lib/utils/cn'

type Props = {
  children: ReactNode
  className?: string
}

/**
 * Layout tuned for modern iPhone Pro widths (~390–430 CSS px): safe-area insets,
 * modest horizontal padding for max writing width, wider cap on tablet/desktop.
 */
export function AppShell({ children, className }: Props) {
  return (
    <div
      className={cn(
        'mx-auto flex min-h-dvh w-full max-w-[min(100%,26rem)] flex-col sm:max-w-lg md:max-w-xl',
        'pl-[max(0.875rem,env(safe-area-inset-left,0px))]',
        'pr-[max(0.875rem,env(safe-area-inset-right,0px))]',
        'pt-[max(0.5rem,env(safe-area-inset-top))]',
        'pb-[max(0.875rem,env(safe-area-inset-bottom))]',
        'md:pl-[max(1.5rem,env(safe-area-inset-left,0px))]',
        'md:pr-[max(1.5rem,env(safe-area-inset-right,0px))]',
        className,
      )}
    >
      {children}
    </div>
  )
}
