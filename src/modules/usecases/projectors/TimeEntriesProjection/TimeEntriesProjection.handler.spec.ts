import type { Database, EventConsumer, EventHandler, EventProducer } from '@arts-n-crafts/ts'
import type { TimeEntryEvent } from '@modules/domain/TimeEntry/TimeEntry.decider.ts'
import type { UseCollection } from '@modules/infrastructure/database/in-memory/useCollection.ts'
import type { StoreTimeEntriesDirectivePort, TimeEntryModel } from './TimeEntriesProjection.ports.ts'
import { SimpleDatabase } from '@arts-n-crafts/ts'
import { createTimeEntryRegisteredEvent } from '@modules/domain/TimeEntry/TimeEntryRegistered.event.ts'
import {
  ListTimeEntriesInMemoryDirective,
} from '@modules/infrastructure/database/in-memory/directives/ListTimeEntries/ListTimeEntries.in-memory.directive.ts'
import {
  StoreTimeEntriesInMemoryDirective,
} from '@modules/infrastructure/database/in-memory/directives/StoreTimeEntries/StoreTimeEntries.in-memory.directive.ts'
import { useCollection } from '@modules/infrastructure/database/in-memory/useCollection.ts'
import { EventBus } from '@modules/infrastructure/eventBus/EventBus.ts'
import { subHours } from 'date-fns'
import { v7 as uuidv7 } from 'uuid'
import { TimeEntriesProjector } from './TimeEntriesProjection.handler.ts'

describe('time-entries projector', () => {
  const stream = 'time_entries'
  let database: Database<TimeEntryModel>
  let collection: UseCollection<TimeEntryModel>
  let eventBus: EventConsumer<TimeEntryEvent> & EventProducer<TimeEntryEvent>
  let projector: EventHandler<TimeEntryEvent>
  let directive: StoreTimeEntriesDirectivePort

  beforeEach(() => {
    eventBus = new EventBus()
    database = new SimpleDatabase()
    collection = useCollection(database, stream)
    directive = new StoreTimeEntriesInMemoryDirective(collection)
    projector = new TimeEntriesProjector(directive)
    eventBus.subscribe(stream, projector)
  })

  it('should be defined', () => {
    expect(TimeEntriesProjector).toBeDefined()
  })
  describe('timeEntryRegistered event', () => {
    it('should be subscribed to the eventBus\' TimeEntryRegistered event and project time entries upon publish', async () => {
      const userId = uuidv7()
      const events = Array.from({ length: 5 }, () => createTimeEntryRegisteredEvent(uuidv7(), {
        userId,
        startTime: subHours(new Date(), 2).toISOString(),
        endTime: new Date().toISOString(),
      }))
      await Promise.all(
        events.map(async event => eventBus.publish(stream, event)),
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
})
