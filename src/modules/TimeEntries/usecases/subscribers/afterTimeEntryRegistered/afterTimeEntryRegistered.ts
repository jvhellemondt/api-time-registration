import type { DomainEvent } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryProps } from '@/TimeEntries/domain/TimeEntry/TimeEntry'
import type { TimeEntryModel } from '@/TimeEntries/infrastructure/models/TimeEntry.model'
import { Operation, ProjectionHandler } from '@jvhellemondt/arts-and-crafts.ts'

export class AfterTimeEntryRegistered extends ProjectionHandler {
  start(): void {
    this.eventBus.subscribe(this)
  }

  async update(event: DomainEvent<TimeEntryProps>): Promise<void> {
    switch (event.type) {
      case 'TimeEntryRegistered': {
        const payload: TimeEntryModel = { id: event.aggregateId, ...event.payload }
        await this.database.execute('time-entries', { operation: Operation.CREATE, payload })
        break
      }
    }
  }
}
