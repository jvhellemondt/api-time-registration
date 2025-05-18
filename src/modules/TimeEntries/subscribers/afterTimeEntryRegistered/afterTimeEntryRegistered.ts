import type { BaseEvent } from '@jvhellemondt/arts-and-crafts.ts/src/infrastructure/EventBus/Event'
import { ProjectionHandler } from '@jvhellemondt/arts-and-crafts.ts'

export class AfterTimeEntryRegistered extends ProjectionHandler {
  start(): void {
    throw new Error('Method not implemented.')
  }

  update(_event: BaseEvent): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
