import type { Database } from '@jvhellemondt/arts-and-crafts.ts'
import type { RegisterTimeEntryOutput } from '@/usecases/commands/RegisterTimeEntry/ports/inbound'
import { randomUUID } from 'node:crypto'
import { InMemoryDatabase, Operation } from '@jvhellemondt/arts-and-crafts.ts'
import { subHours } from 'date-fns'
import { ListTimeEntriesQuery } from '@/infrastructure/queryAdapters/ListTimeEntriesQuery'
import { TimeEntriesProjectionHandler } from '@/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.handler'
import { ListTimeEntriesByUserIdHandler } from './ListTimeEntries.handler'
import { listTimeEntriesByUserId } from './ListTimeEntries.query'
import { listTimeEntriesByUserIdPayload } from './ports/inbound'

describe('listTimeEntriesByUserIdHandler', () => {
  let database: Database
  let listTimeEntriesQuery: ListTimeEntriesQuery
  const aggregateId = randomUUID()
  const entry: RegisterTimeEntryOutput = {
    userId: randomUUID(),
    startTime: subHours(new Date(), 1).toISOString(),
    endTime: new Date().toISOString(),
  }
  const dbRecord = { id: aggregateId, user_id: entry.userId, start_time: entry.startTime, end_time: entry.endTime }

  beforeEach(async () => {
    database = new InMemoryDatabase()
    listTimeEntriesQuery = new ListTimeEntriesQuery(TimeEntriesProjectionHandler.tableName, database)
    await database.execute(TimeEntriesProjectionHandler.tableName, { operation: Operation.CREATE, payload: dbRecord })
  })

  it('should be defined', () => {
    expect(ListTimeEntriesByUserIdHandler).toBeDefined()
  })

  it('should retrieve the time entries', async () => {
    const aPayload = listTimeEntriesByUserIdPayload.parse({ userId: entry.userId })
    const aQuery = listTimeEntriesByUserId(aPayload)
    const handler = new ListTimeEntriesByUserIdHandler(listTimeEntriesQuery)
    const result = await handler.execute(aQuery)
    expect(result).toStrictEqual([{ id: aggregateId, ...entry }])
  })
})
