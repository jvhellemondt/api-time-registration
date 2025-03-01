import { randomUUID } from 'node:crypto'
import { subDays } from 'date-fns'
import { TimeEntry } from './TimeEntry'

describe('timeEntry', () => {
  it('should be defined', () => {
    expect(TimeEntry).toBeDefined()
  })

  it('should contain user id, start time and end time', () => {
    const aggregateId = randomUUID()
    const endTime = new Date()
    const props = { userId: randomUUID(), startTime: subDays(endTime, 3), endTime }
    const timeEntry = TimeEntry.create(props, aggregateId)
    expect(timeEntry.id).toBe(aggregateId)
    expect(timeEntry.props.userId).toBe(props.userId)
    expect(timeEntry.props.startTime).toBe(props.startTime)
    expect(timeEntry.props.endTime).toBe(endTime)
  })
})
