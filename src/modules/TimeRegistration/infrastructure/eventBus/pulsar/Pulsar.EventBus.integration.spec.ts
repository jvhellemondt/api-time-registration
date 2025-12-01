import type { Database, EventProducer } from '@arts-n-crafts/ts'
import type { TimeEntryEvent } from '@modules/TimeRegistration/domain/TimeEntry/TimeEntry.decider.ts'
import type { TimeEntryModel } from '@modules/TimeRegistration/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports.ts'
import { SimpleDatabase } from '@arts-n-crafts/ts'
import { createTimeEntryRegisteredEvent } from '@modules/TimeRegistration/domain/TimeEntry/TimeEntryRegistered.event.ts'
import {
  ListTimeEntriesInMemoryDirective,
} from '@modules/TimeRegistration/infrastructure/database/in-memory/directives/ListTimeEntries/ListTimeEntries.in-memory.directive.ts'
import {
  StoreTimeEntriesInMemoryDirective,
} from '@modules/TimeRegistration/infrastructure/database/in-memory/directives/StoreTimeEntries/StoreTimeEntries.in-memory.directive.ts'
import { InMemoryOutbox } from '@modules/TimeRegistration/infrastructure/eventBus/pulsar/InMemoryOutbox.ts'
import { PulsarEventConsumer } from '@modules/TimeRegistration/infrastructure/eventBus/pulsar/Pulsar.EventConsumer.ts'
import { PulsarEventProducer } from '@modules/TimeRegistration/infrastructure/eventBus/pulsar/Pulsar.EventProducer.ts'
import {
  TimeEntriesProjector,
} from '@modules/TimeRegistration/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.handler.ts'
import { subHours } from 'date-fns'
import { v7 as uuidv7 } from 'uuid'

async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe.skip('producer', () => {
  const stream = 'time_entries'
  let producer: EventProducer<TimeEntryEvent>
  let consumer: PulsarEventConsumer
  let database: Database<TimeEntryModel>
  let outbox: InMemoryOutbox<TimeEntryEvent>

  beforeAll(async () => {
    const broker = 'localhost:8080'
    outbox = new InMemoryOutbox()
    producer = new PulsarEventProducer(`http://${broker}`)
    consumer = new PulsarEventConsumer(`ws://${broker}`, stream, outbox)

    await consumer.connect()
    await wait(500)
  })

  beforeEach(() => {
    database = new SimpleDatabase()
    consumer.subscribe(stream, new TimeEntriesProjector(new StoreTimeEntriesInMemoryDirective(stream, database)))
  })

  afterAll(() => {
    consumer.disconnect()
  })

  it('should publish and consume messages from Pulsar', async () => {
    const aggregateId = uuidv7()
    const userId = uuidv7()
    const startTime = subHours(new Date(), 2).getTime()
    const endTime = new Date().getTime()
    const event = createTimeEntryRegisteredEvent(aggregateId, { userId, startTime, endTime })
    await producer.publish(stream, event)
    await wait(1000)
    await consumer.tick()

    const listDirective = new ListTimeEntriesInMemoryDirective(stream, database)
    const result = await listDirective.execute(userId)

    expect(result).toStrictEqual([{
      id: aggregateId,
      startTime,
      endTime,
      duration: {
        in: 'minutes',
        value: 120,
      },
    }])
  }, 5_000)
})
