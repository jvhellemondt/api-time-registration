import type { UUID } from 'node:crypto'
import type { RegisterTimeEntryPayload } from './ports/inbound'
import { Command } from '@jvhellemondt/arts-and-crafts.ts'

export class RegisterTimeEntryCommand extends Command<RegisterTimeEntryPayload, UUID> { }
