import type { CreateStatement, Database } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryModel } from '@/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports'
import { Operation, SimpleDatabase } from '@jvhellemondt/arts-and-crafts.ts'
import { subHours } from 'date-fns'
import { v7 as uuidv7 } from 'uuid'
import { ListTimeEntriesInMemoryDirective } from './ListTimeEntries.in-memory.directive'

describe('in-memory ListTimeEntriesDirective', () => {
  const collectionName = 'time_entries'
  let database: Database<TimeEntryModel>
  const users = {
    Elon: { id: uuidv7(), name: 'Elon Musk' },
    Jeff: { id: uuidv7(), name: 'Jeff Bezos' },
    Bill: { id: uuidv7(), name: 'Bill Gates' },
    Mark: { id: uuidv7(), name: 'Mark Zuckerberg' },
  }
  const documents: TimeEntryModel[] = [
    { id: uuidv7(), userId: users.Elon.id, startTime: subHours(new Date(), 2).toISOString(), endTime: new Date().toISOString() },
    { id: uuidv7(), userId: users.Elon.id, startTime: subHours(new Date(), 3).toISOString(), endTime: subHours(new Date(), 2).toISOString() },
    { id: uuidv7(), userId: users.Elon.id, startTime: subHours(new Date(), 5).toISOString(), endTime: subHours(new Date(), 3).toISOString() },
    { id: uuidv7(), userId: users.Jeff.id, startTime: subHours(new Date(), 2).toISOString(), endTime: new Date().toISOString() },
    { id: uuidv7(), userId: users.Jeff.id, startTime: subHours(new Date(), 3).toISOString(), endTime: subHours(new Date(), 2).toISOString() },
    { id: uuidv7(), userId: users.Jeff.id, startTime: subHours(new Date(), 6).toISOString(), endTime: subHours(new Date(), 3).toISOString() },
    { id: uuidv7(), userId: users.Bill.id, startTime: subHours(new Date(), 4).toISOString(), endTime: new Date().toISOString() },
    { id: uuidv7(), userId: users.Mark.id, startTime: subHours(new Date(), 6).toISOString(), endTime: new Date().toISOString() },
  ]

  beforeAll(async () => {
    database = new SimpleDatabase()
    await Promise.all(documents.map(async (document) => {
      const statement: CreateStatement<TimeEntryModel> = { operation: Operation.CREATE, payload: document }
      await database.execute(collectionName, statement)
    }))
  })

  it('should be defined', () => {
    expect(ListTimeEntriesInMemoryDirective).toBeDefined()
  })

  it.each([
    users.Elon,
    users.Jeff,
    users.Bill,
    users.Mark,
  ])('should retrieve the documents of a user ($name)', async (user) => {
    const directive = new ListTimeEntriesInMemoryDirective(collectionName, database)
    const result = await directive.execute(user.id)
    expect(result).toStrictEqual(documents.filter(document => document.userId === user.id))
  })
})
