import type { DatabaseRecord } from '@jvhellemondt/arts-and-crafts.ts'

export interface ListTimeEntriesByUserIdResult extends DatabaseRecord {
  userId: string
  startTime: string
  endTime: string
}
