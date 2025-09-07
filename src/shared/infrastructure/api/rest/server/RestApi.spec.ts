import type TimeEntryApi from '@modules/infrastructure/api/TimeEntry.ts'
import { fail } from '@jvhellemondt/arts-and-crafts.ts'
import RestApi from '@shared/infrastructure/api/rest/server/RestApi.ts'
import { v7 as uuidv7 } from 'uuid'

describe('rest api', () => {
  let server: ReturnType<typeof TimeEntryApi>

  beforeEach(() => {
    server = RestApi()
  })

  describe('endpoint /health', () => {
    it('should have an health endpoint', async () => {
      const res = await server.request('health', {
        method: 'GET',
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })

      expect(res.status).toBe(200)
      expect(await res.text()).toBe('HEALTH OK')
    })
  })

  describe('catchAll error', () => {
    it('should trigger the onError handler and return a 500 status', async () => {
      server.get('/error', fail(new Error('FAIL')))

      const res = await server.request('/error', {
        method: 'GET',
        headers: new Headers({ 'Content-Type': 'application/json', 'User-Id': uuidv7() }),
      })
      expect(res.status).toBe(500)
    })
  })
})
