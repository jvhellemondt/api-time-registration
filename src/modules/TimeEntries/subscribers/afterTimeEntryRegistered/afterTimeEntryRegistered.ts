import type { DatabaseRecord, DomainEvent } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryProps } from '@/TimeEntries/domain/TimeEntry/TimeEntry'
import { Operation, ProjectionHandler } from '@jvhellemondt/arts-and-crafts.ts'

export class AfterTimeEntryRegistered extends ProjectionHandler {
  start(): void {
    this.eventBus.subscribe(this)
  }

  async update(event: DomainEvent<TimeEntryProps>): Promise<void> {
    switch (event.type) {
      case 'TimeEntryRegistered': {
        const payload: DatabaseRecord = { id: event.aggregateId, ...event.payload }
        await this.database.execute('time-entries', { operation: Operation.CREATE, payload })
        break
      }
    }
  }
}
