/* eslint-disable ts/no-unsafe-assignment */
import type { TimeEntryEvent } from './TimeEntry.decider'
import { randomUUID } from 'node:crypto'
import { createDomainEvent } from '@jvhellemondt/arts-and-crafts.ts'
import { subHours } from 'date-fns'
import { timeEntryRegistered } from '@/domain/TimeEntry/TimeEntryRegistered.event.ts'
import { registerTimeEntry } from '@/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.command'
import { registerTimeEntryCommandPayload } from '@/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.ports'
import { TimeEntry } from './TimeEntry.decider'

describe('timeEntry', () => {
  let pastEvents: TimeEntryEvent[]
  const payload = registerTimeEntryCommandPayload.parse({ userId: randomUUID(), startTime: subHours(new Date(), 2).toISOString(), endTime: new Date().toISOString() })
  const registerTimeEntryCommand = registerTimeEntry(randomUUID(), payload)
  const timeEntryRegisteredEvent = timeEntryRegistered(registerTimeEntryCommand.aggregateId, registerTimeEntryCommand.payload)

  it('should be defined', () => {
    expect(TimeEntry).toBeDefined()
  })

  describe('time entry registration', () => {
    it('should register the time entry', () => {
      pastEvents = []
      const currentState = pastEvents.reduce(TimeEntry.evolve, TimeEntry.initialState(registerTimeEntryCommand.aggregateId))

      const decision = TimeEntry.decide(registerTimeEntryCommand, currentState)

      expect(decision).toHaveLength(1)
      expect(decision.at(0)).toStrictEqual({
        ...timeEntryRegisteredEvent,
        id: expect.any(String),
        timestamp: expect.any(String),
        metadata: {
        },
      })
    })

    it('should handle faulty events', () => {
      const faultyEvent = createDomainEvent('FaultyEvent', registerTimeEntryCommand.aggregateId, { message: 'faulty event' })

      // @ts-expect-error required test for default
      pastEvents = [faultyEvent]
      const currentState = pastEvents.reduce(TimeEntry.evolve, TimeEntry.initialState(registerTimeEntryCommand.aggregateId))
      expect(currentState).toStrictEqual(TimeEntry.initialState(registerTimeEntryCommand.aggregateId))
    })

    it('should not change anything if the registered event is consumed twice', () => {
      pastEvents = [timeEntryRegisteredEvent]
      const currentState = pastEvents.reduce(TimeEntry.evolve, TimeEntry.initialState(registerTimeEntryCommand.aggregateId))

      const decision = TimeEntry.decide(registerTimeEntryCommand, currentState)

      expect(decision).toHaveLength(0)
    })
  })
})
