import type { QueryBus } from '@jvhellemondt/arts-and-crafts.ts'
import type { Context } from 'hono'
import type { UUID } from 'node:crypto'
import type { ListTimeEntriesByUserIdResult } from '@/usecases/queries/ListTimeEntriesByUserId/ports/outbound'
import { isUUID } from 'class-validator'
import { HTTPException } from 'hono/http-exception'
import { ListTimeEntriesByUserId } from '@/usecases/queries/ListTimeEntriesByUserId/ListTimeEntriesByUserId.query'
import { fail } from '@/utils/fail/fail'
import { invariant } from '@/utils/invariant/invariant'

export class ListTimeEntriesHandler {
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
    invariant(!!userId, fail(new HTTPException(400, { res: new Response('Required query param \'userId\' not provided', { status: 400 }) })))
    invariant(isUUID(userId), fail(new HTTPException(400, { res: new Response('Required query param \'userId\' not a valid UUID', { status: 400 }) })))
  }
}
