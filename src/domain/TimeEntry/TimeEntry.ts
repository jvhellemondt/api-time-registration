import type { DomainEvent } from '@jvhellemondt/crafts-and-arts.ts'
import type { UUID } from 'node:crypto'
import { AggregateRoot } from '@jvhellemondt/crafts-and-arts.ts'

interface TimeEntryProps {
  userId: UUID
  endTime: Date
}

export class TimeEntry extends AggregateRoot<TimeEntryProps> {
  static create(props: TimeEntryProps, id: UUID) {
    const aggregate = new this(props, id)
    return aggregate
  }

  protected _applyEvent(_event: DomainEvent<unknown>): void {
    throw new Error('Method not implemented.')
  }
}
