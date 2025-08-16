import type { WithIdentifier } from '@jvhellemondt/arts-and-crafts.ts'

export type TimeEntryModel = {
  userId: string
  startTime: string
  endTime: string
} & WithIdentifier

export interface StoreTimeEntriesDirectivePort {
  execute: (payload: TimeEntryModel) => Promise<void>
}
