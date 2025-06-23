import { Schema } from 'effect'

export const registerTimeEntryPayload = Schema.Struct({
  userId: Schema.UUID,
  startTime: Schema.DateTimeUtc,
  endTime: Schema.DateTimeUtc,
})

export type RegisterTimeEntryInput = typeof registerTimeEntryPayload.Encoded
export type RegisterTimeEntryPayload = typeof registerTimeEntryPayload.Type
