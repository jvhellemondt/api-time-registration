import type { Decider, Maybe } from '@jvhellemondt/arts-and-crafts.ts'
import type { registerTimeEntry } from '@/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.command'
import type { RegisterTimeEntryCommandPayload } from '@/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.ports'
import { isDeepStrictEqual } from 'node:util'
import { timeEntryRegistered } from '@/domain/TimeEntry/TimeEntryRegistered.event.ts'

export type TimeEntryCommand = ReturnType<typeof registerTimeEntry>
export type TimeEntryEvent = ReturnType<typeof timeEntryRegistered>

export interface TimeEntryState {
  id: string
  userId: Maybe<RegisterTimeEntryCommandPayload['userId']>
  startTime: Maybe<RegisterTimeEntryCommandPayload['startTime']>
  endTime: Maybe<RegisterTimeEntryCommandPayload['endTime']>
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
      return [timeEntryRegistered(command.aggregateId, command.payload, command.metadata)]
    }
  }
}

export const TimeEntry: Decider<TimeEntryState, TimeEntryCommand, TimeEntryEvent> = {
  initialState: initialTimeEntryState,
  evolve: evolveTimeEntryState,
  decide: decideTimeEntryState,
}
