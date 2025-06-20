import type { Decider, Maybe } from '@jvhellemondt/arts-and-crafts.ts'
import type { UUID } from 'node:crypto'
import type { RegisterTimeEntry } from '@/domain/TimeEntry/RegisterTimeEntry.command.ts'
import { isDeepStrictEqual } from 'node:util'
import { TimeEntryRegistered } from '@/domain/TimeEntry/TimeEntryRegistered.event.ts'

export type TimeEntryCommand = ReturnType<typeof RegisterTimeEntry>
export type TimeEntryEvent = ReturnType<typeof TimeEntryRegistered>

interface TimeEntryState {
  id: string
  userId: Maybe<UUID>
  startTime: Maybe<Date>
  endTime: Maybe<Date>
}

function initialTimeEntryState(id: string): TimeEntryState {
  return {
    id,
    userId: null,
    startTime: null,
    endTime: null,
  }
}

function isInitialState(state: TimeEntryState): boolean {
  const initialState = initialTimeEntryState(state.id)
  return isDeepStrictEqual(initialState, state)
}

function evolveTimeEntryState(currentState: TimeEntryState, event: TimeEntryEvent): TimeEntryState {
  switch (event.type) {
    case 'TimeEntryRegistered':
      return { ...currentState, ...event.payload }
    default:
      return currentState
  }
}

function decideTimeEntryState(command: TimeEntryCommand, currentState: TimeEntryState) {
  switch (command.type) {
    case 'RegisterTimeEntry': {
      if (!isInitialState(currentState)) {
        return []
      }
      return [TimeEntryRegistered(command.aggregateId, command.payload, command.metadata)]
    }
  }
}

export const TimeEntry: Decider<TimeEntryState, TimeEntryCommand, TimeEntryEvent> = {
  initialState: initialTimeEntryState,
  evolve: evolveTimeEntryState,
  decide: decideTimeEntryState,
}
