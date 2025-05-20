import type { Database, DomainEvent } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryProps } from '@/domain/TimeEntry/TimeEntry'
import { randomUUID } from 'node:crypto'
import { EventBus, InMemoryDatabase } from '@jvhellemondt/arts-and-crafts.ts'
import { subHours } from 'date-fns'
import { TimeEntryRegistered } from '@/domain/events/TimeEntryRegistered.event'
import { TimeEntriesByUserId } from '@/specifications/TimeEntriesByUserId'
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

  it('should add the TimeEntry to the database', async () => {
    const handler = new AfterTimeEntryRegistered(eventBus, database)
    handler.start()

    const spec = new TimeEntriesByUserId(props.userId)
    await eventBus.publish(event)

    const results = await database.query('time-entries', spec)
    expect(results[0]).toStrictEqual({ id: aggregateId, ...props })
  })
})
