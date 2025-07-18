import type { RegisterTimeEntryCommandPayload } from './RegisterTimeEntry.ports'
import { createCommand } from '@jvhellemondt/arts-and-crafts.ts'

export function registerTimeEntry(aggregateId: string, props: RegisterTimeEntryCommandPayload) {
  return createCommand('RegisterTimeEntry', aggregateId, props)
}
