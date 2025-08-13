import type { Decider } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryEntity } from './TimeEntry.entity'
import type { TimeEntryRegisteredEvent } from '@/domain/TimeEntry/TimeEntryRegistered.event.ts'
import type { RegisterTimeEntryCommand } from '@/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.command'
import { isDeepStrictEqual } from 'node:util'
import { createTimeEntryRegisteredEvent } from '@/domain/TimeEntry/TimeEntryRegistered.event.ts'

export type TimeEntryCommand = RegisterTimeEntryCommand
export type TimeEntryEvent = TimeEntryRegisteredEvent

function initialTimeEntryState(id: string): TimeEntryEntity {
  return {
    id,
    userId: null,
    startTime: null,
    endTime: null,
  }
}

function isInitialState(state: TimeEntryEntity): boolean {
  const initialState = initialTimeEntryState(state.id)
  return isDeepStrictEqual(initialState, state)
}

function evolveTimeEntryState(currentState: TimeEntryEntity, event: TimeEntryEvent): TimeEntryEntity {
  switch (event.type) {
    case 'TimeEntryRegistered':
      return { ...currentState, ...event.payload }
    default:
      return currentState
  }
}

function decideTimeEntryState(command: TimeEntryCommand, currentState: TimeEntryEntity) {
  switch (command.type) {
    case 'RegisterTimeEntry': {
      if (!isInitialState(currentState)) {
        return []
      }
      return [createTimeEntryRegisteredEvent(command.aggregateId, command.payload, command.metadata)]
    }
  }
}

export const TimeEntry: Decider<TimeEntryEntity, TimeEntryCommand, TimeEntryEvent> = {
  initialState: initialTimeEntryState,
  evolve: evolveTimeEntryState,
  decide: decideTimeEntryState,
}
