import { v7 as uuidv7 } from 'uuid'
import { createListTimeEntriesByUserIdQuery } from './ListTimeEntries.query'
import { listTimeEntriesByUserIdPayload } from './ports/inbound'

describe('listTimeEntriesByUserId', () => {
  it('should be defined', () => {
    expect(createListTimeEntriesByUserIdQuery).toBeDefined()
  })

  it('should contain the right payload', () => {
    const userId = uuidv7()
    const payload = listTimeEntriesByUserIdPayload.parse({ userId })

    const query = createListTimeEntriesByUserIdQuery(payload)

    expect(query.payload).toBe(payload)
  })
})
