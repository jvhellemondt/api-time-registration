import type { TimeEntryModel } from '../models/TimeEntry.model'
import type { ListTimeEntriesByUserIdResult } from '@/usecases/queries/ListTimeEntries/ports/outbound'

export function mapModelToResult(entry: TimeEntryModel): ListTimeEntriesByUserIdResult {
  return {
    id: entry.id,
    userId: entry.user_id,
    startTime: entry.start_time,
    endTime: entry.end_time,
  }
}
