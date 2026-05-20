'use client'

// app/(auth)/register/page.tsx

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Logo } from '@/components/ui/Logo'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Role } from '@prisma/client'
import type { ApiResponse, SafeUser } from '@/types'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
type FieldErrors = {
  name?:       string | undefined
  email?:      string | undefined
  password?:   string | undefined
  department?: string | undefined
  studentId?:  string | undefined
}

type FormState = {
  name:       string
  email:      string
  password:   string
  confirm:    string
  role:       Role
  department: string
  studentId:  string
}

const INITIAL_FORM: FormState = {
  name:       '',
  email:      '',
  password:   '',
  confirm:    '',
  role:       Role.STUDENT,
  department: '',
  studentId:  '',
}

export default function RegisterPage() {
  const router = useRouter()

  const [form, setForm]           = useState<FormState>(INITIAL_FORM)
  const [errors, setErrors]       = useState<FieldErrors>({})
  const [globalError, setGlobal]  = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  function handleChange(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
      setErrors((prev) => ({ ...prev, [field]: undefined }))
      setGlobal(null)
    }
  }

  function validateClient(): boolean {
    const next: FieldErrors = {}

    if (!form.name.trim())              next.name     = 'Name is required'
    if (!form.email.trim())             next.email    = 'Email is required'
    if (!form.password)                 next.password = 'Password is required'
    else if (form.password.length < 8)  next.password = 'Password must be at least 8 characters'
    else if (!/[A-Z]/.test(form.password)) next.password = 'Password must contain an uppercase letter'
    else if (!/[0-9]/.test(form.password)) next.password = 'Password must contain a number'
    else if (form.password !== form.confirm) next.password = 'Passwords do not match'

    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!validateClient()) return

    setIsLoading(true)
    setGlobal(null)

    try {
      const res = await fetch('/api/auth/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:       form.name.trim(),
          email:      form.email.trim().toLowerCase(),
          password:   form.password,
          role:       form.role,
          department: form.department || undefined,
          studentId:  form.studentId  || undefined,
        }),
      })

      const data = await res.json() as ApiResponse<SafeUser>

      if (!data.success) {
        if ('details' in data && data.details) {
          const fieldErrs: FieldErrors = {}
          for (const [key, msgs] of Object.entries(data.details)) {
            if (msgs[0]) {
              fieldErrs[key as keyof FieldErrors] = msgs[0]
            }
          }
          setErrors(fieldErrs)
        } else {
          setGlobal(data.error)
        }
        return
      }

      // Auto sign in after registration
      const signInResult = await signIn('credentials', {
        email:    form.email.trim().toLowerCase(),
        password: form.password,
        redirect: false,
      })

      if (signInResult?.ok) {
        router.push('/dashboard')
        router.refresh()
      } else {
        router.push('/login?registered=true')
      }
    } catch {
      setGlobal('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-bg flex">
      {/* ── Left panel — branding 2/3 ── */}
      <div className="hidden lg:flex lg:w-2/3 bg-surface border-r border-border flex-col justify-between p-16">
        <Logo size="md" />
        <div>
          <p className="text-6xl font-black tracking-tighter text-text leading-none mb-6">
            Lost it?<br />
            <span className="text-accent">We&rquo;ll find it.</span>
          </p>
          <p className="text-text-secondary text-lg max-w-md leading-relaxed">
            Report lost items, get matched with found ones, and recover what matters — all in one place.
          </p>
        </div>
        <p className="text-text-muted text-sm">
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
            <h1 className="text-3xl font-black tracking-tighter text-text mb-1">
              Create account
            </h1>
            <p className="text-text-secondary text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-accent2 font-semibold hover:underline underline-offset-4">
                Sign in
              </Link>
            </p>
          </div>

          {globalError && (
            <div className="mb-6 px-4 py-3 rounded-lg bg-error-muted border border-error text-error text-sm font-medium">
              {globalError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <Input
              label="Full name"
              type="text"
              placeholder="Gabriel Alafin"
              value={form.name}
              onChange={handleChange('name')}
              error={errors.name}
              isRequired={true}
              autoComplete="name"
              autoFocus={true}
            />

            <Input
              label="Email address"
              type="email"
              placeholder="you@university.edu"
              value={form.email}
              onChange={handleChange('email')}
              error={errors.email}
              isRequired={true}
              autoComplete="email"
            />

            {/* Role selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text">
                I am a <span className="text-error ml-1" aria-hidden>*</span>
              </label>
              <select
                value={form.role}
                onChange={handleChange('role')}
                className="w-full h-10 px-3 rounded-lg border border-border bg-sunken text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent hover:border-border-strong transition-all"
              >
                <option value={Role.STUDENT}>Student</option>
                <option value={Role.STAFF}>Staff</option>
              </select>
            </div>

            <Input
              label="Department"
              type="text"
              placeholder="Computer Science"
              value={form.department}
              onChange={handleChange('department')}
              hint="Optional"
            />

            <Input
              label="Student / Staff ID"
              type="text"
              placeholder="STU/2021/001"
              value={form.studentId}
              onChange={handleChange('studentId')}
              hint="Optional"
            />

            <Input
              label="Password"
              type="password"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={handleChange('password')}
              error={errors.password}
              isRequired={true}
              autoComplete="new-password"
              hint="Must contain an uppercase letter and a number"
            />

            <Input
              label="Confirm password"
              type="password"
              placeholder="Re-enter your password"
              value={form.confirm}
              onChange={handleChange('confirm')}
              isRequired={true}
              autoComplete="new-password"
            />

            <Button
              type="submit"
              size="lg"
              isLoading={isLoading}
              loadingText="Creating account..."
              className="mt-2 w-full"
            >
              Create account
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}