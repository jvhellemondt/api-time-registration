import type { CommandBus, EventBus, QueryBus, Repository } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryEvent } from '@/domain/TimeEntry/TimeEntry.decider'
import { InMemoryCommandBus, InMemoryDatabase, InMemoryEventBus, InMemoryQueryBus } from '@jvhellemondt/arts-and-crafts.ts'
import { TimeRegistrationModule } from '@/TimeRegistration.module'
import TimeEntryApi from './TimeEntry'

describe('example', () => {
  let eventBus: EventBus<TimeEntryEvent>
  let commandBus: CommandBus
  let repository: Repository<TimeEntryEvent>
  let queryBus: QueryBus
  let database: InMemoryDatabase
  let server: ReturnType<typeof TimeEntryApi>

  beforeEach(() => {
    eventBus = new InMemoryEventBus()
    commandBus = new InMemoryCommandBus()
    repository = null as unknown as Repository<TimeEntryEvent>
    queryBus = new InMemoryQueryBus()
    database = new InMemoryDatabase()

    new TimeRegistrationModule(repository, database, commandBus, queryBus, eventBus).registerModule()
    server = TimeEntryApi(commandBus, queryBus)
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
})
