import { useEffect, useState } from 'react'
import type { AppHashRoute } from './hashRoute'
import { getHashRoute } from './hashRoute'

export function useHashRoute(): AppHashRoute {
  const [route, setRoute] = useState<AppHashRoute>(() =>
    typeof window !== 'undefined' ? getHashRoute() : 'journal',
  )

  useEffect(() => {
    const onHash = () => setRoute(getHashRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return route
}
