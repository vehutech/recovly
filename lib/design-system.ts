// lib/design-system.ts

/**
 * recovly — Design System
 * Single source of truth for all design tokens.
 * All components must pull from here. No hardcoded values anywhere.
 */

// ─────────────────────────────────────────────
// COLORS
// ─────────────────────────────────────────────
export const colors = {
  base: {
    background: '#F6F1E9',   // carton / cream off-white
    surface:    '#EEE8DC',   // slightly deeper cream — cards, panels
    sunken:     '#E5DDD0',   // inputs, recessed areas
    border:     '#D6CCBC',   // subtle dividers
    borderStrong: '#BFB3A0', // emphasized borders
  },
  text: {
    primary:   '#1C1510',    // near-black warm — main content
    secondary: '#6B5D4F',    // warm mid-brown — supporting text
    muted:     '#9C8E7E',    // ghost text, placeholders
    inverse:   '#F6F1E9',    // text on dark/accent backgrounds
    onAccent:  '#FFFFFF',    // text directly on accent buttons
  },
  accent: {
    // primary: vivid burnt orange-red — CTAs, highlights, badges
    primary:        '#C44B2B',
    primaryHover:   '#A93D22',
    primaryMuted:   '#F0D4CB',  // light tint for backgrounds

    // secondary: deep steel blue — links, info, secondary actions
    secondary:      '#2B5C8A',
    secondaryHover: '#224A72',
    secondaryMuted: '#C8D9EC',

    // tertiary: forest green — success, verified, found items
    tertiary:       '#3D7A5C',
    tertiaryHover:  '#306249',
    tertiaryMuted:  '#C8E0D6',
  },
  dark: {
    background:   '#1C1510',   // warm near-black
    surface:      '#261D16',   // deep warm surface
    sunken:       '#1A110C',   // recessed areas
    border:       '#3D3028',   // dark borders
    borderStrong: '#5C4838',   // emphasized dark borders
    text: {
      primary:   '#F6F1E9',    // cream becomes text in dark mode
      secondary: '#C4B5A5',    // muted warm in dark
      muted:     '#8C7E6E',    // ghost in dark
    },
  },
  status: {
    success:        '#3D7A5C',
    successMuted:   '#C8E0D6',
    warning:        '#C4832B',
    warningMuted:   '#F0E0C8',
    error:          '#C44B2B',
    errorMuted:     '#F0D4CB',
    info:           '#2B5C8A',
    infoMuted:      '#C8D9EC',
  },
} as const

// ─────────────────────────────────────────────
// TYPOGRAPHY
// ─────────────────────────────────────────────
export const typography = {
  fonts: {
    sans: 'var(--font-geist-sans)',
    mono: 'var(--font-geist-mono)',
  },
  sizes: {
    '2xs':  '0.625rem',   // 10px
    xs:     '0.75rem',    // 12px
    sm:     '0.875rem',   // 14px
    base:   '1rem',       // 16px
    lg:     '1.125rem',   // 18px
    xl:     '1.25rem',    // 20px
    '2xl':  '1.5rem',     // 24px
    '3xl':  '1.875rem',   // 30px
    '4xl':  '2.25rem',    // 36px
    '5xl':  '3rem',       // 48px
    '6xl':  '3.75rem',    // 60px
    '7xl':  '4.5rem',     // 72px
  },
  weights: {
    normal:   '400',
    medium:   '500',
    semibold: '600',
    bold:     '700',
    extrabold:'800',
    black:    '900',
  },
  leading: {
    none:     '1',
    tight:    '1.1',
    snug:     '1.3',
    normal:   '1.5',
    relaxed:  '1.65',
    loose:    '1.8',
  },
  tracking: {
    tighter: '-0.05em',
    tight:   '-0.025em',
    normal:  '0em',
    wide:    '0.025em',
    wider:   '0.05em',
    widest:  '0.1em',
  },
} as const

// ─────────────────────────────────────────────
// SPACING — rule of thirds informed
// ─────────────────────────────────────────────
export const spacing = {
  px:   '1px',
  0.5:  '0.125rem',
  1:    '0.25rem',
  1.5:  '0.375rem',
  2:    '0.5rem',
  2.5:  '0.625rem',
  3:    '0.75rem',
  4:    '1rem',
  5:    '1.25rem',
  6:    '1.5rem',
  8:    '2rem',
  10:   '2.5rem',
  12:   '3rem',
  14:   '3.5rem',
  16:   '4rem',
  20:   '5rem',
  24:   '6rem',
  28:   '7rem',
  32:   '8rem',
  40:   '10rem',
  48:   '12rem',
  56:   '14rem',
  64:   '16rem',
} as const

