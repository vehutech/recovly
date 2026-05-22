'use client'

// components/ui/Select.tsx

import { forwardRef } from 'react'
import { AlertCircle, ChevronDown } from 'lucide-react'

type SelectOption = {
  value: string
  label: string
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?:      string         | undefined
  error?:      string         | undefined
  hint?:       string         | undefined
  isRequired?: boolean        | undefined
  options:     SelectOption[]
  placeholder?: string        | undefined
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, isRequired, options, placeholder, id, style, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', width: '100%' }}>
        {label && (
          <label htmlFor={inputId} style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>
            {label}
            {isRequired && <span style={{ color: 'var(--color-error)', marginLeft: '0.25rem' }} aria-hidden>*</span>}
          </label>
        )}

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <select
            ref={ref}
            id={inputId}
            style={{
              width: '100%',
              height: '2.5rem',
              padding: '0 2.25rem 0 0.75rem',
              borderRadius: '0.625rem',
              border: `1px solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
              backgroundColor: 'var(--color-sunken)',
              color: 'var(--color-text)',
              fontSize: '0.875rem',
              outline: 'none',
              appearance: 'none',
              cursor: 'pointer',
              transition: 'border-color 150ms ease, box-shadow 150ms ease',
              fontFamily: 'inherit',
              ...style,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = error ? 'var(--color-error)' : 'var(--color-accent)'
              e.currentTarget.style.boxShadow   = `0 0 0 3px ${error ? 'rgba(196,75,43,0.15)' : 'rgba(196,75,43,0.12)'}`
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = error ? 'var(--color-error)' : 'var(--color-border)'
              e.currentTarget.style.boxShadow   = 'none'
            }}
            aria-invalid={!!error}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>{placeholder}</option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <ChevronDown
            size={16}
            style={{
              position: 'absolute',
              right: '0.75rem',
              color: 'var(--color-text-muted)',
              pointerEvents: 'none',
              flexShrink: 0,
            }}
          />
        </div>

        {error && (
          <p
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--color-error)' }}
            role="alert"
          >
            <AlertCircle size={12} style={{ flexShrink: 0 }} />
            {error}
          </p>
        )}

        {!error && hint && (
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{hint}</p>
        )}
      </div>
    )
  }
)
Select.displayName = 'Select'

export { Select }
export type { SelectProps, SelectOption }