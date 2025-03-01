import type { TimeEntry } from '@/domain/TimeEntry/TimeEntry'
import { Repository } from '@jvhellemondt/crafts-and-arts.ts'

export abstract class TimeEntryRepository extends Repository<TimeEntry> { };
