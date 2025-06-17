import { Schema } from 'effect'

export const registerTimeEntryResult = Schema.Struct({
  id: Schema.UUID,
})
