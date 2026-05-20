import { z } from 'zod'

// ─────────────────────────────────────────────
// ENV SCHEMA — all environment variables typed and validated
// App will throw at startup if any required var is missing
// ─────────────────────────────────────────────

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),

  // NextAuth
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
  NEXTAUTH_URL:    z.string().url('NEXTAUTH_URL must be a valid URL'),

  // App
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Optional — email notifications
  SMTP_HOST:     z.string().optional(),
  SMTP_PORT:     z.string().optional(),
  SMTP_USER:     z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM:     z.string().email().optional(),

  // Optional — file uploads (e.g. Cloudinary)
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY:    z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
})

// ─────────────────────────────────────────────
// PARSE & VALIDATE
// ─────────────────────────────────────────────
const _parsed = envSchema.safeParse(process.env)

if (!_parsed.success) {
  console.error('❌ Invalid environment variables:')
  console.error(_parsed.error.flatten().fieldErrors)
  throw new Error('Invalid environment variables. Check .env file.')
}

export const env = _parsed.data

// ─────────────────────────────────────────────
// DERIVED TYPE
// ─────────────────────────────────────────────
export type Env = z.infer<typeof envSchema>