import type { Database } from '@arts-n-crafts/ts'
import type { TimeEntryModel } from '@modules/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports.ts'
import type { UseCollection } from '../../useCollection.ts'
import { SimpleDatabase } from '@arts-n-crafts/ts'
import {
  StoreTimeEntriesInMemoryDirective,
} from '@modules/infrastructure/database/in-memory/directives/StoreTimeEntries/StoreTimeEntries.in-memory.directive.ts'
import { subHours } from 'date-fns'
import { v7 as uuidv7 } from 'uuid'

import { useCollection } from '../../useCollection.ts'
import { ListTimeEntriesInMemoryDirective } from '../ListTimeEntries/ListTimeEntries.in-memory.directive.ts'
import { UpdateTimeEntriesInMemoryDirective } from './UpdateTimeEntries.in-memory.directive.ts'

describe('in-memory UpdateTimeEntriesDirective', () => {
  let database: Database<TimeEntryModel>
  let collection: UseCollection<TimeEntryModel>
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
    collection = useCollection(database, 'time_entries')
  })

  it('should be defined', () => {
    expect(UpdateTimeEntriesInMemoryDirective).toBeDefined()
  })

  it.each([
    users.Elon,
    users.Jeff,
    users.Bill,
    users.Mark,
  ])('should update the documents of $name', async (user) => {
    const storeDirective = new StoreTimeEntriesInMemoryDirective(collection)
    await Promise.all(
      documents.map(async (document) => {
        await storeDirective.execute(document)
      }),
    )
    const updateDirective = new UpdateTimeEntriesInMemoryDirective(collection)
    const updateStatement = { id: documents.filter(({ userId }) => userId === user.id)[0].id, startTime: subHours(new Date(), 5).getTime() }
    await updateDirective.execute(updateStatement)

    const listDirective = new ListTimeEntriesInMemoryDirective(collection)
    const result = await listDirective.execute(user.id)
    expect(result[0].id).toStrictEqual(updateStatement.id)
    expect(result[0].startTime).toStrictEqual(updateStatement.startTime)
  })
})
