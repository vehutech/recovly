/**
 * Prisma client singleton for Next.js.
 * Activate by running: npx prisma generate
 * then uncommenting the implementation below.
 */

// Placeholder type until prisma generate runs
export type PrismaClientType = Record<string, unknown>

const _prisma: PrismaClientType | null = null

export function getPrisma(): PrismaClientType {
  if (!_prisma) {
    throw new Error(
      'Prisma client not initialised. Run `npx prisma generate` and update this file.'
    )
  }
  return _prisma
}

export const prisma = {} as PrismaClientType