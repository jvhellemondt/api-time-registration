import type { TimeEntryModel } from '@modules/TimeRegistration/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports.ts'
import type { ListTimeEntriesItem } from '@modules/TimeRegistration/usecases/queries/ListTimeEntries/ListTimeEntries.ports.ts'

export function mapTimeEntryModelToListTimeEntriesItemMapper(entry: TimeEntryModel): ListTimeEntriesItem {
  return {
    id: entry.id,
    startTime: entry.startTime,
    endTime: entry.endTime,
    duration: {
      in: 'minutes',
      value: entry.minutes,
    },
  }
}
