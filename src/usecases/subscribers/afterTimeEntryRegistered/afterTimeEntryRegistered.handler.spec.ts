import { AfterTimeEntryRegisteredHandler } from './afterTimeEntryRegistered.handler'

describe('afterTimeEntryRegisteredHandler', () => {
  it('should be defined', () => {
    expect(AfterTimeEntryRegisteredHandler).toBeDefined()
  })

  it('should implement the projection handler interface', () => {
    const handler = new AfterTimeEntryRegisteredHandler()
    expect(() => handler.handle({} as any)).rejects.toThrow()
    expect(() => handler.start()).toThrow()
  })
})
