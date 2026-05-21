'use client'

// components/ui/Input.tsx

import { forwardRef, useState } from 'react'
import { cn } from '@/lib/cn'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?:      string        | undefined
  error?:      string        | undefined
  hint?:       string        | undefined
  leftIcon?:   React.ReactNode | undefined
  rightIcon?:  React.ReactNode | undefined
  isRequired?: boolean       | undefined
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, isRequired, type, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const inputId      = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    const isPassword   = type === 'password'
    const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', width: '100%' }}>

        {label && (
          <label htmlFor={inputId} style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>
            {label}
            {isRequired && <span style={{ color: 'var(--color-error)', marginLeft: '0.25rem' }} aria-hidden>*</span>}
          </label>
        )}

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          {leftIcon && (
            <span style={{ position: 'absolute', left: '0.75rem', color: 'var(--color-text-muted)', pointerEvents: 'none' }}>
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            className={cn(className)}
            style={{
              width: '100%',
              height: '2.5rem',
              padding: `0 ${(rightIcon ?? isPassword) ? '2.5rem' : '0.75rem'} 0 ${leftIcon ? '2.5rem' : '0.75rem'}`,
              borderRadius: '0.625rem',
              border: `1px solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
              backgroundColor: 'var(--color-sunken)',
              color: 'var(--color-text)',
              fontSize: '0.875rem',
              outline: 'none',
              transition: 'border-color 150ms ease, box-shadow 150ms ease',
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

          {isPassword ? (
            <button type="button" onClick={() => setShowPassword((v) => !v)}
              style={{ position: 'absolute', right: '0.75rem', color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          ) : rightIcon ? (
            <span style={{ position: 'absolute', right: '0.75rem', color: 'var(--color-text-muted)', pointerEvents: 'none' }}>
              {rightIcon}
            </span>
          ) : null}
        </div>

        {error && (
          <p id={`${inputId}-error`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--color-error)' }} role="alert">
            <AlertCircle size={12} style={{ flexShrink: 0 }} />{error}
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
Input.displayName = 'Input'

export { Input }
export type { InputProps }