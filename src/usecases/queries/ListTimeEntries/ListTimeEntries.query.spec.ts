import { v7 as uuidv7 } from 'uuid'
import { listTimeEntriesByUserId } from './ListTimeEntries.query'
import { listTimeEntriesByUserIdPayload } from './ports/inbound'

describe('listTimeEntriesByUserId', () => {
  it('should be defined', () => {
    expect(listTimeEntriesByUserId).toBeDefined()
  })

  it('should contain the right payload', () => {
    const userId = uuidv7()
    const payload = listTimeEntriesByUserIdPayload.parse({ userId })

    const query = listTimeEntriesByUserId(payload)

    expect(query.payload).toBe(payload)
  })
})
