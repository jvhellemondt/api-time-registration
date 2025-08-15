import type { DomainEvent, DomainEventMetadata } from '@jvhellemondt/arts-and-crafts.ts'
import type { RegisterTimeEntryCommandPayload } from '@/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.ports'
import { createDomainEvent } from '@jvhellemondt/arts-and-crafts.ts'

export function createTimeEntryRegisteredEvent(aggregateId: string, payload: RegisterTimeEntryCommandPayload, metadata?: DomainEventMetadata): DomainEvent<RegisterTimeEntryCommandPayload> {
  return createDomainEvent('TimeEntryRegistered', aggregateId, payload, metadata)
}

export type TimeEntryRegisteredEvent = ReturnType<typeof createTimeEntryRegisteredEvent>
