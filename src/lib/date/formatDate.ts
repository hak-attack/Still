const longFmt = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

const shortMonthYear = new Intl.DateTimeFormat(undefined, {
  month: 'long',
  year: 'numeric',
})

export function formatLongDate(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return longFmt.format(date)
}

export function formatMonthYear(d: Date): string {
  return shortMonthYear.format(d)
}

export function isTodayKey(dateKey: string): boolean {
  const t = new Date()
  const key = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
  return key === dateKey
}
