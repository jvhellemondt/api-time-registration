import type { Database } from '@jvhellemondt/arts-and-crafts.ts'
import { EventBus, InMemoryDatabase } from '@jvhellemondt/arts-and-crafts.ts'
import { AfterTimeEntryRegistered } from './afterTimeEntryRegistered'

describe('afterTimeEntryRegistered subscriber', () => {
  let eventBus: EventBus
  let database: Database

  beforeEach(() => {
    eventBus = new EventBus()
    database = new InMemoryDatabase()
  })

  it('should be defined', () => {
    expect(AfterTimeEntryRegistered).toBeDefined()
  })

  it('should implement ProjectionHandler', () => {
    const handler = new AfterTimeEntryRegistered(eventBus, database)
    expect(handler.start).toThrow()
    expect(handler.update).toThrow()
  })
})
