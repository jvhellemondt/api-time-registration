import type { UUID } from 'node:crypto'

export interface RegisterTimeEntryPayload {
  userId: UUID
  startTime: Date
  endTime: Date
}
