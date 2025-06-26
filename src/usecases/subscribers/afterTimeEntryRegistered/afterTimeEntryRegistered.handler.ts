import type { DomainEvent, ProjectionHandler } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryEvent } from '@/domain/TimeEntry/TimeEntry.decider'

export class AfterTimeEntryRegisteredHandler implements ProjectionHandler<TimeEntryEvent> {
  start() {
    throw new Error('Method not implemented.')
  }

  async handle(_anEvent: DomainEvent<{ userId: string, startTime: string, endTime: string }>) {
    throw new Error('Method not implemented.')
  }
}
