import { registerTimeEntryPayload } from './inbound'

describe('registerTimeEntryInbound', () => {
  it('should be defined', () =>
    expect(registerTimeEntryPayload).toBeDefined())

  it('should create valid payload', () => {
    const data = {
      userId: '123',
      startTime: new Date(),
      endTime: new Date(),
    }
    const payload = registerTimeEntryPayload.parse(data)
    expect(payload).toBeDefined()
    expect(payload.userId).toBe(data.userId)
    expect(payload.startTime).toBe(data.startTime)
    expect(payload.endTime).toBe(data.endTime)
  })
})
