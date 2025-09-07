import type { OutboxWorker as IOutboxWorker } from '@jvhellemondt/arts-and-crafts.ts'
import { GenericOutboxWorker } from '@jvhellemondt/arts-and-crafts.ts'

export class OutboxWorker
  extends GenericOutboxWorker
  implements IOutboxWorker {
}
