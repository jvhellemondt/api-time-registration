import { Effect } from 'effect'
import { start } from '@/config/bootstrap'

function startServer() {
  return Effect.try({
    try: start,
    catch: unknownError =>
      new Error(`Server could not start. Something went wrong ${unknownError}`),
  })
}

Effect.runSync(startServer())
