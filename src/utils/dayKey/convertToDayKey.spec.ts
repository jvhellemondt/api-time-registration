import { convertToDayKey } from './convertToDayKey'

describe('convertToDayKey', () => {
  it('should be defined', () => {
    expect(convertToDayKey).toBeDefined()
  })

  it('should convert a date to a day key', () => {
    const date = new Date('2022-2-1')
    const expected = '20220201'
    expect(convertToDayKey(date)).toEqual(expected)
  })
})
