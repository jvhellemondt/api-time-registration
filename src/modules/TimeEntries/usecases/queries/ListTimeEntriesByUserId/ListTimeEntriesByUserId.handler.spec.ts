import type { Database } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryModel } from '@/TimeEntries/infrastructure/models/TimeEntry.model'
import { randomUUID } from 'node:crypto'
import { InMemoryDatabase, Operation } from '@jvhellemondt/arts-and-crafts.ts'
import { ListTimeEntriesByUserIdHandler } from './ListTimeEntriesByUserId.handler'
import { ListTimeEntriesByUserId } from './ListTimeEntriesByUserId.query'

describe('handler ListTimeEntriesByUserId', () => {
  const userId = randomUUID()
  let database: Database
  let fixture: TimeEntryModel[]

  beforeEach(async () => {
    database = new InMemoryDatabase()
    fixture = [
      { id: randomUUID(), userId, startTime: new Date(), endTime: new Date() },
      { id: randomUUID(), userId, startTime: new Date(), endTime: new Date() },
      { id: randomUUID(), userId, startTime: new Date(), endTime: new Date() },
      { id: randomUUID(), userId, startTime: new Date(), endTime: new Date() },
    ]
    await Promise.all(
      fixture.map(payload =>
        database.execute('time-entries', { operation: Operation.CREATE, payload }),
      ),
    )
  })

  it('should be defined', () => {
    expect(ListTimeEntriesByUserIdHandler).toBeDefined()
  })

  it('should retrieve the data from the database', async () => {
    const query = ListTimeEntriesByUserId({ userId })
    const handler = new ListTimeEntriesByUserIdHandler(database)

    const results = await handler.execute(query)
    expect(results.items).toHaveLength(4)
  })
})
