// lib/validations.ts

import { z } from 'zod'
import { Role, ItemStatus, ClaimStatus } from '@prisma/client'
import { ITEM_CATEGORIES } from '@/types'

const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .toLowerCase()
  .trim()

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be less than 72 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters')
  .trim()

const descriptionSchema = z
  .string()
  .min(10, 'Please provide at least 10 characters of description')
  .max(1000, 'Description must be less than 1000 characters')
  .trim()

const locationSchema = z
  .string()
  .min(2, 'Location must be at least 2 characters')
  .max(200, 'Location must be less than 200 characters')
  .trim()

const optionalUrl = z.string().url('Must be a valid URL').optional()

const categorySchema = z.enum(
  ITEM_CATEGORIES as unknown as [string, ...string[]]
)

const optionalString = (max: number) =>
  z.string().max(max).trim().optional()

export const registerSchema = z.object({
  name:       nameSchema,
  email:      emailSchema,
  password:   passwordSchema,
  role:       z.nativeEnum(Role).default(Role.STUDENT),
  department: optionalString(100),
  studentId:  optionalString(50),
  phone:      z
    .string()
    .regex(/^\+?[\d\s\-()]{7,20}$/, 'Please enter a valid phone number')
    .optional(),
})

export const loginSchema = z.object({
  email:    emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export const updateProfileSchema = z.object({
  name:       nameSchema,
  department: optionalString(100),
  studentId:  optionalString(50),
  phone:      z
    .string()
    .regex(/^\+?[\d\s\-()]{7,20}$/, 'Invalid phone number')
    .optional(),
  avatarUrl:  optionalUrl,
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword:     passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path:    ['confirmPassword'],
  })

export const lostItemSchema = z.object({
  name:        nameSchema,
  description: descriptionSchema,
  category:    categorySchema,
  color:       optionalString(50),
  size:        optionalString(50),
  brand:       optionalString(100),
  location:    locationSchema,
  dateLost:    z
    .string()
    .transform((v) => new Date(v))
    .refine((d) => !isNaN(d.getTime()), 'Please enter a valid date')
    .refine((d) => d <= new Date(), 'Date cannot be in the future'),
  imageUrl:    optionalUrl,
})

export const foundItemSchema = z.object({
  name:        nameSchema,
  description: descriptionSchema,
  category:    categorySchema,
  color:       optionalString(50),
  size:        optionalString(50),
  brand:       optionalString(100),
  location:    locationSchema,
  dateFound:   z
    .string()
    .transform((v) => new Date(v))
    .refine((d) => !isNaN(d.getTime()), 'Please enter a valid date')
    .refine((d) => d <= new Date(), 'Date cannot be in the future'),
  imageUrl:    optionalUrl,
})

export const updateLostItemSchema  = lostItemSchema.partial().extend({
  status: z.nativeEnum(ItemStatus).optional(),
})

export const updateFoundItemSchema = foundItemSchema.partial().extend({
  status: z.nativeEnum(ItemStatus).optional(),
})

export const claimSchema = z.object({
  matchId:  z.string().min(1, 'Match ID is required'),
  message:  z.string().max(500, 'Message must be less than 500 characters').optional(),
  proofUrl: optionalUrl,
})

export const claimReviewSchema = z.object({
  claimId:    z.string().min(1, 'Claim ID is required'),
  status:     z.enum([ClaimStatus.APPROVED, ClaimStatus.REJECTED]),
  reviewNote: z.string().max(500).optional(),
})

export const itemFilterSchema = z.object({
  category: categorySchema.optional(),
  status:   z.nativeEnum(ItemStatus).optional(),
  location: z.string().max(200).trim().optional(),
  dateFrom: z.string().transform((v) => v ? new Date(v) : undefined).optional(),
  dateTo:   z.string().transform((v) => v ? new Date(v) : undefined).optional(),
  search:   z.string().max(200).trim().optional(),
})

export const paginationSchema = z.object({
  page:  z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
})

export type RegisterSchema       = z.infer<typeof registerSchema>
export type LoginSchema          = z.infer<typeof loginSchema>
export type UpdateProfileSchema  = z.infer<typeof updateProfileSchema>
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>
export type LostItemSchema       = z.infer<typeof lostItemSchema>
export type FoundItemSchema      = z.infer<typeof foundItemSchema>
export type ClaimSchema          = z.infer<typeof claimSchema>
export type ClaimReviewSchema    = z.infer<typeof claimReviewSchema>
export type ItemFilterSchema     = z.infer<typeof itemFilterSchema>
export type PaginationSchema     = z.infer<typeof paginationSchema>