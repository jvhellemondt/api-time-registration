import type { withId } from '@/types/withId'

export type TimeEntries = {
  userId: string
  startTime: string
  endTime: string
} & withId
