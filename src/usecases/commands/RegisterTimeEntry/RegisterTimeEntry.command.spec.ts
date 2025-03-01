import { randomUUID } from 'node:crypto'
import { subDays } from 'date-fns'
import { describe, expect, it } from 'vitest'
import { RegisterTimeEntryCommand } from './RegisterTimeEntry.command'

describe('registerTimeEntryCommand', () => {
  it('should be defined', () => {
    expect(RegisterTimeEntryCommand).toBeDefined()
  })

  it('should contain the right payload', () => {
    const userId = randomUUID()
    const startTime = new Date()
    const endTime = subDays(startTime, 3)

    const command = new RegisterTimeEntryCommand({ userId, startTime, endTime })

    expect(command.payload.userId).toBe(userId)
    expect(command.payload.startTime).toEqual(startTime)
    expect(command.payload.endTime).toEqual(endTime)
  })
})
