import { randomUUID } from 'node:crypto'
import { TimeEntry } from './TimeEntry'

describe('timeEntry', () => {
  it('should be defined', () => {
    expect(TimeEntry).toBeDefined()
  })

  it('should contain user id, and end time', () => {
    const aggregateId = randomUUID()
    const props = { userId: randomUUID(), endTime: new Date() }
    const timeEntry = TimeEntry.create(props, aggregateId)
    expect(timeEntry.id).toBe(aggregateId)
    expect(timeEntry.props.userId).toBe(props.userId)
    expect(timeEntry.props.endTime).toBe(props.endTime)
  })
})
