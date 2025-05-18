import type { UUID } from 'node:crypto'
import type { RegisterTimeEntryPayload } from './ports/inbound'
import { createCommand } from '@jvhellemondt/arts-and-crafts.ts'

export function RegisterTimeEntry(aggregateId: UUID, props: RegisterTimeEntryPayload) {
  return createCommand('RegisterTimeEntry', aggregateId, props)
}
