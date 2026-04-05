import type { ReactNode } from 'react'
import { IconButton } from '../ui/IconButton'
import { cn } from '../../lib/utils/cn'

type Props = {
  onPrev: () => void
  onNext: () => void
  children: ReactNode
  className?: string
}

export function JournalPager({ onPrev, onNext, children, className }: Props) {
  return (
    <div className={cn('flex items-stretch gap-0.5 sm:gap-1', className)}>
      <IconButton
        label="Previous day"
        onClick={onPrev}
        className="h-10 w-10 shrink-0 self-start sm:h-11 sm:w-11"
      >
        <Chevron dir="left" />
      </IconButton>
      <div className="min-w-0 flex-1 touch-pan-y">{children}</div>
      <IconButton
        label="Next day"
        onClick={onNext}
        className="h-10 w-10 shrink-0 self-start sm:h-11 sm:w-11"
      >
        <Chevron dir="right" />
      </IconButton>
    </div>
  )
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d={dir === 'left' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
