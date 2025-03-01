import type { TimeEntryProps } from '@/domain/TimeEntry/TimeEntry'
import type { AggregateRoot } from '@jvhellemondt/crafts-and-arts.ts'
import { TimeEntryRepository } from '../TimeEntryRepository'

export class InMemoryTimeEntryRepository extends TimeEntryRepository {
  load(_aggregateId: string): Promise<AggregateRoot<TimeEntryProps>> {
    throw new Error('Method not implemented.')
  }

  store(_aggregate: AggregateRoot<TimeEntryProps>): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
