import type { Environment } from '@/shared/core/Environment'
import { Hono } from 'hono'

function createServer(env: Environment) {
  const app = new Hono()

  app.get('/', (c) => {
    return c.json({
      ok: true,
      message: 'Hello Hono!',
    })
  })

  return {
    hostname: env.host,
    development: env.env === 'development',
    port: env.port,
    fetch: app.fetch,
  }
}

export default createServer
