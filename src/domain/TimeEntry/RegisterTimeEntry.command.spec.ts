import { randomUUID } from 'node:crypto'
import { subDays } from 'date-fns'
import { RegisterTimeEntry } from './RegisterTimeEntry.command.ts'

describe('registerTimeEntryCommand', () => {
  it('should be defined', () => {
    expect(RegisterTimeEntry).toBeDefined()
  })

  it('should contain the right payload', () => {
    const aggregateId = randomUUID()
    const userId = randomUUID()
    const endTime = new Date()
    const startTime = subDays(endTime, 3)

    const command = RegisterTimeEntry(aggregateId, { userId, startTime, endTime })

    expect(command.payload.userId).toBe(userId)
    expect(command.payload.startTime).toEqual(startTime)
    expect(command.payload.endTime).toEqual(endTime)
  })
})
