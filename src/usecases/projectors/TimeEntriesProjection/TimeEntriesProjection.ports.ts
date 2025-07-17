import type { withId } from '@/types/withId'
import type { RegisterTimeEntryCommandPayload } from '@/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.ports'

export type TimeEntryModel = RegisterTimeEntryCommandPayload & withId
