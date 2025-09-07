import type { RegisterTimeEntryCommandPayload } from './RegisterTimeEntry.ports.ts'
import { createCommand } from '@jvhellemondt/arts-and-crafts.ts'

export function createRegisterTimeEntryCommand(aggregateId: string, props: RegisterTimeEntryCommandPayload) {
  return createCommand('RegisterTimeEntry', aggregateId, props)
}

export type RegisterTimeEntryCommand = ReturnType<typeof createRegisterTimeEntryCommand>
