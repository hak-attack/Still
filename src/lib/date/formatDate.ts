const shortMonthYear = new Intl.DateTimeFormat(undefined, {
  month: 'long',
  year: 'numeric',
})

export function formatMonthYear(d: Date): string {
  return shortMonthYear.format(d)
}

export function isTodayKey(dateKey: string): boolean {
  const t = new Date()
  const key = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
  return key === dateKey
}

/** DD/MM/YYYY from YYYY-MM-DD */
export function formatDayMonthYear(dateKey: string): string {
  const [y, m, d] = dateKey.split('-')
  if (!y || !m || !d) return dateKey
  return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`
}

export function formatWeekdayLong(dateKey: string): string {
  const [y, mo, d] = dateKey.split('-').map(Number)
  const date = new Date(y, mo - 1, d)
  return new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(date)
}
