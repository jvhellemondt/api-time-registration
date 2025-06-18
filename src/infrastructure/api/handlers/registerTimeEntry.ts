import type { CommandBus } from '@jvhellemondt/arts-and-crafts.ts'
import type { Context } from 'hono'
import type { RegisterTimeEntryPayload } from '@/usecases/commands/RegisterTimeEntry/ports/inbound.ts'
import { randomUUID } from 'node:crypto'
import { RegisterTimeEntry } from '@/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.command'

export class RegisterTimeEntryHandler {
  constructor(
    private readonly commandBus: CommandBus,
  ) { }

  async handle(context: Context) {
    const body = await context.req.json()
    this.validate(body)
    const command = RegisterTimeEntry(randomUUID(), body)
    const res = await this.commandBus.execute(command)
    return context.json({ ...res }, 201, { 'X-Custom': 'Thank you' })
  }

  validate(_body: unknown): asserts _body is RegisterTimeEntryPayload {
    // console.debug({ body })
  }
}
