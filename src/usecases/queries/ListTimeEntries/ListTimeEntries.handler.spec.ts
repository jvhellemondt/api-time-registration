import type { Database } from '@jvhellemondt/arts-and-crafts.ts'
import type { RegisterTimeEntryCommandPayload } from '@/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.ports'
import { InMemoryDatabase, Operation } from '@jvhellemondt/arts-and-crafts.ts'
import { subHours } from 'date-fns'
import { v7 as uuidv7 } from 'uuid'
import { ListTimeEntriesQuery } from '@/infrastructure/database/queries/ListTimeEntriesQuery/ListTimeEntriesQuery'
import { TimeEntriesProjectionHandler } from '@/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.handler'
import { ListTimeEntriesByUserIdHandler } from './ListTimeEntries.handler'
import { createListTimeEntriesByUserIdQuery } from './ListTimeEntries.query'
import { listTimeEntriesByUserIdPayload } from './ports/inbound'

describe('listTimeEntriesByUserIdHandler', () => {
  let database: Database
  let listTimeEntriesQuery: ListTimeEntriesQuery
  const aggregateId = uuidv7()
  const entry: RegisterTimeEntryCommandPayload = {
    userId: uuidv7(),
    startTime: subHours(new Date(), 1).toISOString(),
    endTime: new Date().toISOString(),
  }

  beforeEach(async () => {
    database = new InMemoryDatabase()
    listTimeEntriesQuery = new ListTimeEntriesQuery(TimeEntriesProjectionHandler.tableName, database)
    await database.execute(TimeEntriesProjectionHandler.tableName, { operation: Operation.CREATE, payload: { id: aggregateId, ...entry } })
  })

  it('should be defined', () => {
    expect(ListTimeEntriesByUserIdHandler).toBeDefined()
  })

  it('should retrieve the time entries', async () => {
    const aPayload = listTimeEntriesByUserIdPayload.parse({ userId: entry.userId })
    const aQuery = createListTimeEntriesByUserIdQuery(aPayload)
    const handler = new ListTimeEntriesByUserIdHandler(listTimeEntriesQuery)
    const result = await handler.execute(aQuery)
    expect(result).toStrictEqual([{ id: aggregateId, ...entry }])
  })
})
