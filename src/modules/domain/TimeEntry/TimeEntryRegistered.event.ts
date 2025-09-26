import type { DomainEvent, DomainEventMetadata } from '@arts-n-crafts/ts'
import type { RegisterTimeEntryCommandPayload } from '@modules/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.ports.ts'
import { createDomainEvent } from '@arts-n-crafts/ts'

export function createTimeEntryRegisteredEvent(aggregateId: string, payload: RegisterTimeEntryCommandPayload, metadata?: DomainEventMetadata): DomainEvent<RegisterTimeEntryCommandPayload> {
  return createDomainEvent('TimeEntryRegistered', aggregateId, payload, metadata)
}

export type TimeEntryRegisteredEvent = ReturnType<typeof createTimeEntryRegisteredEvent>
