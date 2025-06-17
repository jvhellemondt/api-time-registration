import { randomUUID } from 'node:crypto'
import { Schema } from 'effect'
import { registerTimeEntryResult } from './outbound'

describe('registerTimeEntryResult', () => {
  it('should be defined', () => {
    expect(registerTimeEntryResult).toBeDefined()
  })

  it('should return a valid result', () => {
    const data = {
      id: randomUUID(),
    }
    const payload = Schema.decodeSync(registerTimeEntryResult)(data)
    expect(payload).toEqual(data)
  })
})
