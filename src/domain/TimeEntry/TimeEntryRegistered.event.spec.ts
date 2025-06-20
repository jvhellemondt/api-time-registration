import type { RegisterTimeEntryPayload } from '@/usecases/commands/RegisterTimeEntry/ports/inbound.ts'
import { randomUUID } from 'node:crypto'
import { subHours } from 'date-fns'
import { TimeEntryRegistered } from './TimeEntryRegistered.event.ts'

describe('timeEntryRegistered Event', () => {
  it('should be defined', () => {
    expect(TimeEntryRegistered).toBeDefined()
  })

  it('should be a domain event with proper payload', () => {
    const aggregateId = randomUUID()
    const userId = randomUUID()
    const endTime = new Date()
    const startTime = subHours(endTime, 3)
    const props: RegisterTimeEntryPayload = { userId, startTime, endTime }
    const event = TimeEntryRegistered(aggregateId, props)
    expect(event.type).toBe('TimeEntryRegistered')
    expect(event.source).toBe('internal')
    expect(event.aggregateId).toBe(aggregateId)
    expect(event.payload).toStrictEqual(props)
  })
})
