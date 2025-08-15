import { SameEntityOnly } from './SameEntityOnly.specification'

describe('sameEntityOnly', () => {
  it('should be defined', () => {
    expect(SameEntityOnly).toBeDefined()
  })

  it('should satisfy the specification', () => {
    const entity = { id: '123' }
    const specification = new SameEntityOnly(entity)
    const entities = [{ id: '123' }, { id: '123' }]

    expect(specification.isSatisfiedBy(entities)).toBe(true)
  })

  it('should not satisfy the specification', () => {
    const entity = { id: '123' }
    const specification = new SameEntityOnly(entity)
    const entities = [{ id: '123' }, { id: '456' }]

    expect(specification.isSatisfiedBy(entities)).toBe(false)
  })

  it('should transform to a querynode', () => {
    const entity = { id: '123' }
    const specification = new SameEntityOnly(entity)
    const queryNode = specification.toQuery()

    expect(queryNode).toStrictEqual({
      field: 'id',
      type: 'eq',
      value: '123',
    })
  })
})
