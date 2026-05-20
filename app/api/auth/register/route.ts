// app/api/auth/register/route.ts

import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/validations'
import type { ApiResponse, SafeUser } from '@/types'

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<SafeUser>>> {
  try {
    const body: unknown = await request.json()

    // Validate input
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error:   'Validation failed',
          details: parsed.error.flatten().fieldErrors as Record<string, string[]>,
        },
        { status: 400 }
      )
    }

    const { name, email, password, role, department, studentId, phone } = parsed.data

    // Check if email already exists
    const existing = await prisma.user.findUnique({
      where:  { email },
      select: { id: true },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password:   hashedPassword,
        role,
        department: department ?? null,
        studentId:  studentId  ?? null,
        phone:      phone      ?? null,
      },
      select: {
        id:            true,
        name:          true,
        email:         true,
        role:          true,
        avatarUrl:     true,
        phone:         true,
        department:    true,
        studentId:     true,
        isActive:      true,
        emailVerified: true,
        createdAt:     true,
        updatedAt:     true,
      },
    })

    return NextResponse.json(
      { success: true, data: user, message: 'Account created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('[REGISTER]', error)
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}