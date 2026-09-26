import type { ReactNode } from 'react'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'

/**
 * Primitif form CMS yang dipakai bersama oleh seluruh halaman /
 * admin. Sengaja tanpa hooks supaya bisa diimport dari Server
 * Component maupun Client Component.
 */

export const controlClass =
  'w-full px-4 py-2 border border-paper-200 rounded-md bg-paper-50 text-ink-950 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400'

export const controlClassError =
  'w-full px-4 py-2 border border-red-300 rounded-md bg-red-50/40 text-ink-950 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-red-400'

export function FormCard({
  title,
  description,
  children,
  footer,
}: {
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <section className="rounded-lg border border-paper-200 bg-white shadow-sm">
      <div className="border-b border-paper-100 px-6 py-5">
        <h3 className="font-editorial text-xl text-ink-950">{title}</h3>
        {description ? <p className="mt-1 text-sm text-ink-500">{description}</p> : null}
      </div>
      <div className="space-y-5 px-6 py-6">{children}</div>
      {footer ? (
        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-paper-100 bg-paper-50/60 px-6 py-4">
          {footer}
        </div>
      ) : null}
    </section>
  )
}

export function FieldGroup({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <fieldset className="space-y-4 border-t border-paper-100 pt-5 first:border-0 first:pt-0">
      <legend className="sr-only">{title}</legend>
      <div>
        <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-green-700">{title}</h4>
        {description ? <p className="mt-1 text-xs text-ink-400">{description}</p> : null}
      </div>
      {children}
    </fieldset>
  )
}

export function Field({
  label,
  htmlFor,
  hint,
  required,
  error,
  children,
}: {
  label: string
  htmlFor?: string
  hint?: string
  required?: boolean
  error?: string
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-ink-800">
        {label}
        {required ? <span className="ml-0.5 text-red-500">*</span> : null}
      </label>
      {children}
      {hint && !error ? <p className="mt-1 text-xs text-ink-400">{hint}</p> : null}
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  )
}

export function TextInput({
  id,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled,
  invalid,
}: {
  id?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: 'text' | 'email' | 'tel' | 'url' | 'number'
  disabled?: boolean
  invalid?: boolean
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      disabled={disabled}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className={`${invalid ? controlClassError : controlClass} disabled:cursor-not-allowed disabled:bg-paper-100 disabled:text-ink-400`}
    />
  )
}

export function NumberInput({
  id,
  value,
  onChange,
  placeholder,
  step,
  min,
  max,
  disabled,
}: {
  id?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  step?: string
  min?: string
  max?: string
  disabled?: boolean
}) {
  return (
    <input
      id={id}
      type="number"
      inputMode="decimal"
      value={value}
      step={step}
      min={min}
      max={max}
      disabled={disabled}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className={`${controlClass} disabled:cursor-not-allowed disabled:bg-paper-100 disabled:text-ink-400`}
    />
  )
}

export function TextArea({
  id,
  value,
  onChange,
  rows = 4,
  placeholder,
  disabled,
}: {
  id?: string
  value: string
  onChange: (value: string) => void
  rows?: number
  placeholder?: string
  disabled?: boolean
}) {
  return (
    <textarea
      id={id}
      rows={rows}
      value={value}
      disabled={disabled}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className={`${controlClass} resize-y disabled:cursor-not-allowed disabled:bg-paper-100 disabled:text-ink-400`}
    />
  )
}

export function SelectInput<T extends string>({
  id,
  value,
  onChange,
  options,
  disabled,
}: {
  id?: string
  value: T
  onChange: (value: T) => void
  options: readonly T[] | readonly { value: T; label: string }[]
  disabled?: boolean
}) {
  return (
    <select
      id={id}
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value as T)}
      className={`${controlClass} disabled:cursor-not-allowed disabled:bg-paper-100 disabled:text-ink-400`}
    >
      {options.map((option) => {
        const optionValue = typeof option === 'string' ? option : option.value
        const optionLabel = typeof option === 'string' ? option : option.label
        return (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        )
      })}
    </select>
  )
}

export function Toggle({
  id,
  checked,
  onChange,
  label,
  description,
  disabled,
}: {
  id?: string
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description?: string
  disabled?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-md bg-paper-50 px-4 py-3">
      <div className="min-w-0">
        <label htmlFor={id} className="block text-sm font-medium text-ink-800">
          {label}
        </label>
        {description ? <p className="mt-0.5 text-xs text-ink-400">{description}</p> : null}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
          checked ? 'bg-green-600' : 'bg-paper-300'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )
}

export function Alert({
  variant,
  children,
}: {
  variant: 'success' | 'error' | 'info'
  children: ReactNode
}) {
  const styles = {
    success: 'border-green-200 bg-green-50 text-green-800',
    error: 'border-red-200 bg-red-50 text-red-700',
    info: 'border-blue-200 bg-blue-50 text-blue-800',
  } as const
  const Icon = variant === 'success' ? CheckCircle2 : variant === 'error' ? AlertCircle : Info

  return (
    <div className={`flex items-start gap-2 rounded-md border p-3 text-sm ${styles[variant]}`}>
      <Icon size={16} className="mt-0.5 shrink-0" />
      <span className="min-w-0 flex-1">{children}</span>
    </div>
  )
}

export function SubmitButton({
  saving,
  children,
  savingLabel = 'Menyimpan…',
  disabled,
}: {
  saving: boolean
  children: ReactNode
  savingLabel?: string
  disabled?: boolean
}) {
  return (
    <button
      type="submit"
      disabled={saving || disabled}
      className="inline-flex items-center justify-center gap-2 rounded-md bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-green-300"
    >
      {saving ? (
        <>
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          {savingLabel}
        </>
      ) : (
        children
      )}
    </button>
  )
}
