import type { DomainEvent } from '@jvhellemondt/arts-and-crafts.ts'
import type { UUID } from 'node:crypto'
import { AggregateRoot } from '@jvhellemondt/arts-and-crafts.ts'
import { TimeEntryRegistered } from '../events/TimeEntryRegistered.event'

export interface TimeEntryProps {
  userId: UUID
  startTime: Date
  endTime: Date
}

export class TimeEntry extends AggregateRoot<TimeEntryProps> {
  static create(props: TimeEntryProps, id: UUID) {
    const aggregate = new this(props, id)
    aggregate.apply(new TimeEntryRegistered(id, props))
    return aggregate
  }

  static rehydrate(id: string, events: DomainEvent<unknown>[]): TimeEntry {
    const creationEvent = events.shift()
    if (!(creationEvent instanceof TimeEntryRegistered)) {
      throw new TypeError('Invalid creation event found')
    }
    const aggregate = new this(creationEvent.payload, id)
    events.forEach(event => aggregate._applyEvent(event))
    return aggregate
  }

  protected _applyEvent(event: DomainEvent<unknown>): void {
    if (event instanceof TimeEntryRegistered) {
      return void 0
    }
  }
}
