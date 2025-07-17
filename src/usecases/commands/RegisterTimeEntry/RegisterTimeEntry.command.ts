import type { UUID } from 'node:crypto'
import type { RegisterTimeEntryCommandPayload } from './RegisterTimeEntry.ports'
import { createCommand } from '@jvhellemondt/arts-and-crafts.ts'

export function registerTimeEntry(aggregateId: UUID, props: RegisterTimeEntryCommandPayload) {
  return createCommand('RegisterTimeEntry', aggregateId, props)
}
