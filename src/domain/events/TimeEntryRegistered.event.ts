import type { TimeEntryProps } from '../TimeEntry/TimeEntry'
import { DomainEvent } from '@jvhellemondt/crafts-and-arts.ts'

export class TimeEntryRegistered extends DomainEvent<TimeEntryProps> { }
