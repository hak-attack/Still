import { useId, useRef, useState } from 'react'
import { readFileAsText } from '../../lib/utils/readFile'
import { AppShell } from '../layout/AppShell'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { navigateHash } from '../../app/hashRoute'
import { useApp } from '../../app/providers'

export function SettingsPanel() {
  const { lock, exportBackup, importBackup, clearAllData, setTheme, setAppearance, state } = useApp()
  const fileRef = useRef<HTMLInputElement>(null)
  const [importOpen, setImportOpen] = useState(false)
  const [importText, setImportText] = useState<string | null>(null)
  const [importPass, setImportPass] = useState('')
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge')
  const [importError, setImportError] = useState<string | null>(null)
  const [importBusy, setImportBusy] = useState(false)
  const passId = useId()

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f) return
    try {
      const text = await readFileAsText(f)
      setImportText(text)
      setImportPass('')
      setImportError(null)
      setImportOpen(true)
    } catch {
      setImportError('Could not read that file.')
    }
  }

  async function confirmImport() {
    if (!importText?.trim() || !importPass) return
    setImportBusy(true)
    setImportError(null)
    try {
      await importBackup(importText, importPass, importMode)
      setImportOpen(false)
      setImportText(null)
      setImportPass('')
      navigateHash('journal')
    } catch (e) {
      const msg =
        e instanceof Error && e.message === 'DECRYPT_FAILED'
          ? 'That passphrase could not read this backup.'
          : e instanceof Error && e.message === 'INVALID_FILE'
            ? 'This file does not look like a Still backup.'
            : 'Import failed. Check the file and passphrase.'
      setImportError(msg)
    } finally {
      setImportBusy(false)
    }
  }

  function requestClear() {
    if (
      window.confirm(
        'Erase all journal data on this device? This cannot be undone unless you have a backup.',
      )
    ) {
      void clearAllData()
      navigateHash('journal')
    }
  }

  return (
    <AppShell className="h-full min-h-0 flex-1 flex-col overflow-hidden">
      <header className="mb-6 flex shrink-0 items-center gap-3 sm:mb-8">
        <button
          type="button"
          onClick={() => navigateHash('journal')}
          className="rounded-full px-2 py-2 text-[var(--still-muted)] hover:bg-[var(--still-surface)]"
          aria-label="Back"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className="font-[family-name:var(--font-display)] text-2xl text-[var(--still-text)]">
          Settings
        </h1>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
        <div className="space-y-10 pb-6">
        <section className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--still-muted)]">
            Appearance
          </h2>
          <p className="text-sm text-[var(--still-muted)]">Light and dark are full palettes. Paper tones apply in light mode.</p>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: 'light' as const, label: 'Light' },
                { id: 'dark' as const, label: 'Dark' },
              ] as const
            ).map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setAppearance(a.id)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  state.appearance === a.id
                    ? 'border-[var(--still-accent)] bg-[var(--still-surface)] text-[var(--still-text)] shadow-[0_0_20px_-8px_var(--still-accent-glow)]'
                    : 'border-[var(--still-border)] text-[var(--still-muted)] hover:border-[var(--still-accent)]/40'
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
          {state.appearance === 'light' ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {(
                [
                  { id: 'ivory' as const, label: 'Ivory' },
                  { id: 'stone' as const, label: 'Stone' },
                  { id: 'clay' as const, label: 'Clay' },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
                    state.theme === t.id
                      ? 'border-[var(--still-accent)] bg-[var(--still-surface)]/80 text-[var(--still-text)]'
                      : 'border-[var(--still-border)] text-[var(--still-muted)] hover:border-[var(--still-accent)]/35'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          ) : null}
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--still-muted)]">
            Data
          </h2>
          <div className="flex flex-col gap-2">
            <Button type="button" variant="subtle" className="w-full justify-center" onClick={() => void exportBackup()}>
              Export encrypted backup
            </Button>
            <input ref={fileRef} type="file" accept=".still,.json,application/json" className="hidden" onChange={onPickFile} />
            <Button type="button" variant="subtle" className="w-full justify-center" onClick={() => fileRef.current?.click()}>
              Import backup…
            </Button>
            <Button type="button" variant="subtle" className="w-full justify-center" onClick={() => void lock()}>
              Lock journal
            </Button>
            <Button type="button" variant="ghost" className="w-full justify-center text-[var(--still-danger)]" onClick={requestClear}>
              Clear data on this device…
            </Button>
          </div>
        </section>

        <section className="space-y-2 border-t border-[var(--still-border)] pt-8 text-sm text-[var(--still-muted)]">
          <p className="font-[family-name:var(--font-display)] text-base text-[var(--still-text)]">Still</p>
          <p>Local, encrypted journaling. No accounts, no cloud.</p>
          <p className="text-xs">v0.1.0</p>
        </section>
        </div>
      </div>

      {importOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-black/25"
            aria-label="Close"
            onClick={() => !importBusy && setImportOpen(false)}
          />
          <div className="relative m-4 w-full max-w-md rounded-[var(--radius-still)] border border-[var(--still-border)] bg-[var(--still-bg)] p-5 shadow-lg">
            <h2 className="font-[family-name:var(--font-display)] text-lg text-[var(--still-text)]">Import backup</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--still-muted)]">
              Enter the passphrase that encrypts this file. Merge keeps this device’s journal and adds newer text per day.
              Replace overwrites this device with the backup.
            </p>

            <div className="mt-4 space-y-3">
              <label htmlFor={passId} className="sr-only">
                Backup passphrase
              </label>
              <Input
                id={passId}
                type="password"
                autoComplete="current-password"
                placeholder="Backup passphrase"
                value={importPass}
                onChange={(e) => setImportPass(e.target.value)}
                disabled={importBusy}
              />

              <fieldset className="space-y-2 text-sm">
                <legend className="sr-only">Import mode</legend>
                <label className="flex cursor-pointer items-center gap-2 text-[var(--still-text)]">
                  <input
                    type="radio"
                    name="importMode"
                    checked={importMode === 'merge'}
                    onChange={() => setImportMode('merge')}
                    disabled={importBusy}
                  />
                  Merge with this journal
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-[var(--still-text)]">
                  <input
                    type="radio"
                    name="importMode"
                    checked={importMode === 'replace'}
                    onChange={() => setImportMode('replace')}
                    disabled={importBusy}
                  />
                  Replace this journal
                </label>
              </fieldset>
            </div>

            {importError ? (
              <p className="mt-3 text-sm text-[var(--still-danger)]" role="alert">
                {importError}
              </p>
            ) : null}

            <div className="mt-5 flex gap-2">
              <Button type="button" variant="ghost" className="flex-1" disabled={importBusy} onClick={() => setImportOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                className="flex-1"
                disabled={importBusy || !importPass.trim()}
                onClick={() => void confirmImport()}
              >
                {importBusy ? 'Importing…' : 'Import'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </AppShell>
  )
}
