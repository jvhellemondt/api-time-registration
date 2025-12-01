import type { Database } from '@arts-n-crafts/ts'
import type { TimeEntryModel } from '@modules/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports.ts'
import { SimpleDatabase } from '@arts-n-crafts/ts'
import {
  mapTimeEntryModelToListTimeEntriesItemMapper,
} from '@modules/mappers/mapTimeEntryModelToListTimeEntriesItem.mapper.ts'
import { subHours } from 'date-fns'
import { v7 as uuidv7 } from 'uuid'
import { ListTimeEntriesInMemoryDirective } from '../ListTimeEntries/ListTimeEntries.in-memory.directive.ts'
import { StoreTimeEntriesInMemoryDirective } from './StoreTimeEntries.in-memory.directive.ts'

describe('in-memory StoreTimeEntriesDirective', () => {
  const stream = 'time_entries'
  let database: Database<TimeEntryModel>
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

  beforeEach(async () => {
    database = new SimpleDatabase()
  })

  it('should be defined', () => {
    expect(StoreTimeEntriesInMemoryDirective).toBeDefined()
  })

  it.each([
    users.Elon,
    users.Jeff,
    users.Bill,
    users.Mark,
  ])('should store the documents of $name', async (user) => {
    const storeDirective = new StoreTimeEntriesInMemoryDirective(stream, database)
    await Promise.all(
      documents.map(async (document) => {
        await storeDirective.execute(document)
      }),
    )
    const listDirective = new ListTimeEntriesInMemoryDirective(stream, database)
    const result = await listDirective.execute(user.id)
    expect(result).toStrictEqual(
      documents
        .filter(document => document.userId === user.id)
        .map(mapTimeEntryModelToListTimeEntriesItemMapper),
    )
  })
})
