import type { QueryNode } from '@jvhellemondt/arts-and-crafts.ts'

export function buildMongoQuery(node: QueryNode): Record<string, unknown> {
  switch (node.type) {
    case 'eq':
      return { [node.field]: node.value }

    case 'gt':
      return { [node.field]: { $gt: node.value } }

    case 'lt':
      return { [node.field]: { $lt: node.value } }

    case 'and':
      return { $and: node.nodes.map(buildMongoQuery) }

    case 'or':
      return { $or: node.nodes.map(buildMongoQuery) }

    case 'not':
      return { $not: buildMongoQuery(node.node) }

    default:
      throw new Error(`Unsupported query node type: ${(node as any).type}`)
  }
}
