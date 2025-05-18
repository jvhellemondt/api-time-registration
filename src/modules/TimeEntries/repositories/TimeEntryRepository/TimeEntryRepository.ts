import type { TimeEntry } from '@/TimeEntries/domain/TimeEntry/TimeEntry'
import { Repository } from '@jvhellemondt/arts-and-crafts.ts'

export abstract class TimeEntryRepository extends Repository<TimeEntry> { };
