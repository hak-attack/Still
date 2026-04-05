import { cn } from '../../lib/utils/cn'

type Props = {
  value: string
  onChange: (v: string) => void
  onBlur?: () => void
  placeholder?: string
  className?: string
}

export function EntryEditor({ value, onChange, onBlur, placeholder, className }: Props) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      rows={1}
      className={cn(
        'still-editor-textarea w-full resize-none bg-transparent text-[1.08rem] leading-[1.72] text-[var(--still-text)]',
        'min-h-[5.25rem] [field-sizing:content]',
        'placeholder:text-[var(--still-muted)]/70 placeholder:italic',
        'focus:outline-none',
        className,
      )}
      spellCheck
      autoCapitalize="sentences"
    />
  )
}
