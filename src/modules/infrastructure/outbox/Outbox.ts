import type { Outbox as IOutbox } from '@arts-n-crafts/ts'
import { InMemoryOutbox } from '@arts-n-crafts/ts'

export class Outbox
  extends InMemoryOutbox
  implements IOutbox {
}
