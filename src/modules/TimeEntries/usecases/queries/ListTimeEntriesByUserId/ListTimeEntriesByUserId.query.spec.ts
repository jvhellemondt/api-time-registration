import { randomUUID } from 'node:crypto'
import { ListTimeEntriesByUserId } from './ListTimeEntriesByUserId.query'

describe('query ListTimeEntriesByUserId', () => {
  it('should be defined', () => {
    expect(ListTimeEntriesByUserId).toBeDefined()
  })

  it('should create the query', () => {
    const userId = randomUUID()
    const query = ListTimeEntriesByUserId({ userId })
    expect(query.type).toBe('ListTimeEntriesByUserId')
    expect(query.payload.userId).toBe(userId)
    expect(query.metadata.kind).toBe('query')
  })
})
