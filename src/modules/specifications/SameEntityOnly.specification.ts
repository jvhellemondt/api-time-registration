import type { QueryNode, WithIdentifier } from '@jvhellemondt/arts-and-crafts.ts'
import { createQueryNode, Specification } from '@jvhellemondt/arts-and-crafts.ts'

export class SameEntityOnly<TEntity extends WithIdentifier> extends Specification<TEntity[]> {
  constructor(
    private readonly entity: TEntity,
  ) {
    super()
  }

  isSatisfiedBy(entities: TEntity[]): boolean {
    return entities.every(entity => entity.id === this.entity.id)
  }

  toQuery(): QueryNode {
    return createQueryNode('eq', 'id', this.entity.id)
  }
}
