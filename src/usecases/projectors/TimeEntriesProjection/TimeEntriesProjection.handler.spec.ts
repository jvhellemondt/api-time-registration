import type { Database, EventHandler, EventBus as IEventBus } from '@jvhellemondt/arts-and-crafts.ts'
import type { StoreTimeEntriesDirectivePort, TimeEntryModel } from './TimeEntriesProjection.ports'
import type { TimeEntryEvent } from '@/domain/TimeEntry/TimeEntry.decider'
import { SimpleDatabase } from '@jvhellemondt/arts-and-crafts.ts'
import { subHours } from 'date-fns'
import { v7 as uuidv7 } from 'uuid'
import { createTimeEntryRegisteredEvent } from '@/domain/TimeEntry/TimeEntryRegistered.event'
import { ListTimeEntriesInMemoryDirective } from '@/infrastructure/database/in-memory/directives/ListTimeEntries/ListTimeEntries.in-memory.directive'
import { StoreTimeEntriesInMemoryDirective } from '@/infrastructure/database/in-memory/directives/StoreTimeEntries/StoreTimeEntries.in-memory.directive'
import { EventBus } from '@/infrastructure/eventBus/EventBus'
import { TimeEntriesProjector } from './TimeEntriesProjection.handler'

describe('time-entries projector', () => {
  const collectionName = 'time_entries'
  let database: Database<TimeEntryModel>
  let eventBus: IEventBus<TimeEntryEvent>
  let projector: EventHandler<TimeEntryEvent>
  let directive: StoreTimeEntriesDirectivePort

  beforeEach(() => {
    eventBus = new EventBus()
    database = new SimpleDatabase()
    directive = new StoreTimeEntriesInMemoryDirective(collectionName, database)
    projector = new TimeEntriesProjector(directive)
    projector.start(eventBus)
  })

  it('should be defined', () => {
    expect(TimeEntriesProjector).toBeDefined()
  })

  it('should be subscribed to the eventBus and project time entries upon publish', async () => {
    const userId = uuidv7()
    const events = Array.from({ length: 5 }, () => createTimeEntryRegisteredEvent(uuidv7(), { userId, startTime: subHours(new Date(), 2).toISOString(), endTime: new Date().toISOString() }))
    await Promise.all(
      events.map(async event => eventBus.publish(event)),
    )
    const listTimeEntriesDirective = new ListTimeEntriesInMemoryDirective(collectionName, database)
    const result = await listTimeEntriesDirective.execute(userId)
    expect(result).toHaveLength(5)
  })
})
