'use client'

// components/ui/Textarea.tsx

import { forwardRef } from 'react'
import { AlertCircle } from 'lucide-react'

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?:      string | undefined
  error?:      string | undefined
  hint?:       string | undefined
  isRequired?: boolean | undefined
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, isRequired, id, style, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', width: '100%' }}>
        {label && (
          <label htmlFor={inputId} style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>
            {label}
            {isRequired && <span style={{ color: 'var(--color-error)', marginLeft: '0.25rem' }} aria-hidden>*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={inputId}
          style={{
            width: '100%',
            minHeight: '6rem',
            padding: '0.625rem 0.75rem',
            borderRadius: '0.625rem',
            border: `1px solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
            backgroundColor: 'var(--color-sunken)',
            color: 'var(--color-text)',
            fontSize: '0.875rem',
            lineHeight: '1.5',
            outline: 'none',
            resize: 'vertical',
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
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />

        {error && (
          <p
            id={`${inputId}-error`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--color-error)' }}
            role="alert"
          >
            <AlertCircle size={12} style={{ flexShrink: 0 }} />
            {error}
          </p>
        )}

        {!error && hint && (
          <p id={`${inputId}-hint`} style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            {hint}
          </p>
        )}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
export type { TextareaProps }