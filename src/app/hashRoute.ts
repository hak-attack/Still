export type AppHashRoute = 'journal' | 'settings'

export function getHashRoute(): AppHashRoute {
  const raw = window.location.hash.slice(1) || '/journal'
  const path = raw.split('?')[0]?.replace(/^\//, '') ?? 'journal'
  if (path === 'settings' || path.startsWith('settings/')) return 'settings'
  return 'journal'
}

export function navigateHash(route: AppHashRoute): void {
  window.location.hash = route === 'settings' ? '#/settings' : '#/journal'
}
