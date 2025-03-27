import type { CommandBus } from '@jvhellemondt/arts-and-crafts.ts'
import { randomUUID } from 'node:crypto'
import { RegisterTimeEntryCommand } from '@/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.command'
import { Hono } from 'hono'

class Server {
  public readonly app: Hono
  private readonly commandBus: CommandBus

  constructor(commandBus: CommandBus) {
    this.app = new Hono()
    this.commandBus = commandBus
    this.registerRoutes()
  }

  registerRoutes() {
    this.app.post('/register-time-entry', async (c) => {
      const body = await c.req.json()
      const command = new RegisterTimeEntryCommand(randomUUID(), body)
      const res = await this.commandBus.execute(command)
      return c.json(
        { ...res },
        201,
        { 'X-Custom': 'Thank you' },
      )
    })
  }
}

export default Server
