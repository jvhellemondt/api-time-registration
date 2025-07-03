import { randomUUID } from 'node:crypto'
import { subHours } from 'date-fns'
import {
  RegisterTimeEntryPayload,
} from '@/usecases/commands/RegisterTimeEntry/ports/inbound.ts'
import { timeEntryRegistered } from './TimeEntryRegistered.event.ts'

describe('timeEntryRegistered Event', () => {
  it('should be defined', () => {
    expect(timeEntryRegistered).toBeDefined()
  })

  it('should be a domain event with proper payload', () => {
    const aggregateId = randomUUID()
    const userId = randomUUID()
    const startTime = subHours(new Date(), 2).toISOString()
    const endTime = new Date().toISOString()
    const props = RegisterTimeEntryPayload.parse({ userId, startTime, endTime })
    const event = timeEntryRegistered(aggregateId, props)
    expect(event.type).toBe('TimeEntryRegistered')
    expect(event.source).toBe('internal')
    expect(event.aggregateId).toBe(aggregateId)
    expect(event.payload).toStrictEqual(props)
  })
})
