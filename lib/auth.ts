// lib/auth.ts

import NextAuth, { type DefaultSession } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { loginSchema } from '@/lib/validations'
import type { Role } from '@prisma/client'

// ─────────────────────────────────────────────
// MODULE AUGMENTATION
// Extends NextAuth's built-in types with our
// custom fields on Session and JWT
// ─────────────────────────────────────────────
declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id:        string
      role:      Role
      avatarUrl: string | null
    }
  }

  interface User {
    id:        string
    role:      Role
    avatarUrl: string | null
  }
}

// ─────────────────────────────────────────────
// NEXTAUTH CONFIG
// ─────────────────────────────────────────────
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    error:  '/login',
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data

        const user = await prisma.user.findUnique({
          where:  { email },
          select: {
            id:        true,
            name:      true,
            email:     true,
            password:  true,
            role:      true,
            avatarUrl: true,
            isActive:  true,
          },
        })

        if (!user || !user.isActive) return null

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) return null

        return {
          id:        user.id,
          name:      user.name,
          email:     user.email,
          role:      user.role,
          avatarUrl: user.avatarUrl,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token['id']        = user.id
        token['role']      = user.role
        token['avatarUrl'] = user.avatarUrl
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id:        token['id']        as string,
          role:      token['role']      as Role,
          avatarUrl: token['avatarUrl'] as string | null,
        },
      }
    },
  },
})