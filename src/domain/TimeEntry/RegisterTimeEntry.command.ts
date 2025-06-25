import type { UUID } from 'node:crypto'
import type { RegisterTimeEntryOutput } from '@/usecases/commands/RegisterTimeEntry/ports/inbound.ts'
import { createCommand } from '@jvhellemondt/arts-and-crafts.ts'

export function RegisterTimeEntry(aggregateId: UUID, props: RegisterTimeEntryOutput) {
  return createCommand('RegisterTimeEntry', aggregateId, props)
}
