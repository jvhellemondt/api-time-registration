import type { Outbox as IOutbox } from '@jvhellemondt/arts-and-crafts.ts'
import { InMemoryOutbox } from '@jvhellemondt/arts-and-crafts.ts'

export class Outbox
  extends InMemoryOutbox
  implements IOutbox {
}
