import { randomUUID } from 'node:crypto'
import { TimeEntriesByUser } from './TimeEntriesByUser'

describe('timeEntriesByUser specification', () => {
  const id = randomUUID()

  it('should be defined', () => {
    expect(TimeEntriesByUser).toBeDefined()
  })

  it('should return true if the id is the same', () => {
    const spec = new TimeEntriesByUser(id)
    expect(spec.isSatisfiedBy(id)).toBeTruthy()
  })

  it('should return false if the id is not the same', () => {
    const spec = new TimeEntriesByUser(id)
    expect(spec.isSatisfiedBy(randomUUID())).toBeFalsy()
  })
})
