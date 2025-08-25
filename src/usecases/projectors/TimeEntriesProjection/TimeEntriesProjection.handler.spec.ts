import type { Database, EventHandler, EventBus as IEventBus } from '@jvhellemondt/arts-and-crafts.ts'
import type { StoreTimeEntriesDirectivePort, TimeEntryModel } from './TimeEntriesProjection.ports'
import type { TimeEntryEvent } from '@/domain/TimeEntry/TimeEntry.decider'
import type { UseCollection } from '@/infrastructure/database/in-memory/useCollection'
import { SimpleDatabase } from '@jvhellemondt/arts-and-crafts.ts'
import { subHours } from 'date-fns'
import { v7 as uuidv7 } from 'uuid'
import { createTimeEntryRegisteredEvent } from '@/domain/TimeEntry/TimeEntryRegistered.event'
import { ListTimeEntriesInMemoryDirective } from '@/infrastructure/database/in-memory/directives/ListTimeEntries/ListTimeEntries.in-memory.directive'
import { StoreTimeEntriesInMemoryDirective } from '@/infrastructure/database/in-memory/directives/StoreTimeEntries/StoreTimeEntries.in-memory.directive'
import { useCollection } from '@/infrastructure/database/in-memory/useCollection'
import { EventBus } from '@/infrastructure/eventBus/EventBus'
import { TimeEntriesProjector } from './TimeEntriesProjection.handler'

describe('time-entries projector', () => {
  let database: Database<TimeEntryModel>
  let collection: UseCollection<TimeEntryModel>
  let eventBus: IEventBus<TimeEntryEvent>
  let projector: EventHandler<TimeEntryEvent>
  let directive: StoreTimeEntriesDirectivePort

  beforeEach(() => {
    eventBus = new EventBus()
    database = new SimpleDatabase()
    collection = useCollection(database, 'time_entries')
    directive = new StoreTimeEntriesInMemoryDirective(collection)
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
    const listTimeEntriesDirective = new ListTimeEntriesInMemoryDirective(collection)
    const result = await listTimeEntriesDirective.execute(userId)
    expect(result).toHaveLength(5)

    expect(result.at(0)).toStrictEqual({
      id: events[0].aggregateId,
      startTime: events[0].payload.startTime,
      endTime: events[0].payload.endTime,
      duration: {
        in: 'minutes',
        value: 120,
      },
    })
  })
})
