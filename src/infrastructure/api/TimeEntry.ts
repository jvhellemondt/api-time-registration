import type { CommandBus, QueryBus } from '@jvhellemondt/arts-and-crafts.ts'
import { Hono } from 'hono'
import { handleException } from './handlers/exceptions'
import { ListTimeEntriesHandler } from './handlers/listTimeEntries.ts'
import { RegisterTimeEntryHandler } from './handlers/registerTimeEntry.ts'

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
    app.get('/listTimeEntries', async c => new ListTimeEntriesHandler(this.queryBus).handle(c))
    app.post('/registerTimeEntry', async c => new RegisterTimeEntryHandler(this.commandBus).handle(c))
    app.onError(handleException)
  }
}

export default TimeEntryApi
