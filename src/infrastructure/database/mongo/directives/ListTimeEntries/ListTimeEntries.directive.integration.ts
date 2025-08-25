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
import { mapIdToMongoId } from '../../utils/mapMongoId'
import { ListTimeEntriesDirective } from './ListTimeEntries.directive'

describe('mongodb ListTimeEntriesDirective', () => {
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
    await collection
      .insertMany(documents.map(mapIdToMongoId))
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
    const directive = new ListTimeEntriesDirective(collection)
    const result = await directive.execute(user.id)
    expect(result).toStrictEqual(
      documents
        .filter(document => document.userId === user.id)
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
        .map(mapTimeEntryModelToListTimeEntriesItemMapper),
    )
  })
})
