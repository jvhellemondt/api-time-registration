import type { RegisterTimeEntryCommandPayload } from './RegisterTimeEntry.ports.ts'
import { createCommand } from '@arts-n-crafts/ts'

export function createRegisterTimeEntryCommand(aggregateId: string, props: RegisterTimeEntryCommandPayload) {
  return createCommand('RegisterTimeEntry', aggregateId, props)
}

export type RegisterTimeEntryCommand = ReturnType<typeof createRegisterTimeEntryCommand>
