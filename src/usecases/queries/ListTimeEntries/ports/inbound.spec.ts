import { v7 as uuidv7 } from 'uuid'
import { listTimeEntriesByUserIdPayload } from './inbound'

describe('listTimeEntriesByUserId', () => {
  it('should be defined', () => {
    expect(listTimeEntriesByUserIdPayload).toBeDefined()
  })

  it('should succeed parsing', () => {
    const userId = uuidv7()
    const payload = listTimeEntriesByUserIdPayload.parse({ userId })
    expect(payload).toBeDefined()
    expect(payload.userId).toBe(userId)
  })

  it('should fail parsing', () => {
    const userId = 123
    expect(() => listTimeEntriesByUserIdPayload.parse({ userId })).toThrow()
  })
})
