import type { Specification } from '@jvhellemondt/arts-and-crafts.ts'

export class TimeEntriesByUser implements Partial<Specification> {
  constructor(private id: string) {}

  isSatisfiedBy(candidate: unknown): boolean {
    return candidate === this.id
  }
}
