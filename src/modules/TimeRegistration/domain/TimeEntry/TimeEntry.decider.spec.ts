import type { TimeEntryEvent } from './TimeEntry.decider.ts'
import { createDomainEvent } from '@arts-n-crafts/ts'
import { createTimeEntryRegisteredEvent } from '@modules/TimeRegistration/domain/TimeEntry/TimeEntryRegistered.event.ts'
import { createRegisterTimeEntryCommand } from '@modules/TimeRegistration/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.command.ts'
import { registerTimeEntryCommandPayload } from '@modules/TimeRegistration/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.ports.ts'
import { subHours } from 'date-fns'
import { v7 as uuidv7 } from 'uuid'
import { TimeEntry } from './TimeEntry.decider.ts'

describe('time entry decider', () => {
  let pastEvents: TimeEntryEvent[]
  const payload = registerTimeEntryCommandPayload.parse({ userId: uuidv7(), startTime: subHours(new Date(), 2).getTime(), endTime: new Date().getTime() })
  const registerTimeEntryCommand = createRegisterTimeEntryCommand(uuidv7(), payload)
  const timeEntryRegisteredEvent = createTimeEntryRegisteredEvent(registerTimeEntryCommand.aggregateId, registerTimeEntryCommand.payload)

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
        // eslint-disable-next-line ts/no-unsafe-assignment
        id: expect.any(String),
        // eslint-disable-next-line ts/no-unsafe-assignment
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
