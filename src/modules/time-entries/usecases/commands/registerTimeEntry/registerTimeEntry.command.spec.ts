import { registerTimeEntryCommand } from './registerTimeEntry.command'

describe('registerTimeEntryCommand', () => {
  it('should be valid', () => {
    const command = registerTimeEntryCommand.parse({
      aggregateId: '123e4567-e89b-12d3-a456-426614174000',
      payload: {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        startTime: new Date(),
        endTime: new Date(),
      },
      metadata: {
        timestamp: new Date(),
        correlationId: '123e4567-e89b-12d3-a456-426614174000',
        causationId: '123e4567-e89b-12d3-a456-426614174000',
      },
    })

    expect(command).toEqual({
      type: 'registerTimeEntry',
      aggregateId: '123e4567-e89b-12d3-a456-426614174000',
      payload: {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        startTime: expect.any(Date),
        endTime: expect.any(Date),
      },
      metadata: {
        timestamp: expect.any(Date),
        kind: 'command',
        correlationId: '123e4567-e89b-12d3-a456-426614174000',
        causationId: '123e4567-e89b-12d3-a456-426614174000',
      },
      version: 1,
    })
  })
})
