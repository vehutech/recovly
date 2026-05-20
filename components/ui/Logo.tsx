// components/ui/Logo.tsx

import { cn } from '@/lib/cn'

type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

type LogoProps = {
  size?:      LogoSize      | undefined
  showText?:  boolean       | undefined
  className?: string        | undefined
}

const SIZE_MAP: Record<LogoSize, { icon: number; textClass: string }> = {
  xs: { icon: 24, textClass: 'text-sm'  },
  sm: { icon: 32, textClass: 'text-base'},
  md: { icon: 40, textClass: 'text-xl'  },
  lg: { icon: 56, textClass: 'text-2xl' },
  xl: { icon: 80, textClass: 'text-4xl' },
}

// ─────────────────────────────────────────────
// GEOMETRIC R MARK
// Thick stem + bold bowl + forward-kicking leg
// ─────────────────────────────────────────────
function RMark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      style={{ flexShrink: 0, display: 'block' }}
    >
      {/* Rounded square background */}
      <rect width="100" height="100" rx="22" fill="var(--color-accent-val)" />

      {/* Vertical stem — left side */}
      <rect x="20" y="18" width="14" height="64" rx="3" fill="white" />

      {/* Bowl top bar */}
      <rect x="34" y="18" width="30" height="14" rx="3" fill="white" />

      {/* Bowl right curve — outer */}
      <rect x="60" y="18" width="14" height="38" rx="7" fill="white" />

      {/* Bowl bottom bar */}
      <rect x="34" y="42" width="30" height="14" rx="3" fill="white" />

      {/* Bowl inner cutout — creates the hollow */}
      <rect x="34" y="32" width="26" height="12" rx="0" fill="var(--color-accent-val)" />

      {/* Diagonal leg — kicks bottom-right from bowl junction */}
      <path
        d="M34 56 L52 56 L78 82 L62 82 L38 58 L34 58 Z"
        fill="white"
      />
    </svg>
  )
}

export function Logo({ size = 'md', showText = true, className }: LogoProps) {
  const { icon, textClass } = SIZE_MAP[size]

  return (
    <div className={cn('inline-flex items-center gap-2.5', className)}>
      <RMark size={icon} />
      {showText && (
        <span
          className={cn('font-black tracking-tighter leading-none', textClass)}
          style={{ color: 'var(--color-text-val)' }}
        >
          recovly
        </span>
      )}
    </div>
  )
}