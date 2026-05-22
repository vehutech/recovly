// lib/notifications.ts

import { prisma } from '@/lib/prisma'
import type { NotificationType } from '@prisma/client'

type CreateNotificationParams = {
  userId:  string
  type:    NotificationType
  title:   string
  message: string
  link?:   string | undefined
}

export async function createNotification(params: CreateNotificationParams): Promise<void> {
  await prisma.notification.create({
    data: {
      userId:  params.userId,
      type:    params.type,
      title:   params.title,
      message: params.message,
      link:    params.link ?? null,
    },
  })
}

export async function createMatchNotification(
  userId:      string,
  itemName:    string,
  matchId:     string,
  score:       number,
): Promise<void> {
  await createNotification({
    userId,
    type:    'MATCH_FOUND',
    title:   'Match found for your item',
    message: `A possible match (${score}% confidence) was found for your item "${itemName}". Review it and submit a claim if it's yours.`,
    link:    `/my-items?match=${matchId}`,
  })
}