import type { CreateStatement, Database } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryModel } from '@/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports'
import { Operation, SimpleDatabase } from '@jvhellemondt/arts-and-crafts.ts'
import { subHours } from 'date-fns'
import { v7 as uuidv7 } from 'uuid'
import { ListTimeEntriesInMemoryDirective } from '@/infrastructure/database/in-memory/directives/ListTimeEntries/ListTimeEntries.in-memory.directive'
import { ListTimeEntriesByUserIdHandler } from './ListTimeEntries.handler'
import { listTimeEntriesByUserIdPayload } from './ListTimeEntries.ports'
import { createListTimeEntriesByUserIdQuery } from './ListTimeEntries.query'

describe('listTimeEntriesByUserIdHandler', () => {
  const collectionName = 'time_entries'
  const users = {
    Elon: { id: uuidv7(), name: 'Elon Musk' },
    Jeff: { id: uuidv7(), name: 'Jeff Bezos' },
  }
  const documents: TimeEntryModel[] = [
    { id: uuidv7(), userId: users.Elon.id, startTime: subHours(new Date(), 2).toISOString(), endTime: new Date().toISOString() },
    { id: uuidv7(), userId: users.Elon.id, startTime: subHours(new Date(), 3).toISOString(), endTime: subHours(new Date(), 2).toISOString() },
    { id: uuidv7(), userId: users.Jeff.id, startTime: subHours(new Date(), 2).toISOString(), endTime: new Date().toISOString() },
    { id: uuidv7(), userId: users.Jeff.id, startTime: subHours(new Date(), 6).toISOString(), endTime: subHours(new Date(), 2).toISOString() },
  ]

  let database: Database<TimeEntryModel>
  let directive: ListTimeEntriesInMemoryDirective

  beforeAll(async () => {
    database = new SimpleDatabase()
    await Promise.all(documents.map(async (document) => {
      const statement: CreateStatement<TimeEntryModel> = { operation: Operation.CREATE, payload: document }
      await database.execute(collectionName, statement)
    }))
  })

  beforeEach(async () => {
    directive = new ListTimeEntriesInMemoryDirective(collectionName, database)
  })

  it('should be defined', () => {
    expect(ListTimeEntriesByUserIdHandler).toBeDefined()
  })

  it.each([
    users.Elon,
    users.Jeff,
  ])('should retrieve the time entries for $name', async (user) => {
    const aPayload = listTimeEntriesByUserIdPayload.parse({ userId: user.id })
    const aQuery = createListTimeEntriesByUserIdQuery(aPayload)
    const anHandler = new ListTimeEntriesByUserIdHandler(directive)
    const result = await anHandler.execute(aQuery)
    expect(result).toStrictEqual(documents.filter(document => document.userId === user.id))
  })
})
