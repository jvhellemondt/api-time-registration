import type { Database, EventBus } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryEvent } from '@/domain/TimeEntry/TimeEntry.decider'
import type { TimeEntryModel } from '@/infrastructure/models/TimeEntry.model'
import { randomUUID } from 'node:crypto'
import { InMemoryDatabase, InMemoryEventBus } from '@jvhellemondt/arts-and-crafts.ts'
import { timeEntryRegistered } from '@/domain/TimeEntry/TimeEntryRegistered.event'
import { TimeEntriesProjectionHandler } from './TimeEntriesProjection.handler'

describe('afterTimeEntryRegisteredHandler', () => {
  let eventBus: EventBus<TimeEntryEvent>
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
    const result = await database.query<TimeEntryModel>(TimeEntriesProjectionHandler.tableName, [{ user_id: event.payload.userId }])
    expect(result).toHaveLength(1)
    expect(result[0].user_id).toBe(event.payload.userId)
  })
})
