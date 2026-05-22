// app/api/matches/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { paginationSchema } from '@/lib/validations'
import { apiSuccess, apiError } from '@/lib/api'
import type { ApiResponse, MatchWithItems, PaginatedResponse } from '@/types'

const USER_SELECT = {
  id: true, name: true, email: true, role: true,
  avatarUrl: true, phone: true, department: true,
  studentId: true, isActive: true, emailVerified: true,
  createdAt: true, updatedAt: true,
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<PaginatedResponse<MatchWithItems>>>> {
  try {
    const session = await auth()
    if (!session?.user) return apiError('Unauthorised', 401)

    const { searchParams } = request.nextUrl

    const pagination = paginationSchema.parse({
      page:  searchParams.get('page')  ?? 1,
      limit: searchParams.get('limit') ?? 20,
    })

    // Return matches where user owns either the lost or found item
    const where = {
      OR: [
        { lostItem:  { userId: session.user.id } },
        { foundItem: { userId: session.user.id } },
      ],
    }

    const [matches, total] = await Promise.all([
      prisma.match.findMany({
        where,
        include: {
          lostItem:  { include: { user: { select: USER_SELECT } } },
          foundItem: { include: { user: { select: USER_SELECT } } },
          claim:     true,
        },
        orderBy: { score: 'desc' },
        skip:    (pagination.page - 1) * pagination.limit,
        take:    pagination.limit,
      }),
      prisma.match.count({ where }),
    ])

    const totalPages = Math.ceil(total / pagination.limit)

    return apiSuccess({
      data:       matches as MatchWithItems[],
      total,
      page:       pagination.page,
      limit:      pagination.limit,
      totalPages,
      hasNext:    pagination.page < totalPages,
      hasPrev:    pagination.page > 1,
    })
  } catch (error) {
    console.error('[GET /api/matches]', error)
    return apiError('Internal server error', 500)
  }
}