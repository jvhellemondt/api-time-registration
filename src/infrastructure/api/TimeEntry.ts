import type { CommandBus, QueryBus } from '@jvhellemondt/arts-and-crafts.ts'
import { Hono } from 'hono'
import { handleException } from './handlers/exceptions'
import { ListHandler } from './handlers/list'
import { RegisterHandler } from './handlers/register'

class TimeEntryApi {
  public readonly app: Hono

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {
    const app = new Hono()
    this.registerRoutes(app)

    this.app = app
  }

  registerRoutes(app: Hono) {
    app.get('/health', c => c.text('HEALTH OK'))
    app.get('/list', async c => new ListHandler(this.queryBus).handle(c))
    app.post('/register', async c => new RegisterHandler(this.commandBus).handle(c))
    app.onError(handleException)
  }
}

export default TimeEntryApi
