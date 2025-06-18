import { Effect, pipe } from 'effect'
import { Hono } from 'hono'
import {
  extractJsonBody,
} from '@/modules/time-entries/infrastructure/rest/extractJsonBody.ts'
import {
  registerTimeEntry,
} from '@/modules/time-entries/usecases/commands/registerTimeEntry/registerTimeEntry.handler.ts'

const router = new Hono()
  .post('registerTimeEntry', (context) => {
    return Effect.runPromise(
      Effect.match(
        pipe(
          context.req,
          extractJsonBody,

          registerTimeEntry,
        ),
        {
          onFailure: error => `failure: ${error}`,
          onSuccess: value => `success: ${value}`,
        },
      ),
    )
  })

export const timeEntriesRouter = router
