import type { TimeEntryModel } from '@/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports'

export interface ListTimeEntriesQueryPort {
  execute: (userId: string) => Promise<TimeEntryModel[]>
}
