import type { CommandBus } from '@jvhellemondt/arts-and-crafts.ts'
import type { Context } from 'hono'
import { randomUUID } from 'node:crypto'
import { Effect, pipe, Schema } from 'effect'
import { RegisterTimeEntry } from '@/domain/TimeEntry/RegisterTimeEntry.command.ts'
import { registerTimeEntryPayload } from '@/usecases/commands/RegisterTimeEntry/ports/inbound.ts'

export class RegisterTimeEntryHandler {
  constructor(
    private readonly commandBus: CommandBus,
  ) {
  }

  async handle(context: Context) {
    return Effect.runPromise(
      pipe(
        context.req.json(),
        Schema.decodeUnknown(registerTimeEntryPayload),
        Effect.map(props => RegisterTimeEntry(randomUUID(), props)),
        Effect.map(this.commandBus.execute),
        Effect.map(commandResult =>
          context.json({ res: commandResult }, 201),
        ),
        Effect.catchAll(error =>
          Effect.succeed(context.json({ error }, 400, { 'X-Custom': 'Thank you' })),
        ),
      ),
    )
  }
}
