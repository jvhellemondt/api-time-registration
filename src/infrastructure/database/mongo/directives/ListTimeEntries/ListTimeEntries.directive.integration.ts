import type { Db, MongoClient } from 'mongodb'
import type { TimeEntryModel } from '@/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports'
import { subHours } from 'date-fns'
import { v7 as uuidv7 } from 'uuid'
import { getClient } from '../../Mongodb.client'
import { ListTimeEntriesDirective } from './ListTimeEntries.directive'

describe('mongodb ListTimeEntriesDirective', () => {
  const collectionName = 'time_entries'
  let client: MongoClient
  let database: Db
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
    client = await getClient()
    database = client.db()
    await database
      .collection<TimeEntryModel>(collectionName)
      .insertMany(structuredClone(documents))
  })

  afterAll(async () => {
    await client.close()
  })

  it('should be defined', () => {
    expect(ListTimeEntriesDirective).toBeDefined()
  })

  it.each([
    users.Elon,
    users.Jeff,
    users.Bill,
    users.Mark,
  ])('should retrieve the documents of a user ($name)', async (user) => {
    const directive = new ListTimeEntriesDirective(collectionName, database)
    const result = await directive.execute(user.id)
    expect(result).toStrictEqual(documents.filter(document => document.userId === user.id))
  })
})
