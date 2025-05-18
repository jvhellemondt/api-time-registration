import type { DomainEvent } from '@jvhellemondt/arts-and-crafts.ts'
import type { UUID } from 'node:crypto'
import { AggregateRoot, isDomainEvent } from '@jvhellemondt/arts-and-crafts.ts'
import { invariant } from '@shared/utils/invariant/invariant'
import { TimeEntryRegistered } from '../events/TimeEntryRegistered.event'

export interface TimeEntryProps {
  userId: UUID
  startTime: Date
  endTime: Date
}

export class TimeEntry extends AggregateRoot<TimeEntryProps> {
  static create(id: UUID, props: TimeEntryProps) {
    const aggregate = new this(id, props)
    aggregate.apply(TimeEntryRegistered(id, props))
    return aggregate
  }

  static rehydrate(id: string, events: DomainEvent<unknown>[]): TimeEntry {
    const creationEvent = events.shift()
    invariant(isDomainEvent<TimeEntryProps>(creationEvent), () => {
      throw new TypeError('Invalid creation event found')
    })
    invariant(creationEvent.type === 'TimeEntryRegistered', () => {
      throw new TypeError('Invalid creation event found')
    })

    const aggregate = new this(id, creationEvent.payload)
    events.forEach(event => aggregate._applyEvent(event))
    return aggregate
  }

  protected _applyEvent(event: DomainEvent<unknown>): void {
    if (event.type === 'TimeEntryRegistered') {
      return void 0
    }
  }
}
