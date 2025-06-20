import type { TimeEntryEvent } from './TimeEntry'
import { randomUUID } from 'node:crypto'
import { subHours } from 'date-fns'
import { RegisterTimeEntry } from '@/domain/TimeEntry/RegisterTimeEntry.command.ts'
import { TimeEntryRegistered } from '@/domain/TimeEntry/TimeEntryRegistered.event.ts'
import { TimeEntry } from './TimeEntry'

describe('timeEntry', () => {
  let pastEvents: TimeEntryEvent[]
  const aggregateId = randomUUID()
  const userId = randomUUID()
  const endTime = new Date()
  const startTime = subHours(endTime, 2)
  const registerTimeEntry = RegisterTimeEntry(aggregateId, { userId, startTime, endTime })
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
