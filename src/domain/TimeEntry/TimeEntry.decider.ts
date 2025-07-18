import type { Decider, Maybe } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryRegisteredEvent } from '@/domain/TimeEntry/TimeEntryRegistered.event.ts'
import type { RegisterTimeEntryCommand } from '@/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.command'
import type { RegisterTimeEntryCommandPayload } from '@/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.ports'
import { isDeepStrictEqual } from 'node:util'
import { createTimeEntryRegisteredEvent } from '@/domain/TimeEntry/TimeEntryRegistered.event.ts'

export type TimeEntryCommand = RegisterTimeEntryCommand
export type TimeEntryEvent = TimeEntryRegisteredEvent

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
      return [createTimeEntryRegisteredEvent(command.aggregateId, command.payload, command.metadata)]
    }
  }
}

export const TimeEntry: Decider<TimeEntryState, TimeEntryCommand, TimeEntryEvent> = {
  initialState: initialTimeEntryState,
  evolve: evolveTimeEntryState,
  decide: decideTimeEntryState,
}
