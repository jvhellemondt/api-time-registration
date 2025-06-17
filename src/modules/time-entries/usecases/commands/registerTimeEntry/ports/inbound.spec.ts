import { randomUUID } from 'node:crypto'
import { Schema } from 'effect'
import { registerTimeEntryPayload } from './inbound'

describe('registerTimeEntryInbound', () => {
  it('should be defined', () =>
    expect(registerTimeEntryPayload).toBeDefined())

  it('should create valid payload', () => {
    const payload = {
      userId: randomUUID(),
      startTime: '2025-06-17T09:44:42.000Z',
      endTime: '2025-06-17T11:44:42.000Z',
    }

    const decode = Schema.decodeSync(registerTimeEntryPayload)(payload)
    expect(decode).toBeDefined()
    expect(decode.userId).toBe(payload.userId)
    expect(decode.startTime.toISOString()).toBe(payload.startTime)
    expect(decode.endTime.toISOString()).toBe(payload.endTime)
  })
})
