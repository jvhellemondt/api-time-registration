import type { MongoRecord } from '@modules/TimeRegistration/infrastructure/database/mongo/MongoRecord.ts'
import type {
  TimeEntryModel,
} from '@modules/TimeRegistration/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports.ts'
import type { Collection, Db, MongoClient } from 'mongodb'
import { config } from '@config'
import {
  mapTimeEntryModelToListTimeEntriesItemMapper,
} from '@modules/TimeRegistration/mappers/mapTimeEntryModelToListTimeEntriesItem.mapper.ts'
import { subHours } from 'date-fns'
import { v7 as uuidv7 } from 'uuid'
import { afterAll } from 'vitest'
import { createMongoClient } from '../../index.ts'
import { mapIdToMongoId } from '../../utils/mapMongoId.ts'
import { ListTimeEntriesDirective } from './ListTimeEntries.directive.ts'

describe('mongodb ListTimeEntriesDirective', () => {
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
    client = await createMongoClient(config.mongodb)
    database = client.db()
    const collection: Collection<MongoRecord<TimeEntryModel>> = database.collection(stream)
    await collection.insertMany(documents.map(mapIdToMongoId))
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
    const directive = new ListTimeEntriesDirective(stream, database)
    const result = await directive.execute(user.id)
    expect(result).toStrictEqual(
      documents
        .filter(document => document.userId === user.id)
        .sort((a, b) => a.startTime - b.startTime)
        .map(mapTimeEntryModelToListTimeEntriesItemMapper),
    )
  })
})
