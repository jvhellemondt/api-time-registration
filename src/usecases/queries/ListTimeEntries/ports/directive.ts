import type { TimeEntryModel } from '@/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports'

export interface ListTimeEntriesDirectivePort {
  execute: (userId: string) => Promise<TimeEntryModel[]>
}
