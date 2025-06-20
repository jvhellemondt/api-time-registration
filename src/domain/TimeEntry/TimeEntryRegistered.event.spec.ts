import { randomUUID } from 'node:crypto'
import { subHours } from 'date-fns'
import { Schema } from 'effect'
import {
  registerTimeEntryPayload,
} from '@/usecases/commands/RegisterTimeEntry/ports/inbound.ts'
import { TimeEntryRegistered } from './TimeEntryRegistered.event.ts'

describe('timeEntryRegistered Event', () => {
  it('should be defined', () => {
    expect(TimeEntryRegistered).toBeDefined()
  })

  it('should be a domain event with proper payload', () => {
    const aggregateId = randomUUID()
    const userId = randomUUID()
    const startTime = subHours(new Date(), 2).toISOString()
    const endTime = new Date().toISOString()
    const props = Schema.decodeUnknownSync(registerTimeEntryPayload)({ userId, startTime, endTime })
    const event = TimeEntryRegistered(aggregateId, props)
    expect(event.type).toBe('TimeEntryRegistered')
    expect(event.source).toBe('internal')
    expect(event.aggregateId).toBe(aggregateId)
    expect(event.payload).toStrictEqual(props)
  })
})
