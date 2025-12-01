import type { CreateStatement, Database } from '@arts-n-crafts/ts'
import type { TimeEntryModel } from '@modules/TimeRegistration/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports.ts'
import { Operation, SimpleDatabase } from '@arts-n-crafts/ts'
import {
  mapTimeEntryModelToListTimeEntriesItemMapper,
} from '@modules/TimeRegistration/mappers/mapTimeEntryModelToListTimeEntriesItem.mapper.ts'
import { subHours } from 'date-fns'
import { v7 as uuidv7 } from 'uuid'
import { ListTimeEntriesInMemoryDirective } from './ListTimeEntries.in-memory.directive.ts'

describe('in-memory ListTimeEntriesDirective', () => {
  const stream = 'time_entries'
  let database: Database<TimeEntryModel>
  const users = {
    Elon: { id: uuidv7(), name: 'Elon Musk' },
    Jeff: { id: uuidv7(), name: 'Jeff Bezos' },
    Bill: { id: uuidv7(), name: 'Bill Gates' },
    Mark: { id: uuidv7(), name: 'Mark Zuckerberg' },
  }
  const documents: TimeEntryModel[] = [
    {
      id: uuidv7(),
      userId: users.Elon.id,
      startTime: subHours(new Date(), 2).getTime(),
      endTime: new Date().getTime(),
      minutes: 120,
    },
    {
      id: uuidv7(),
      userId: users.Elon.id,
      startTime: subHours(new Date(), 3).getTime(),
      endTime: subHours(new Date(), 2).getTime(),
      minutes: 60,
    },
    {
      id: uuidv7(),
      userId: users.Elon.id,
      startTime: subHours(new Date(), 5).getTime(),
      endTime: subHours(new Date(), 3).getTime(),
      minutes: 120,
    },
    {
      id: uuidv7(),
      userId: users.Jeff.id,
      startTime: subHours(new Date(), 2).getTime(),
      endTime: new Date().getTime(),
      minutes: 120,
    },
    {
      id: uuidv7(),
      userId: users.Jeff.id,
      startTime: subHours(new Date(), 3).getTime(),
      endTime: subHours(new Date(), 2).getTime(),
      minutes: 60,
    },
    {
      id: uuidv7(),
      userId: users.Jeff.id,
      startTime: subHours(new Date(), 6).getTime(),
      endTime: subHours(new Date(), 3).getTime(),
      minutes: 180,
    },
    {
      id: uuidv7(),
      userId: users.Bill.id,
      startTime: subHours(new Date(), 4).getTime(),
      endTime: new Date().getTime(),
      minutes: 240,
    },
    {
      id: uuidv7(),
      userId: users.Mark.id,
      startTime: subHours(new Date(), 6).getTime(),
      endTime: new Date().getTime(),
      minutes: 360,
    },
  ]

  beforeAll(async () => {
    database = new SimpleDatabase()
    await Promise.all(documents.map(async (document) => {
      const statement: CreateStatement<TimeEntryModel> = { operation: Operation.CREATE, payload: document }
      await database.execute(stream, statement)
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
    const directive = new ListTimeEntriesInMemoryDirective(stream, database)
    const result = await directive.execute(user.id)
    expect(result).toStrictEqual(
      documents
        .filter(document => document.userId === user.id)
        .map(mapTimeEntryModelToListTimeEntriesItemMapper),
    )
  })
})
