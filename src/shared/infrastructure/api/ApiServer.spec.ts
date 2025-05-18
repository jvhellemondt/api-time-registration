import type { ApiServerRouter } from './ApiServerRouter'
import { Hono } from 'hono'
import { ApiServer } from './ApiServer'

describe('apiServer', () => {
  it('should be defined', () => {
    expect(ApiServer).toBeDefined()
  })

  it('should have an health endpoint', async () => {
    const server = new ApiServer()
    const app = server.serve()
    const res = await app.request('health', {
      method: 'GET',
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })

    expect(res.status).toBe(200)
    expect(await res.text()).toBe('OK')
  })

  it('should register a new router', async () => {
    const router: ApiServerRouter = { app: new Hono().basePath('foo').get('bar', c => c.text('success!')) }
    const server = new ApiServer(router)
    const app = server.serve()
    const res = await app.request('foo/bar', {
      method: 'GET',
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })

    expect(res.status).toBe(200)
    expect(await res.text()).toBe('success!')
  })
})
