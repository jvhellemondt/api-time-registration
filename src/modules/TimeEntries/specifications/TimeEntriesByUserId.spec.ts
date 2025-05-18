import type { TimeEntryModel } from '../infrastructure/models/TimeEntry.model'
import { randomUUID } from 'node:crypto'
import { TimeEntriesByUser } from './TimeEntriesByUserId'

describe('timeEntriesByUser specification', () => {
  const userId = randomUUID()
  const spec = new TimeEntriesByUser(userId)
  const candidate: TimeEntryModel = {
    id: randomUUID(),
    userId,
    startTime: new Date(),
    endTime: new Date(),
  }

  it('should be defined', () => {
    expect(TimeEntriesByUser).toBeDefined()
  })

  it('should return true if the id is the same', () => {
    expect(spec.isSatisfiedBy(candidate)).toBeTruthy()
  })

  it('should return false if the id is not the same', () => {
    expect(spec.isSatisfiedBy({ ...candidate, userId: randomUUID() })).toBeFalsy()
  })

  it('should return the correct filter for lookups', () => {
    const query = spec.toQuery()
    expect(query).toStrictEqual([{ userId }])
  })
})
