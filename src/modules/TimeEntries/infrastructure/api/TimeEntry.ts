import type { CommandBus, QueryBus } from '@jvhellemondt/arts-and-crafts.ts'
import type { ApiServerRouter } from '@shared/infrastructure/api/ApiServerRouter'
import type { ListTimeEntriesByUserIdResult } from '@/TimeEntries/usecases/queries/ListTimeEntriesByUserId/ports/outbound'
import { randomUUID } from 'node:crypto'
import { invariant } from '@shared/utils/invariant/invariant'
import { isUUID } from 'class-validator'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { RegisterTimeEntry } from '@/TimeEntries/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.command'
import { ListTimeEntriesByUserId } from '@/TimeEntries/usecases/queries/ListTimeEntriesByUserId/ListTimeEntriesByUserId.query'

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
    app.post('/register', async (context) => {
      const body = await context.req.json()
      const command = RegisterTimeEntry(randomUUID(), body)
      const res = await this.commandBus.execute(command)
      return context.json({ ...res }, 201, { 'X-Custom': 'Thank you' })
    })
    app.get('/list', async (context) => {
      const userId = context.req.query('userId')
      invariant(!!userId, () => {
        const message = 'Required query param \'userId\' not provided'
        throw new HTTPException(400, { res: new Response(message, { status: 400 }) })
      })
      invariant(isUUID(userId), () => {
        const message = 'Required query param \'userId\' not a valid UUID'
        throw new HTTPException(400, { res: new Response(message, { status: 400 }) })
      })
      const query = ListTimeEntriesByUserId({ userId })
      const items = await this.queryBus.execute<ListTimeEntriesByUserIdResult[]>(query)
      const response = { amount: new Intl.NumberFormat('nl-NL').format(items.length), items }
      return context.json(response, 200, { 'X-Custom': 'Thank you' })
    })
    app.onError((err) => {
      if (err instanceof HTTPException)
        return err.getResponse()
      return new Response('Unhandled exception', { status: 500 })
    })
  }
}

export default TimeEntryApi
