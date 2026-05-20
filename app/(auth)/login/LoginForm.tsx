'use client'

// app/(auth)/login/_components/LoginForm.tsx

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Logo } from '@/components/ui/Logo'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

type FieldErrors = {
  email?:    string | undefined
  password?: string | undefined
}

export default function LoginForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl  = searchParams.get('callbackUrl') ?? '/dashboard'
  const registered   = searchParams.get('registered') === 'true'

  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [errors, setErrors]       = useState<FieldErrors>({})
  const [globalError, setGlobal]  = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  function validateClient(): boolean {
    const next: FieldErrors = {}
    if (!email.trim())    next.email    = 'Email is required'
    if (!password.trim()) next.password = 'Password is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!validateClient()) return

    setIsLoading(true)
    setGlobal(null)

    try {
      const result = await signIn('credentials', {
        email:    email.trim().toLowerCase(),
        password: password.trim(),
        redirect: false,
      })

      if (!result?.ok) {
        setGlobal('Invalid email or password. Please try again.')
        return
      }

      router.push(callbackUrl)
      router.refresh()
    } catch {
      setGlobal('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex" style={{ backgroundColor: 'var(--color-bg-val)' }}>

      {/* ── Left panel — branding 2/3 ── */}
      <div
        className="hidden lg:flex lg:w-2/3 flex-col justify-between p-16 border-r"
        style={{ backgroundColor: 'var(--color-surface-val)', borderColor: 'var(--color-border-val)' }}
      >
        <Logo size="md" />
        <div>
          <p className="text-6xl font-black tracking-tighter leading-none mb-6" style={{ color: 'var(--color-text-val)' }}>
            Welcome<br />
            <span style={{ color: 'var(--color-accent-val)' }}>back.</span>
          </p>
          <p className="text-lg max-w-md leading-relaxed" style={{ color: 'var(--color-text-secondary-val)' }}>
            Your campus property recovery hub. Report, track, and recover lost items with ease.
          </p>
        </div>
        <p className="text-sm" style={{ color: 'var(--color-text-muted-val)' }}>
          © {new Date().getFullYear()} recovly. All rights reserved.
        </p>
      </div>

      {/* ── Right panel — form 1/3 ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">

          <div className="lg:hidden mb-8">
            <Logo size="sm" />
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black tracking-tighter mb-1" style={{ color: 'var(--color-text-val)' }}>
              Sign in
            </h1>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary-val)' }}>
              No account?{' '}
              <Link href="/register" className="font-semibold hover:underline underline-offset-4" style={{ color: 'var(--color-accent2-val)' }}>
                Create one
              </Link>
            </p>
          </div>

          {registered && (
            <div className="mb-6 px-4 py-3 rounded-lg border text-sm font-medium"
              style={{ backgroundColor: 'var(--color-success-muted-val)', borderColor: 'var(--color-success-val)', color: 'var(--color-success-val)' }}>
              Account created! Sign in to continue.
            </div>
          )}

          {globalError && (
            <div className="mb-6 px-4 py-3 rounded-lg border text-sm font-medium"
              style={{ backgroundColor: 'var(--color-error-muted-val)', borderColor: 'var(--color-error-val)', color: 'var(--color-error-val)' }}>
              {globalError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@university.edu"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); setGlobal(null) }}
              error={errors.email}
              isRequired={true}
              autoComplete="email"
              autoFocus={true}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); setGlobal(null) }}
              error={errors.password}
              isRequired={true}
              autoComplete="current-password"
            />
            <Button type="submit" size="lg" isLoading={isLoading} loadingText="Signing in..." className="mt-2 w-full">
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}