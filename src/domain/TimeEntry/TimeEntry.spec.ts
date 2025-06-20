import type { TimeEntryEvent } from './TimeEntry'
import { randomUUID } from 'node:crypto'
import { subHours } from 'date-fns'
import { Schema } from 'effect'
import { RegisterTimeEntry } from '@/domain/TimeEntry/RegisterTimeEntry.command.ts'
import { TimeEntryRegistered } from '@/domain/TimeEntry/TimeEntryRegistered.event.ts'
import { registerTimeEntryPayload } from '@/usecases/commands/RegisterTimeEntry/ports/inbound.ts'
import { TimeEntry } from './TimeEntry'

describe('timeEntry', () => {
  let pastEvents: TimeEntryEvent[]
  const aggregateId = randomUUID()
  const userId = randomUUID()
  const startTime = subHours(new Date(), 2).toISOString()
  const endTime = new Date().toISOString()

  const payload = Schema.decodeUnknownSync(registerTimeEntryPayload)({ userId, startTime, endTime })
  const registerTimeEntry = RegisterTimeEntry(aggregateId, payload)
  const timeEntryRegistered = TimeEntryRegistered(registerTimeEntry.aggregateId, registerTimeEntry.payload)

  it('should be defined', () => {
    expect(TimeEntry).toBeDefined()
  })

  describe('time entry registration', () => {
    it('should register the time entry', () => {
      pastEvents = []
      const currentState = pastEvents.reduce(TimeEntry.evolve, TimeEntry.initialState(registerTimeEntry.aggregateId))

      const decision = TimeEntry.decide(registerTimeEntry, currentState)

      expect(decision).toHaveLength(1)
      expect(decision.at(0)).toStrictEqual({
        ...timeEntryRegistered,
        id: expect.any(String),
        metadata: {
          timestamp: expect.any(String),
        },
      })
    })

    it('should not change anything if the registered event is consumed twice', () => {
      pastEvents = [timeEntryRegistered]
      const currentState = pastEvents.reduce(TimeEntry.evolve, TimeEntry.initialState(registerTimeEntry.aggregateId))

      const decision = TimeEntry.decide(registerTimeEntry, currentState)

      expect(decision).toHaveLength(0)
    })
  })
})
