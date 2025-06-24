import { randomUUID } from 'node:crypto'
import { subDays } from 'date-fns'
import { Schema } from 'effect'
import { registerTimeEntryPayload } from '@/usecases/commands/RegisterTimeEntry/ports/inbound.ts'
import { RegisterTimeEntry } from './RegisterTimeEntry.command.ts'

describe('registerTimeEntryCommand', () => {
  it('should be defined', () => {
    expect(RegisterTimeEntry).toBeDefined()
  })

  it('should contain the right payload', () => {
    const aggregateId = randomUUID()
    const userId = randomUUID()
    const endTime = new Date().toISOString()
    const startTime = subDays(endTime, 3).toISOString()
    const payload = Schema.decodeSync(registerTimeEntryPayload)({ userId, startTime, endTime })

    const command = RegisterTimeEntry(aggregateId, payload)

    expect(command.payload).toBe(payload)
  })
})
