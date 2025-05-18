import type { FilledArray, Specification } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryModel } from '../infrastructure/models/TimeEntry.model'

export class TimeEntriesByUserId implements Specification {
  constructor(private id: string) {}

  toQuery(): FilledArray {
    return [{ userId: this.id }]
  }

  isSatisfiedBy(candidate: TimeEntryModel): boolean {
    return candidate.userId === this.id
  }
}
