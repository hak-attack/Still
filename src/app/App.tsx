import { JournalScreen } from './JournalScreen'
import { UnlockScreen } from './UnlockScreen'
import { useHashRoute } from './routes'
import { AppProvider, useApp } from './providers'
import { SettingsPanel } from '../components/settings/SettingsPanel'

function RoutedApp() {
  const { state } = useApp()
  const route = useHashRoute()

  if (!state.isUnlocked) {
    return <UnlockScreen />
  }

  if (route === 'settings') {
    return <SettingsPanel />
  }

  return <JournalScreen />
}

export default function App() {
  return (
    <AppProvider>
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col overflow-hidden">
        <RoutedApp />
      </div>
    </AppProvider>
  )
}
