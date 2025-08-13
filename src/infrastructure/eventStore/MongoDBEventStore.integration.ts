import type { MongoClient } from 'mongodb'
import { subHours } from 'date-fns'
import { v7 as uuidv7 } from 'uuid'
import { createTimeEntryRegisteredEvent } from '@/domain/TimeEntry/TimeEntryRegistered.event'
import { getClient } from '../database/Mongodb.client'
import { eventStore } from './MongoDBEventStore'

describe('mongodb EventStore', () => {
  const streamName = 'time_entries'
  let client: MongoClient
  const event = createTimeEntryRegisteredEvent(
    uuidv7(),
    { userId: uuidv7(), startTime: subHours(new Date(), 2).toISOString(), endTime: new Date().toISOString() },
  )

  beforeAll(async () => {
    client = await getClient()
  })

  afterAll(async () => {
    await client.close()
  })

  it('should be defined', () => {
    expect(eventStore).toBeDefined()
  })

  it('should store the event', async () => {
    const promise = eventStore(client.db()).append(streamName, [event])
    await expect(promise).resolves.not.toThrow()
  })

  it('should load the stored event', async () => {
    const result = await eventStore(client.db()).load(streamName, event.aggregateId)
    expect(result.length).toBeGreaterThan(0)
    expect(result.findLast(e => e.id === event.id)).toStrictEqual(event)
  })
})
