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
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-6">
      <div className="space-y-2 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-medium tracking-tight text-[var(--still-text)]">
          Still
        </h1>
        <p className="text-[0.95rem] leading-relaxed text-[var(--still-muted)]">
          Unlock your journal
        </p>
      </div>

      <div className="space-y-3 rounded-[var(--radius-still)] border border-[var(--still-border)] bg-[var(--still-surface)]/50 p-4 text-left text-sm leading-relaxed text-[var(--still-muted)]">
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
        <p className="text-center text-sm text-[#8b5a4a]" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={busy || !value.trim()} className="w-full">
        {busy ? 'Unlocking…' : hasExistingJournal ? 'Unlock' : 'Begin'}
      </Button>
    </form>
  )
}
