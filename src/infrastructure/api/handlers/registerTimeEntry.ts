import type { CommandBus } from '@jvhellemondt/arts-and-crafts.ts'
import type { Context } from 'hono'
import { Effect, pipe, Schema } from 'effect'
import {
  registerTimeEntryPayload,

} from '@/usecases/commands/RegisterTimeEntry/ports/inbound.ts'

export class RegisterTimeEntryHandler {
  constructor(
    private readonly commandBus: CommandBus,
  ) { }

  async handle(context: Context) {
    return Effect.runPromise(pipe(
      Schema.decodeUnknownEither(registerTimeEntryPayload)(context.req.json()),
    ))

    /*
    const body = await context.req.json()
    const isValidBody = this.validate(body)
    const command = RegisterTimeEntry(randomUUID(), body)
    const res = await this.commandBus.execute(command)
    return context.json({ ...res }, 201, { 'X-Custom': 'Thank you' })
    */
  }

  validate(body: unknown) {
    return Schema.decodeUnknownEither(registerTimeEntryPayload)(body)
  }
}
