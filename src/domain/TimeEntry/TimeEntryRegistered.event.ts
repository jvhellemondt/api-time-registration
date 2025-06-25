import type { DomainEventMetadata } from '@jvhellemondt/arts-and-crafts.ts'
import type { RegisterTimeEntryOutput } from '@/usecases/commands/RegisterTimeEntry/ports/inbound.ts'
import { createDomainEvent } from '@jvhellemondt/arts-and-crafts.ts'

export function TimeEntryRegistered(aggregateId: string, payload: RegisterTimeEntryOutput, metadata?: DomainEventMetadata) {
  return createDomainEvent('TimeEntryRegistered', aggregateId, payload, metadata)
}
