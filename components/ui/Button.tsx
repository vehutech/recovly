'use client'

// components/ui/Button.tsx

import { forwardRef } from 'react'
import { cn } from '@/lib/cn'
import { Loader2 } from 'lucide-react'

type ButtonSize    = 'sm' | 'md' | 'lg' | 'xl' | 'icon'
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive' | 'link'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?:        ButtonSize    | undefined
  variant?:     ButtonVariant | undefined
  isLoading?:   boolean       | undefined
  loadingText?: string        | undefined
  leftIcon?:    React.ReactNode | undefined
  rightIcon?:   React.ReactNode | undefined
}

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm:   'btn-sm',
  md:   'btn-md',
  lg:   'btn-lg',
  xl:   'btn-xl',
  icon: 'btn-icon',
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary:     'btn-primary',
  secondary:   'btn-secondary',
  ghost:       'btn-ghost',
  outline:     'btn-primary',
  destructive: 'btn-primary',
  link:        'btn-ghost',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      className={cn('btn', SIZE_CLASS[size], VARIANT_CLASS[variant], className)}
      disabled={disabled ?? isLoading}
      {...props}
    >
      {isLoading
        ? <><Loader2 className="h-4 w-4 animate-spin" />{loadingText ?? children}</>
        : <>{leftIcon}{children}{rightIcon}</>
      }
    </button>
  )
)
Button.displayName = 'Button'

// ─────────────────────────────────────────────
// LINK BUTTON — anchor styled as button
// ─────────────────────────────────────────────
type LinkButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href:     string
  size?:    ButtonSize    | undefined
  variant?: ButtonVariant | undefined
}

const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ className, variant = 'primary', size = 'md', href, children, ...props }, ref) => (
    <a
      ref={ref}
      href={href}
      className={cn('btn', SIZE_CLASS[size], VARIANT_CLASS[variant], className)}
      {...props}
    >
      {children}
    </a>
  )
)
LinkButton.displayName = 'LinkButton'

export { Button, LinkButton }
export type { ButtonProps, LinkButtonProps }