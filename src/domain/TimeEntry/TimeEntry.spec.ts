import { randomUUID } from 'node:crypto'
import { TimeEntry } from './TimeEntry'

describe('timeEntry', () => {
  it('should be defined', () => {
    expect(TimeEntry).toBeDefined()
  })

  it('should contain an user id', () => {
    const aggregateId = randomUUID()
    const props = { userId: randomUUID() }
    const timeEntry = TimeEntry.create(props, aggregateId)
    expect(timeEntry.id).toBe(aggregateId)
    expect(timeEntry.props.userId).toBe(props.userId)
  })
})
