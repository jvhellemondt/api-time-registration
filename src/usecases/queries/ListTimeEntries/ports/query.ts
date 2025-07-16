import type { ListTimeEntriesByUserIdResult } from './outbound'

export interface ListTimeEntriesQueryPort {
  execute: (userId: string) => Promise<ListTimeEntriesByUserIdResult[]>
}
