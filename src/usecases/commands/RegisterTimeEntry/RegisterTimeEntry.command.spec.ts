import { subHours } from 'date-fns'
import { v7 as uuidv7 } from 'uuid'
import { registerTimeEntry } from './RegisterTimeEntry.command.ts'
import { registerTimeEntryCommandPayload } from './RegisterTimeEntry.ports.ts'

describe('registerTimeEntryCommand', () => {
  it('should be defined', () => {
    expect(registerTimeEntry).toBeDefined()
  })

  it('should contain the right payload', () => {
    const aggregateId = uuidv7()
    const userId = uuidv7()
    const endTime = new Date().toISOString()
    const startTime = subHours(endTime, 3).toISOString()
    const payload = registerTimeEntryCommandPayload.parse({ userId, startTime, endTime })

    const command = registerTimeEntry(aggregateId, payload)

    expect(command.payload).toBe(payload)
  })
})
