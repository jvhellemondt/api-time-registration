import { registerTimeEntryResult } from './outbound'

describe('registerTimeEntryResult', () => {
  it('should be defined', () => {
    expect(registerTimeEntryResult).toBeDefined()
  })

  it('should return a valid result', () => {
    const data = {
      id: '123',
    }
    const result = registerTimeEntryResult.parse(data)
    expect(result).toEqual(data)
  })
})
