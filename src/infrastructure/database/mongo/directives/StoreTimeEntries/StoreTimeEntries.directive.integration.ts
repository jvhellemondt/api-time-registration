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
    { id: uuidv7(), userId: users.Elon.id, startTime: subHours(new Date(), 2).toISOString(), endTime: new Date().toISOString(), minutes: 120 },
    { id: uuidv7(), userId: users.Elon.id, startTime: subHours(new Date(), 3).toISOString(), endTime: subHours(new Date(), 2).toISOString(), minutes: 60 },
    { id: uuidv7(), userId: users.Elon.id, startTime: subHours(new Date(), 5).toISOString(), endTime: subHours(new Date(), 3).toISOString(), minutes: 120 },
    { id: uuidv7(), userId: users.Jeff.id, startTime: subHours(new Date(), 2).toISOString(), endTime: new Date().toISOString(), minutes: 120 },
    { id: uuidv7(), userId: users.Jeff.id, startTime: subHours(new Date(), 3).toISOString(), endTime: subHours(new Date(), 2).toISOString(), minutes: 60 },
    { id: uuidv7(), userId: users.Jeff.id, startTime: subHours(new Date(), 6).toISOString(), endTime: subHours(new Date(), 3).toISOString(), minutes: 180 },
    { id: uuidv7(), userId: users.Bill.id, startTime: subHours(new Date(), 4).toISOString(), endTime: new Date().toISOString(), minutes: 240 },
    { id: uuidv7(), userId: users.Mark.id, startTime: subHours(new Date(), 6).toISOString(), endTime: new Date().toISOString(), minutes: 360 },
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
