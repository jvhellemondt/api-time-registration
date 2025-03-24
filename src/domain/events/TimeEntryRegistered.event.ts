import type { TimeEntryProps } from '../TimeEntry/TimeEntry'
import { DomainEvent } from '@jvhellemondt/arts-and-crafts.ts'

export class TimeEntryRegistered extends DomainEvent<TimeEntryProps> { }
