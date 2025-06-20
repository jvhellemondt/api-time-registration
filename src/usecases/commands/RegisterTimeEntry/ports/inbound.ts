import { Schema } from 'effect'

// export interface RegisterTimeEntryPayload {
//   userId: UUID
//   startTime: Date
//   endTime: Date
// }

export const registerTimeEntryPayload = Schema.Struct({
  userId: Schema.UUID,
  startTime: Schema.DateTimeUtc,
  endTime: Schema.DateTimeUtc,
})

export type RegisterTimeEntryPayload = typeof registerTimeEntryPayload.Type
