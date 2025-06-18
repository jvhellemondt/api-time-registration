import { Schema } from 'effect'

export const registerTimeEntryPayload = Schema.Struct({
  userId: Schema.UUID,
  startTime: Schema.DateFromString,
  endTime: Schema.DateFromString,
})

export type RegisterTimeEntryPayload = Schema.Schema.Encoded<typeof registerTimeEntryPayload>
