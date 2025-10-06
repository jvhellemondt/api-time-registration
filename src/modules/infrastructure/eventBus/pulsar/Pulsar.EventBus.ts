import type { EventConsumer, EventHandler, EventProducer } from '@arts-n-crafts/ts'
import type { TimeEntryEvent } from '@modules/domain/TimeEntry/TimeEntry.decider.ts'

export class PulsarEventBus
implements EventProducer<TimeEntryEvent>, EventConsumer<TimeEntryEvent> {
  constructor(
    private readonly producer: EventProducer<TimeEntryEvent>,
    private readonly consumer: EventConsumer<TimeEntryEvent>,
  ) {}

  async consume(stream: string, anEvent: TimeEntryEvent): Promise<void> {
    return this.consumer.consume(stream, anEvent)
  }

  async publish(stream: string, anEvent: TimeEntryEvent): Promise<void> {
    return this.producer.publish(stream, anEvent)
  }

  subscribe(stream: string, aHandler: EventHandler<TimeEntryEvent>): void {
    this.consumer.subscribe(stream, aHandler)
  }
}
