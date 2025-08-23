import type { Collection, Db, MongoClient } from 'mongodb'
import type { MongoRecord } from '../../MongoRecord'
import type { TimeEntryModel } from '@/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports'
import { subHours } from 'date-fns'
import { v7 as uuidv7 } from 'uuid'
import {
  mapTimeEntryModelToListTimeEntriesItemMapper,
} from '@/mappers/mapTimeEntryModelToListTimeEntriesItem.mapper.ts'
import { getClient } from '../..'
import { useCollection } from '../../useCollection'
import { ListTimeEntriesDirective } from '../ListTimeEntries/ListTimeEntries.directive'
import { StoreTimeEntriesDirective } from './StoreTimeEntries.directive'

const now = new Date()

describe('mongodb StoreTimeEntriesDirective', () => {
  let client: MongoClient
  let database: Db
  let collection: Collection<MongoRecord<TimeEntryModel>>
  const users = {
    Elon: { id: uuidv7(), name: 'Elon Musk' },
    Jeff: { id: uuidv7(), name: 'Jeff Bezos' },
    Bill: { id: uuidv7(), name: 'Bill Gates' },
    Mark: { id: uuidv7(), name: 'Mark Zuckerberg' },
  }
  const documents: TimeEntryModel[] = [
    { id: uuidv7(), userId: users.Elon.id, startTime: subHours(now, 2).toISOString(), endTime: now.toISOString() },
    { id: uuidv7(), userId: users.Elon.id, startTime: subHours(now, 3).toISOString(), endTime: subHours(now, 2).toISOString() },
    { id: uuidv7(), userId: users.Elon.id, startTime: subHours(now, 5).toISOString(), endTime: subHours(now, 3).toISOString() },
    { id: uuidv7(), userId: users.Jeff.id, startTime: subHours(now, 2).toISOString(), endTime: now.toISOString() },
    { id: uuidv7(), userId: users.Jeff.id, startTime: subHours(now, 3).toISOString(), endTime: subHours(now, 2).toISOString() },
    { id: uuidv7(), userId: users.Jeff.id, startTime: subHours(now, 6).toISOString(), endTime: subHours(now, 3).toISOString() },
    { id: uuidv7(), userId: users.Bill.id, startTime: subHours(now, 4).toISOString(), endTime: now.toISOString() },
    { id: uuidv7(), userId: users.Mark.id, startTime: subHours(now, 6).toISOString(), endTime: now.toISOString() },
  ]

  beforeAll(async () => {
    client = await getClient()
    database = client.db()
    collection = useCollection(database)<MongoRecord<TimeEntryModel>>('time_entries')
  })

  afterAll(async () => {
    await client.close()
  })

  it('should be defined', () => {
    expect(StoreTimeEntriesDirective).toBeDefined()
  })

  it.each([
    users.Elon,
    users.Jeff,
    users.Bill,
    users.Mark,
  ]) ('should store the documents of $name', async (user) => {
    const docs = documents.filter(document => document.userId === user.id).sort((a, b) => a.startTime.localeCompare(b.startTime))
    const storeDirective = new StoreTimeEntriesDirective(collection)
    await Promise.all(
      docs.map(async document => storeDirective.execute(document)),
    )
    const listDirective = new ListTimeEntriesDirective(collection)
    const result = await listDirective.execute(user.id)
    expect(result).toStrictEqual(
      docs
        .map(mapTimeEntryModelToListTimeEntriesItemMapper),
    )
  })
})
