'use client'

// components/ui/Button.tsx

import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2',
    'font-semibold tracking-tight rounded-xl border',
    'transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'select-none cursor-pointer whitespace-nowrap',
  ],
  {
    variants: {
      variant: {
        primary: [
          'border-transparent',
          'active:scale-[0.98]',
        ],
        secondary: [
          'active:scale-[0.98]',
        ],
        ghost: [
          'border-transparent',
          'active:scale-[0.98]',
        ],
        outline: [
          'active:scale-[0.98]',
        ],
        destructive: [
          'border-transparent',
          'hover:opacity-90 active:scale-[0.98]',
        ],
        link: [
          'border-transparent h-auto p-0',
          'hover:underline underline-offset-4',
        ],
      },
      size: {
        sm:       'h-8  px-4  text-xs',
        md:       'h-10 px-5  text-sm',
        lg:       'h-12 px-7  text-base',
        xl:       'h-14 px-8  text-base font-bold',
        icon:     'h-10 w-10 p-0',
        'icon-sm':'h-8  w-8  p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size:    'md',
    },
  }
)

// ─────────────────────────────────────────────
// VARIANT STYLES — applied via inline style
// so CSS variables resolve correctly
// ─────────────────────────────────────────────
type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive' | 'link'

function getVariantStyle(variant: Variant): React.CSSProperties {
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: 'var(--color-accent-val)',
        color:           'white',
        borderColor:     'var(--color-accent-val)',
      }
    case 'secondary':
      return {
        backgroundColor: 'var(--color-surface-val)',
        color:           'var(--color-text-val)',
        borderColor:     'var(--color-border-strong-val)',
      }
    case 'ghost':
      return {
        backgroundColor: 'transparent',
        color:           'var(--color-text-val)',
        borderColor:     'transparent',
      }
    case 'outline':
      return {
        backgroundColor: 'transparent',
        color:           'var(--color-accent-val)',
        borderColor:     'var(--color-accent-val)',
      }
    case 'destructive':
      return {
        backgroundColor: 'var(--color-error-val)',
        color:           'white',
        borderColor:     'var(--color-error-val)',
      }
    case 'link':
      return {
        backgroundColor: 'transparent',
        color:           'var(--color-accent2-val)',
        borderColor:     'transparent',
      }
  }
}

// ─────────────────────────────────────────────
// BUTTON
// ─────────────────────────────────────────────
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    isLoading?:   boolean        | undefined
    loadingText?: string         | undefined
    leftIcon?:    React.ReactNode | undefined
    rightIcon?:   React.ReactNode | undefined
  }

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className, variant = 'primary', size,
      isLoading = false, loadingText,
      leftIcon, rightIcon,
      disabled, style, children,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      style={{ ...getVariantStyle(variant as Variant), ...style }}
      disabled={disabled ?? isLoading}
      {...props}
    >
      {isLoading ? (
        <><Loader2 className="h-4 w-4 animate-spin" />{loadingText ?? children}</>
      ) : (
        <>{leftIcon}{children}{rightIcon}</>
      )}
    </button>
  )
)
Button.displayName = 'Button'

// ─────────────────────────────────────────────
// LINK BUTTON
// ─────────────────────────────────────────────
type LinkButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof buttonVariants> & {
    href: string
  }

const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ className, variant = 'primary', size, href, style, children, ...props }, ref) => (
    <a
      ref={ref}
      href={href}
      className={cn(buttonVariants({ variant, size }), className)}
      style={{ ...getVariantStyle(variant as Variant), ...style }}
      {...props}
    >
      {children}
    </a>
  )
)
LinkButton.displayName = 'LinkButton'

export { Button, LinkButton, buttonVariants }
export type { ButtonProps, LinkButtonProps }