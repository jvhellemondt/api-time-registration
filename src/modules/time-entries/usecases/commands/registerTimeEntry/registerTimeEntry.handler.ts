import type { RegisterTimeEntryPayload } from '@/modules/time-entries/usecases/commands/registerTimeEntry/ports/inbound.ts'
import { Effect, pipe, Schema } from 'effect'
import {
  registerTimeEntryPayload,

} from '@/modules/time-entries/usecases/commands/registerTimeEntry/ports/inbound.ts'

export function registerTimeEntry(input: RegisterTimeEntryPayload) {
  return pipe(
    input,
    Schema.decodeSync(registerTimeEntryPayload),
    Effect.succeed,
  )
}
