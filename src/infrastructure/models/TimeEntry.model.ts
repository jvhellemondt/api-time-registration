import type { DatabaseRecord } from '@jvhellemondt/arts-and-crafts.ts'
import type { ObjectToSnake } from 'ts-case-convert'
import type { RegisterTimeEntryOutput } from '@/usecases/commands/RegisterTimeEntry/ports/inbound'

export type TimeEntryModel = ObjectToSnake<DatabaseRecord & RegisterTimeEntryOutput>
