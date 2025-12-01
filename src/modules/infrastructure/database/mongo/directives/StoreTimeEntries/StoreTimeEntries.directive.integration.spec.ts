import type { TimeEntryModel } from '@modules/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports.ts'
import type { Db, MongoClient } from 'mongodb'
import {
  mapTimeEntryModelToListTimeEntriesItemMapper,
} from '@modules/mappers/mapTimeEntryModelToListTimeEntriesItem.mapper.ts'
import { subHours } from 'date-fns'
import { v7 as uuidv7 } from 'uuid'
import { getClient } from '../../index.ts'
import { ListTimeEntriesDirective } from '../ListTimeEntries/ListTimeEntries.directive.ts'
import { StoreTimeEntriesDirective } from './StoreTimeEntries.directive.ts'

describe('mongodb StoreTimeEntriesDirective', () => {
  const stream = 'time_entries'
  let client: MongoClient
  let database: Db
  const users = {
    Elon: { id: uuidv7(), name: 'Elon Musk' },
    Jeff: { id: uuidv7(), name: 'Jeff Bezos' },
    Bill: { id: uuidv7(), name: 'Bill Gates' },
    Mark: { id: uuidv7(), name: 'Mark Zuckerberg' },
  }
  const documents: TimeEntryModel[] = [
    { id: uuidv7(), userId: users.Elon.id, startTime: subHours(new Date(), 2).getTime(), endTime: new Date().getTime(), minutes: 120 },
    { id: uuidv7(), userId: users.Elon.id, startTime: subHours(new Date(), 3).getTime(), endTime: subHours(new Date(), 2).getTime(), minutes: 60 },
    { id: uuidv7(), userId: users.Elon.id, startTime: subHours(new Date(), 5).getTime(), endTime: subHours(new Date(), 3).getTime(), minutes: 120 },
    { id: uuidv7(), userId: users.Jeff.id, startTime: subHours(new Date(), 2).getTime(), endTime: new Date().getTime(), minutes: 120 },
    { id: uuidv7(), userId: users.Jeff.id, startTime: subHours(new Date(), 3).getTime(), endTime: subHours(new Date(), 2).getTime(), minutes: 60 },
    { id: uuidv7(), userId: users.Jeff.id, startTime: subHours(new Date(), 6).getTime(), endTime: subHours(new Date(), 3).getTime(), minutes: 180 },
    { id: uuidv7(), userId: users.Bill.id, startTime: subHours(new Date(), 4).getTime(), endTime: new Date().getTime(), minutes: 240 },
    { id: uuidv7(), userId: users.Mark.id, startTime: subHours(new Date(), 6).getTime(), endTime: new Date().getTime(), minutes: 360 },
  ]

  beforeAll(async () => {
    client = await getClient()
    database = client.db()
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
    const docs = documents.filter(document => document.userId === user.id).sort((a, b) => a.startTime - b.startTime)
    const storeDirective = new StoreTimeEntriesDirective(stream, database)
    await Promise.all(
      docs.map(async document => storeDirective.execute(document)),
    )
    const listDirective = new ListTimeEntriesDirective(stream, database)
    const result = await listDirective.execute(user.id)
    expect(result).toStrictEqual(
      docs
        .map(mapTimeEntryModelToListTimeEntriesItemMapper),
    )
  })
})
