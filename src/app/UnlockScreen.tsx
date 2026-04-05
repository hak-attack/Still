import { UnlockForm } from '../components/auth/UnlockForm'
import { AppShell } from '../components/layout/AppShell'
import { useApp } from './providers'

export function UnlockScreen() {
  const { unlock, unlockBusy, hasExistingJournal, state } = useApp()

  return (
    <AppShell className="min-h-0 flex-1 items-center justify-center overflow-y-auto py-8">
      <UnlockForm
        onSubmit={unlock}
        error={state.unlockError}
        busy={unlockBusy}
        hasExistingJournal={hasExistingJournal}
      />
    </AppShell>
  )
}
