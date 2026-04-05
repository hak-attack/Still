import { useId, useState } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

type Props = {
  onSubmit: (passphrase: string) => Promise<void>
  error: string | null | undefined
  busy: boolean
  hasExistingJournal: boolean
}

export function UnlockForm({ onSubmit, error, busy, hasExistingJournal }: Props) {
  const [value, setValue] = useState('')
  const id = useId()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!value.trim() || busy) return
    await onSubmit(value)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="unlock-stagger flex w-full flex-col gap-6 sm:max-w-md sm:gap-7"
    >
      <div className="space-y-3 text-left">
        <div className="still-diagonal-rule h-px w-16 opacity-80" aria-hidden />
        <h1 className="still-wordmark text-[2.75rem] leading-[0.95] text-[var(--still-text)] sm:text-[3.25rem]">
          Still
        </h1>
        <p className="max-w-[14rem] text-[0.95rem] font-medium italic leading-snug text-[var(--still-muted)]">
          Unlock your journal
        </p>
      </div>

      <div className="space-y-3 rounded-[var(--radius-still)] border border-[var(--still-border)] bg-[var(--still-surface)]/35 p-4 text-left text-[0.9rem] leading-relaxed text-[var(--still-muted)] backdrop-blur-sm">
        <p>Stored locally on this device. Encrypted in your browser.</p>
        <p>If you forget your passphrase, this journal cannot be recovered.</p>
      </div>

      <div>
        <label htmlFor={id} className="sr-only">
          Passphrase
        </label>
        <Input
          id={id}
          type="password"
          name="passphrase"
          autoComplete={hasExistingJournal ? 'current-password' : 'new-password'}
          placeholder="Passphrase"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={busy}
        />
      </div>

      {error ? (
        <p className="text-left text-sm text-[var(--still-danger)]" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={busy || !value.trim()} className="w-full">
        {busy ? 'Unlocking…' : hasExistingJournal ? 'Unlock' : 'Begin'}
      </Button>
    </form>
  )
}
