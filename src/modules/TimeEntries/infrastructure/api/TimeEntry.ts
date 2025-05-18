import type { CommandBus } from '@jvhellemondt/arts-and-crafts.ts'
import type { ApiServerRouter } from '@shared/infrastructure/api/ApiServerRouter'
import { randomUUID } from 'node:crypto'
import { RegisterTimeEntryCommand } from '@/TimeEntries/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.command'
import { Hono } from 'hono'

class TimeEntryApi implements ApiServerRouter {
  public readonly app: Hono

  constructor(
    private readonly commandBus: CommandBus,
  ) {
    const app = new Hono().basePath('time-entry')
    this.registerRoutes(app)

    this.app = app
  }

  registerRoutes(app: Hono) {
    app.post('/register', async (context) => {
      const body = await context.req.json()
      const command = new RegisterTimeEntryCommand(randomUUID(), body)
      const res = await this.commandBus.execute(command)
      return context.json({ ...res }, 201, { 'X-Custom': 'Thank you' })
    })
  }
}

export default TimeEntryApi
