import type { SaveStatus } from './SaveIndicator'
import { SaveIndicator } from './SaveIndicator'
import { IconButton } from '../ui/IconButton'

type Props = {
  saveStatus: SaveStatus
  onOpenCalendar: () => void
  onOpenSettings: () => void
}

/**
 * Pinned floating bar: save state (left, full label visible) + calendar + settings.
 * Width matches AppShell caps so it aligns with journal column.
 */
export function JournalDock({ saveStatus, onOpenCalendar, onOpenSettings }: Props) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-[max(0.75rem,env(safe-area-inset-left,0px))] pb-[max(0.65rem,env(safe-area-inset-bottom,0px))] pr-[max(0.75rem,env(safe-area-inset-right,0px))]"
      role="toolbar"
      aria-label="Journal actions"
    >
      <div
        className="pointer-events-auto flex w-full max-w-[min(100%,30rem)] items-center gap-3 rounded-[var(--radius-still)] border border-[var(--still-border)] bg-[var(--still-bg)]/90 px-3 py-2.5 shadow-[0_-4px_28px_rgba(0,0,0,0.08)] backdrop-blur-md sm:max-w-xl sm:px-4 md:max-w-2xl dark:shadow-[0_-4px_32px_rgba(0,0,0,0.45)]"
      >
        <div className="min-w-[6.25rem] shrink-0 text-left">
          <SaveIndicator status={saveStatus} className="text-left" />
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-0.5">
          <IconButton
            label="Open calendar"
            onClick={onOpenCalendar}
            className="h-10 w-10 sm:h-11 sm:w-11"
          >
            <CalendarIcon />
          </IconButton>
          <IconButton
            label="Open settings"
            onClick={onOpenSettings}
            className="h-10 w-10 sm:h-11 sm:w-11"
          >
            <SettingsIcon />
          </IconButton>
        </div>
      </div>
    </div>
  )
}

function CalendarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M8 5v14M12 5v14M16 5v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11" r="2" fill="currentColor" />
      <circle cx="12" cy="15" r="2" fill="currentColor" />
      <circle cx="16" cy="9" r="2" fill="currentColor" />
    </svg>
  )
}
