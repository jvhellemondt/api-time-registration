import type { RegisterTimeEntryPayload } from './ports/inbound'
import { Command } from '@jvhellemondt/crafts-and-arts.ts'

export class RegisterTimeEntryCommand extends Command<RegisterTimeEntryPayload> { }
