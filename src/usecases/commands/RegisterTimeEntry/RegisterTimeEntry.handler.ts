import type { Command, CommandHandler, Repository } from '@jvhellemondt/arts-and-crafts.ts'
import type { RegisterTimeEntryPayload } from './ports/inbound'
import type { TimeEntryEvent } from '@/domain/TimeEntry/TimeEntry.ts'
import type { RegisterTimeEntryResult } from '@/usecases/commands/RegisterTimeEntry/ports/outbound.ts'
import { Effect, pipe } from 'effect'

export class RegisterTimeEntryHandler implements CommandHandler<'RegisterTimeEntry', RegisterTimeEntryPayload> {
  constructor(
    private readonly repository: Repository<TimeEntryEvent>,
  ) {}

  async execute(aCommand: Command<'RegisterTimeEntry', RegisterTimeEntryPayload>): Promise<RegisterTimeEntryResult> {
    return Effect.runPromise(
      pipe(
        Effect.succeed(aCommand),
        Effect.map((props: Command<'RegisterTimeEntry', RegisterTimeEntryPayload>): RegisterTimeEntryResult => ({ id: props.aggregateId })),
      ),
    )
  }
}
