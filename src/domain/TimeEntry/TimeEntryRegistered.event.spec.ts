import { randomUUID } from 'node:crypto'
import { subHours } from 'date-fns'
import { registerTimeEntryCommandPayload } from '@/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.ports.ts'
import { timeEntryRegistered } from './TimeEntryRegistered.event.ts'

describe('timeEntryRegistered Event', () => {
  it('should be defined', () => {
    expect(timeEntryRegistered).toBeDefined()
  })

  it('should be a domain event with proper payload', () => {
    const props = registerTimeEntryCommandPayload.parse({ userId: randomUUID(), startTime: subHours(new Date(), 2).toISOString(), endTime: new Date().toISOString() })
    const event = timeEntryRegistered(randomUUID(), props)
    expect(event.type).toBe('TimeEntryRegistered')
    expect(event.source).toBe('internal')
    expect(event.aggregateId).toBe(event.aggregateId)
    expect(event.payload).toStrictEqual(props)
  })
})
