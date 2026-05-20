'use client'

// components/ui/Input.tsx

import { forwardRef, useState } from 'react'
import { cn } from '@/lib/cn'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?:      string       | undefined
  error?:      string       | undefined
  hint?:        string       | undefined
  leftIcon?:   React.ReactNode | undefined
  rightIcon?:  React.ReactNode | undefined
  isRequired?: boolean      | undefined
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, isRequired, type, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const inputId      = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    const isPassword   = type === 'password'
    const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold" style={{ color: 'var(--color-text-val)' }}>
            {label}
            {isRequired && <span style={{ color: 'var(--color-error-val)' }} className="ml-1" aria-hidden>*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 pointer-events-none" style={{ color: 'var(--color-text-muted-val)' }}>
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            className={cn(
              'w-full rounded-lg border text-sm h-10 px-3 py-2 transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:ring-offset-1',
              'disabled:cursor-not-allowed disabled:opacity-50',
              leftIcon              && 'pl-9',
              (rightIcon ?? isPassword) && 'pr-9',
              className
            )}
            style={{
              backgroundColor: 'var(--color-sunken-val)',
              color:           'var(--color-text-val)',
              borderColor:     error ? 'var(--color-error-val)' : 'var(--color-border-val)',
              // @ts-expect-error — CSS custom property
              '--tw-ring-color': error ? 'var(--color-error-val)' : 'var(--color-accent-val)',
            }}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />

          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 transition-colors"
              style={{ color: 'var(--color-text-muted-val)' }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          ) : rightIcon ? (
            <span className="absolute right-3 pointer-events-none" style={{ color: 'var(--color-text-muted-val)' }}>
              {rightIcon}
            </span>
          ) : null}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-error-val)' }} role="alert">
            <AlertCircle className="h-3 w-3 shrink-0" />
            {error}
          </p>
        )}

        {!error && hint && (
          <p id={`${inputId}-hint`} className="text-xs" style={{ color: 'var(--color-text-muted-val)' }}>
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