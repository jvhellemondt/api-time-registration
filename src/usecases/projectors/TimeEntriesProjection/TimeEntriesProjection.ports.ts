import type { WithIdentifier } from '@jvhellemondt/arts-and-crafts.ts'
import type { RegisterTimeEntryCommandPayload } from '@/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.ports'

export type TimeEntryModel = RegisterTimeEntryCommandPayload & WithIdentifier

export interface StoreTimeEntriesDirectivePort {
  execute: (payload: TimeEntryModel) => Promise<void>
}
