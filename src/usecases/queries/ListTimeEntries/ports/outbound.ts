import type { WithIdentifier } from '@jvhellemondt/arts-and-crafts.ts'

export type TimeEntries = {
  userId: string
  startTime: string
  endTime: string
} & WithIdentifier
