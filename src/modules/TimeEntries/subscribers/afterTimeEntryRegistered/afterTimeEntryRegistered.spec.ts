import type { Database, DomainEvent, FilledArray } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryProps } from '@/TimeEntries/domain/TimeEntry/TimeEntry'
import { randomUUID } from 'node:crypto'
import { EventBus, InMemoryDatabase, Specification } from '@jvhellemondt/arts-and-crafts.ts'
import { subHours } from 'date-fns'
import { TimeEntryRegistered } from '@/TimeEntries/domain/events/TimeEntryRegistered.event'
import { AfterTimeEntryRegistered } from './afterTimeEntryRegistered'

describe('afterTimeEntryRegistered subscriber', () => {
  let aggregateId: string
  let props: TimeEntryProps
  let eventBus: EventBus
  let database: Database
  let event: DomainEvent

  beforeEach(() => {
    aggregateId = randomUUID()
    eventBus = new EventBus()
    database = new InMemoryDatabase()

    props = {
      userId: randomUUID(),
      startTime: subHours(new Date(), 3),
      endTime: new Date(),
    }
    event = TimeEntryRegistered(aggregateId, props)
  })

  it('should be defined', () => {
    expect(AfterTimeEntryRegistered).toBeDefined()
  })

  it('should implement ProjectionHandler', () => {
    const handler = new AfterTimeEntryRegistered(eventBus, database)
    expect(handler.start).toThrow()
  })

  it('should add the TimeEntry to the database', async () => {
    const handler = new AfterTimeEntryRegistered(eventBus, database)
    handler.start()

    class GetTimeEntryById extends Specification<DomainEvent<TimeEntryProps>> {
      constructor(
        private readonly id: string,
      ) {
        super()
      }

      isSatisfiedBy(candidate: DomainEvent<TimeEntryProps>): boolean {
        return candidate.aggregateId === this.id
      }

      toQuery(): FilledArray {
        return [{ id: this.id }]
      }
    }
    const spec = new GetTimeEntryById(aggregateId)
    await eventBus.publish(event)

    const results = await database.query('time-entries', spec)
    expect(results[0]).toStrictEqual({ id: aggregateId, ...props })
  })
})
