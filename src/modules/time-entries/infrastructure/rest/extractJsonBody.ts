import type { HonoRequest } from 'hono'
import { Effect } from 'effect'

export function extractJsonBody(request: HonoRequest) {
  return Effect.tryPromise(
    (): Promise<unknown> => request.json(),
  )
}
