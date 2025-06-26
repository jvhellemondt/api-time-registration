import { TimeEntriesProjectionHandler } from './TimeEntriesProjection.handler'

describe('afterTimeEntryRegisteredHandler', () => {
  it('should be defined', () => {
    expect(TimeEntriesProjectionHandler).toBeDefined()
  })

  it('should implement the projection handler interface', () => {
    const handler = new TimeEntriesProjectionHandler()
    expect(() => handler.handle({} as any)).rejects.toThrow()
    expect(() => handler.start()).toThrow()
  })
})
