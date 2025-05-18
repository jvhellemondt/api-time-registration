import type { QueryBus } from '@jvhellemondt/arts-and-crafts.ts'
import type { Context } from 'hono'
import type { UUID } from 'node:crypto'
import type { ListTimeEntriesByUserIdResult } from '@/TimeEntries/usecases/queries/ListTimeEntriesByUserId/ports/outbound'
import { invariant } from '@shared/utils/invariant/invariant'
import { isUUID } from 'class-validator'
import { HTTPException } from 'hono/http-exception'
import { ListTimeEntriesByUserId } from '@/TimeEntries/usecases/queries/ListTimeEntriesByUserId/ListTimeEntriesByUserId.query'

export class ListHandler {
  constructor(
    private readonly queryBus: QueryBus,
  ) { }

  async handle(context: Context) {
    const userId = context.req.query('userId')
    this.validate(userId)
    const query = ListTimeEntriesByUserId({ userId })
    const items = await this.queryBus.execute<ListTimeEntriesByUserIdResult[]>(query)
    const response = { amount: new Intl.NumberFormat('nl-NL').format(items.length), items }
    return context.json(response, 200, { 'X-Custom': 'Thank you' })
  }

  validate(userId: unknown): asserts userId is UUID {
    invariant(!!userId, () => {
      const message = 'Required query param \'userId\' not provided'
      throw new HTTPException(400, { res: new Response(message, { status: 400 }) })
    })
    invariant(isUUID(userId), () => {
      const message = 'Required query param \'userId\' not a valid UUID'
      throw new HTTPException(400, { res: new Response(message, { status: 400 }) })
    })
  }
}
