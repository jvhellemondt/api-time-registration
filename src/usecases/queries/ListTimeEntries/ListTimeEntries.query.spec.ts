import { randomUUID } from 'node:crypto'
import { listTimeEntriesByUserId } from './ListTimeEntries.query'
import { listTimeEntriesByUserIdPayload } from './ports/inbound'

describe('listTimeEntriesByUserId', () => {
  it('should be defined', () => {
    expect(listTimeEntriesByUserId).toBeDefined()
  })

  it('should contain the right payload', () => {
    const userId = randomUUID()
    const payload = listTimeEntriesByUserIdPayload.parse({ userId })

    const query = listTimeEntriesByUserId(payload)

    expect(query.payload).toBe(payload)
  })
})
