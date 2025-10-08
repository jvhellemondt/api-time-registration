import type { Context, Next } from 'hono'

export async function trafficLoggerMiddleware(c: Context, next: Next) {
  const start = Date.now()

  await next()

  const latency = Date.now() - start
  const method = c.req.method
  const url = c.req.url
  const path = c.req.path
  const status = c.res.status

  // eslint-disable-next-line no-console
  console.group(`${method} ${path} ${status}`)
  // eslint-disable-next-line no-console
  console.info(`[${new Date().getTime()}] ${latency}ms - ${url}`)
  // eslint-disable-next-line no-console
  console.groupEnd()
  c.header('X-Response-Time', `${latency}ms`)
}
