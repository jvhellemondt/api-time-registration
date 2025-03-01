import { Command } from '@jvhellemondt/crafts-and-arts.ts'

export interface RegisterTimeEntryCommandProps {
  userId: string
  startTime: Date
  endTime: Date
}

export class RegisterTimeEntryCommand extends Command<RegisterTimeEntryCommandProps> { }
