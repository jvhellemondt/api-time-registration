import type { Database } from '@jvhellemondt/arts-and-crafts.ts'
import type { RegisterTimeEntryOutput } from '@/usecases/commands/RegisterTimeEntry/ports/inbound'
import { randomUUID } from 'node:crypto'
import { InMemoryDatabase, Operation } from '@jvhellemondt/arts-and-crafts.ts'
import { subHours } from 'date-fns'
import { ListTimeEntriesByUserIdHandler } from './ListTimeEntries.handler'
import { listTimeEntriesByUserId } from './ListTimeEntries.query'
import { listTimeEntriesByUserIdPayload } from './ports/inbound'

describe('listTimeEntriesByUserIdHandler', () => {
  const store = 'time_entries'
  let database: Database
  const userId = randomUUID()
  const aggregateId = randomUUID()
  const now = new Date()
  const entry: RegisterTimeEntryOutput = {
    userId,
    startTime: subHours(now, 1).toISOString(),
    endTime: now.toISOString(),
  }
  const dbRecord = { id: aggregateId, ...entry }

  beforeEach(async () => {
    database = new InMemoryDatabase()
    await database.execute(store, { operation: Operation.CREATE, payload: dbRecord })
  })

  it('should be defined', () => {
    expect(ListTimeEntriesByUserIdHandler).toBeDefined()
  })

  it('should retrieve the time entries', async () => {
    const aPayload = listTimeEntriesByUserIdPayload.parse({ userId })
    const aQuery = listTimeEntriesByUserId(aPayload)
    const handler = new ListTimeEntriesByUserIdHandler(database)
    const result = await handler.execute(aQuery)
    expect(result).toStrictEqual([dbRecord])
  })
})
