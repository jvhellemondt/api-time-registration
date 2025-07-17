import type { withId } from '@/types/withId'

export type ListTimeEntriesByUserIdResult = {
  userId: string
  startTime: string
  endTime: string
} & withId
