import type { TimeEntryProps } from '../TimeEntry/TimeEntry'
import { createDomainEvent } from '@jvhellemondt/arts-and-crafts.ts'

export function TimeEntryRegistered(aggregateId: string, props: TimeEntryProps) {
  return createDomainEvent('TimeEntryRegistered', aggregateId, props)
}
