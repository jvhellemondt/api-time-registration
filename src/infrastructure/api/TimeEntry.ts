import type { CommandBus } from '@jvhellemondt/arts-and-crafts.ts'
import { randomUUID } from 'node:crypto'
import { RegisterTimeEntryCommand } from '@/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.command'
import { Hono } from 'hono'

class TimeEntryApi {
  public readonly app: Hono

  constructor(
    private readonly commandBus: CommandBus,
  ) {
    this.app = new Hono()
    this.registerRoutes()
  }

  registerRoutes() {
    this.app.post('/register', async (context) => {
      const body = await context.req.json()
      const command = new RegisterTimeEntryCommand(randomUUID(), body)
      const res = await this.commandBus.execute(command)
      return context.json({ ...res }, 201, { 'X-Custom': 'Thank you' })
    })
  }
}

export default TimeEntryApi
