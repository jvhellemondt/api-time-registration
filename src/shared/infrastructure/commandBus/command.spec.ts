import { command } from './command'

describe('command', () => {
  it('should be defined', () => {
    expect(command).toBeDefined()
  })

  it('should create a valid command', () => {
    const data = {
      type: 'TestCommand',
      aggregateId: '123',
      payload: { name: 'Test' },
      metadata: {
        timestamp: new Date(),
        kind: 'command',
        correlationId: '456',
        causationId: '789',
      },
      version: 1,
    }
    const test = command.parse(data)
    expect(test).toEqual(data)
  })
})
