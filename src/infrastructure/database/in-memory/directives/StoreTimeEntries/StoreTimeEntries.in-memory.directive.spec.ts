import type { Database } from '@jvhellemondt/arts-and-crafts.ts'
import type { UseCollection } from '../../useCollection'
import type { TimeEntryModel } from '@/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports'
import { SimpleDatabase } from '@jvhellemondt/arts-and-crafts.ts'
import { subHours } from 'date-fns'
import { v7 as uuidv7 } from 'uuid'
import {
  mapTimeEntryModelToListTimeEntriesItemMapper,
} from '@/mappers/mapTimeEntryModelToListTimeEntriesItem.mapper.ts'
import { useCollection } from '../../useCollection'
import { ListTimeEntriesInMemoryDirective } from '../ListTimeEntries/ListTimeEntries.in-memory.directive'
import { StoreTimeEntriesInMemoryDirective } from './StoreTimeEntries.in-memory.directive'

describe('in-memory StoreTimeEntriesDirective', () => {
  let database: Database<TimeEntryModel>
  let collection: UseCollection<TimeEntryModel>
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

  beforeEach(async () => {
    database = new SimpleDatabase()
    collection = useCollection(database, 'time_entries')
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
    const storeDirective = new StoreTimeEntriesInMemoryDirective(collection)
    await Promise.all(
      documents.map(async (document) => {
        await storeDirective.execute(document)
      }),
    )
    const listDirective = new ListTimeEntriesInMemoryDirective(collection)
    const result = await listDirective.execute(user.id)
    expect(result).toStrictEqual(
      documents
        .filter(document => document.userId === user.id)
        .map(mapTimeEntryModelToListTimeEntriesItemMapper),
    )
  })
})
