import { mapIdToMongoId, mapMongoIdToId } from './mapMongoId'

describe('id mapping', () => {
  const dataWithMongoId = [
    { _id: '123', name: 'Alice' },
    { _id: '456', name: 'Bob' },
  ]

  const dataWithId = [
    { id: '123', name: 'Alice' },
    { id: '456', name: 'Bob' },
  ]

  it('mapMongoIdToId should convert _id to id', () => {
    expect(dataWithMongoId.map(mapMongoIdToId)).toEqual(dataWithId)
  })

  it('mapIdToMongoId should convert id to _id', () => {
    expect(dataWithId.map(mapIdToMongoId)).toEqual(dataWithMongoId)
  })
})
