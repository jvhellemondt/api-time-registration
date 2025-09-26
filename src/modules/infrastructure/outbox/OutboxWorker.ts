import type { OutboxWorker as IOutboxWorker } from '@arts-n-crafts/ts'
import { GenericOutboxWorker } from '@arts-n-crafts/ts'

export class OutboxWorker
  extends GenericOutboxWorker
  implements IOutboxWorker {
}
