import type { Database, EventBus } from '@jvhellemondt/arts-and-crafts.ts'
import { randomUUID } from 'node:crypto'
import { FieldEquals, InMemoryDatabase, InMemoryEventBus } from '@jvhellemondt/arts-and-crafts.ts'
import { timeEntryRegistered } from '@/domain/TimeEntry/TimeEntryRegistered.event'
import { TimeEntriesProjectionHandler } from './TimeEntriesProjection.handler'

describe('afterTimeEntryRegisteredHandler', () => {
  let eventBus: EventBus
  let handler: TimeEntriesProjectionHandler
  let database: Database

  beforeAll(() => {
    eventBus = new InMemoryEventBus()
    database = new InMemoryDatabase()
    handler = new TimeEntriesProjectionHandler(eventBus, database)
    handler.start()
  })

  it('should be defined', () => {
    expect(TimeEntriesProjectionHandler).toBeDefined()
  })

  it('should make the projection of the time entry', async () => {
    const event = timeEntryRegistered(randomUUID(), { userId: randomUUID(), startTime: new Date().toISOString(), endTime: new Date().toISOString() })
    await eventBus.publish(event)
    const specification = new FieldEquals('userId', event.payload.userId)
    const result = await database.query(TimeEntriesProjectionHandler.tableName, specification)
    expect(result).toHaveLength(1)
    expect(result[0].userId).toBe(event.payload.userId)
  })
})
