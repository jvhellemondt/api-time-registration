import type { UUID } from 'node:crypto'

export interface ListTimeEntriesByUserIdPayload {
  userId: UUID
}
