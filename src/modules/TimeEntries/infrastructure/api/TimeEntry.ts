import type { CommandBus, QueryBus } from '@jvhellemondt/arts-and-crafts.ts'
import type { ApiServerRouter } from '@shared/infrastructure/api/ApiServerRouter'
import { Hono } from 'hono'
import { handleException } from './handlers/exceptions'
import { ListHandler } from './handlers/list'
import { RegisterHandler } from './handlers/register'

class TimeEntryApi implements ApiServerRouter {
  public readonly app: Hono

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {
    const app = new Hono().basePath('time-entry')
    this.registerRoutes(app)

    this.app = app
  }

  registerRoutes(app: Hono) {
    app.post('/register', async c => new RegisterHandler(this.commandBus).handle(c))
    app.get('/list', async c => new ListHandler(this.queryBus).handle(c))
    app.onError(handleException)
  }
}

export default TimeEntryApi