// ─────────────────────────────────────────────
// BORDER RADIUS
// ─────────────────────────────────────────────
export const radii = {
  none:  '0',
  xs:    '0.125rem',
  sm:    '0.25rem',
  md:    '0.375rem',
  lg:    '0.5rem',
  xl:    '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full:  '9999px',
} as const

// ─────────────────────────────────────────────
// SHADOWS — warm tinted
// ─────────────────────────────────────────────
export const shadows = {
  xs:  '0 1px 2px rgba(28,21,16,0.04)',
  sm:  '0 1px 4px rgba(28,21,16,0.06)',
  md:  '0 4px 12px rgba(28,21,16,0.08)',
  lg:  '0 8px 24px rgba(28,21,16,0.10)',
  xl:  '0 16px 40px rgba(28,21,16,0.12)',
  '2xl':'0 24px 64px rgba(28,21,16,0.16)',
} as const

// ─────────────────────────────────────────────
// TRANSITIONS
// ─────────────────────────────────────────────
export const transitions = {
  fast:   '120ms ease',
  base:   '200ms ease',
  slow:   '350ms ease',
  spring: '300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const

// ─────────────────────────────────────────────
// BREAKPOINTS
// ─────────────────────────────────────────────
export const breakpoints = {
  sm:  '640px',
  md:  '768px',
  lg:  '1024px',
  xl:  '1280px',
  '2xl': '1536px',
} as const

// ─────────────────────────────────────────────
// Z-INDEX
// ─────────────────────────────────────────────
export const zIndex = {
  base:    0,
  raised:  10,
  dropdown:20,
  sticky:  30,
  overlay: 40,
  modal:   50,
  toast:   60,
  tooltip: 70,
} as const

// ─────────────────────────────────────────────
// CSS VARIABLE MAPPING
// Injected into :root and [data-theme="dark"]
// ─────────────────────────────────────────────
export const cssVariables = {
  light: {
    '--color-bg':              colors.base.background,
    '--color-surface':         colors.base.surface,
    '--color-sunken':          colors.base.sunken,
    '--color-border':          colors.base.border,
    '--color-border-strong':   colors.base.borderStrong,
    '--color-text':            colors.text.primary,
    '--color-text-secondary':  colors.text.secondary,
    '--color-text-muted':      colors.text.muted,
    '--color-text-inverse':    colors.text.inverse,
    '--color-text-on-accent':  colors.text.onAccent,
    '--color-accent':          colors.accent.primary,
    '--color-accent-hover':    colors.accent.primaryHover,
    '--color-accent-muted':    colors.accent.primaryMuted,
    '--color-accent-2':        colors.accent.secondary,
    '--color-accent-2-hover':  colors.accent.secondaryHover,
    '--color-accent-2-muted':  colors.accent.secondaryMuted,
    '--color-accent-3':        colors.accent.tertiary,
    '--color-accent-3-hover':  colors.accent.tertiaryHover,
    '--color-accent-3-muted':  colors.accent.tertiaryMuted,
    '--color-success':         colors.status.success,
    '--color-success-muted':   colors.status.successMuted,
    '--color-warning':         colors.status.warning,
    '--color-warning-muted':   colors.status.warningMuted,
    '--color-error':           colors.status.error,
    '--color-error-muted':     colors.status.errorMuted,
    '--color-info':            colors.status.info,
    '--color-info-muted':      colors.status.infoMuted,
    '--shadow-sm':             shadows.sm,
    '--shadow-md':             shadows.md,
    '--shadow-lg':             shadows.lg,
    '--transition-fast':       transitions.fast,
    '--transition-base':       transitions.base,
    '--transition-slow':       transitions.slow,
  },
  dark: {
    '--color-bg':              colors.dark.background,
    '--color-surface':         colors.dark.surface,
    '--color-sunken':          colors.dark.sunken,
    '--color-border':          colors.dark.border,
    '--color-border-strong':   colors.dark.borderStrong,
    '--color-text':            colors.dark.text.primary,
    '--color-text-secondary':  colors.dark.text.secondary,
    '--color-text-muted':      colors.dark.text.muted,
    '--color-text-inverse':    colors.dark.background,
    '--color-text-on-accent':  colors.text.onAccent,
    '--color-accent':          colors.accent.primary,
    '--color-accent-hover':    colors.accent.primaryHover,
    '--color-accent-muted':    '#3D1F14',
    '--color-accent-2':        colors.accent.secondary,
    '--color-accent-2-hover':  colors.accent.secondaryHover,
    '--color-accent-2-muted':  '#162840',
    '--color-accent-3':        colors.accent.tertiary,
    '--color-accent-3-hover':  colors.accent.tertiaryHover,
    '--color-accent-3-muted':  '#1A3328',
    '--color-success':         colors.status.success,
    '--color-success-muted':   '#1A3328',
    '--color-warning':         colors.status.warning,
    '--color-warning-muted':   '#3D2A10',
    '--color-error':           colors.status.error,
    '--color-error-muted':     '#3D1F14',
    '--color-info':            colors.status.info,
    '--color-info-muted':      '#162840',
    '--shadow-sm':             '0 1px 4px rgba(0,0,0,0.2)',
    '--shadow-md':             '0 4px 12px rgba(0,0,0,0.3)',
    '--shadow-lg':             '0 8px 24px rgba(0,0,0,0.4)',
    '--transition-fast':       transitions.fast,
    '--transition-base':       transitions.base,
    '--transition-slow':       transitions.slow,
  },
} as const

// ─────────────────────────────────────────────
// LAYOUT — rule of thirds grid system
// ─────────────────────────────────────────────
export const layout = {
  maxWidth: {
    xs:   '20rem',    // 320px
    sm:   '24rem',    // 384px
    md:   '28rem',    // 448px
    lg:   '32rem',    // 512px
    xl:   '36rem',    // 576px
    '2xl':'42rem',    // 672px
    '3xl':'48rem',    // 768px
    '4xl':'56rem',    // 896px
    '5xl':'64rem',    // 1024px
    '6xl':'72rem',    // 1152px
    '7xl':'80rem',    // 1280px
    full: '100%',
  },
  // Rule of thirds: 33.33% / 66.66% splits
  thirds: {
    one:   '33.333%',
    two:   '66.666%',
    three: '100%',
  },
  sidebar: {
    width:       '280px',
    collapsedWidth: '72px',
  },
  header: {
    height: '64px',
  },
} as const

// ─────────────────────────────────────────────
// COMPONENT TOKENS — specific UI defaults
// ─────────────────────────────────────────────
export const componentTokens = {
  button: {
    height: {
      sm: '2rem',
      md: '2.5rem',
      lg: '3rem',
      xl: '3.5rem',
    },
    padding: {
      sm: '0 0.75rem',
      md: '0 1rem',
      lg: '0 1.5rem',
      xl: '0 2rem',
    },
    radius: radii.lg,
  },
  input: {
    height: {
      sm: '2rem',
      md: '2.5rem',
      lg: '3rem',
    },
    radius: radii.lg,
  },
  card: {
    radius:  radii['2xl'],
    padding: spacing[6],
    shadow:  shadows.md,
  },
  badge: {
    radius:  radii.full,
    padding: '0.125rem 0.625rem',
  },
  avatar: {
    sizes: {
      xs: '1.5rem',
      sm: '2rem',
      md: '2.5rem',
      lg: '3rem',
      xl: '4rem',
    },
  },
} as const

// ─────────────────────────────────────────────
// TYPE EXPORTS for consuming components
// ─────────────────────────────────────────────
export type ColorKey         = keyof typeof colors
export type TypographySize   = keyof typeof typography.sizes
export type TypographyWeight = keyof typeof typography.weights
export type SpacingKey       = keyof typeof spacing
export type RadiusKey        = keyof typeof radii
export type ShadowKey        = keyof typeof shadows
export type BreakpointKey    = keyof typeof breakpoints
export type TransitionKey    = keyof typeof transitions
export type AccentColor      = 'primary' | 'secondary' | 'tertiary'
export type StatusColor      = 'success' | 'warning' | 'error' | 'info'
export type ButtonSize       = keyof typeof componentTokens.button.height
export type InputSize        = keyof typeof componentTokens.input.height
export type AvatarSize       = keyof typeof componentTokens.avatar.sizes