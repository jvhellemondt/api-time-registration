import type { QueryNode } from '@jvhellemondt/arts-and-crafts.ts'
import { buildMongoQuery } from './buildMongoQuery'

describe('buildMongoQuery', () => {
  it('transforms eq node', () => {
    const node: QueryNode = { type: 'eq', field: 'status', value: 'active' }
    expect(buildMongoQuery(node)).toEqual({ status: 'active' })
  })

  it('transforms gt node', () => {
    const node: QueryNode = { type: 'gt', field: 'age', value: 18 }
    expect(buildMongoQuery(node)).toEqual({ age: { $gt: 18 } })
  })

  it('transforms lt node', () => {
    const node: QueryNode = { type: 'lt', field: 'score', value: 100 }
    expect(buildMongoQuery(node)).toEqual({ score: { $lt: 100 } })
  })

  it('transforms and node', () => {
    const node: QueryNode = {
      type: 'and',
      nodes: [
        { type: 'eq', field: 'status', value: 'active' },
        { type: 'gt', field: 'age', value: 18 },
      ],
    }
    expect(buildMongoQuery(node)).toEqual({
      $and: [
        { status: 'active' },
        { age: { $gt: 18 } },
      ],
    })
  })

  it('transforms or node', () => {
    const node: QueryNode = {
      type: 'or',
      nodes: [
        { type: 'eq', field: 'status', value: 'active' },
        { type: 'lt', field: 'age', value: 18 },
      ],
    }
    expect(buildMongoQuery(node)).toEqual({
      $or: [
        { status: 'active' },
        { age: { $lt: 18 } },
      ],
    })
  })

  it('transforms not node', () => {
    const node: QueryNode = {
      type: 'not',
      node: { type: 'eq', field: 'status', value: 'active' },
    }
    expect(buildMongoQuery(node)).toEqual({
      $not: { status: 'active' },
    })
  })

  it('throws on unknown node type', () => {
    const node = { type: 'unknown' } as any
    expect(() => buildMongoQuery(node)).toThrow('Unsupported query node type')
  })
})
