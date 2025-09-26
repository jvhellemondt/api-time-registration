import type { EventConsumer, EventProducer } from '@arts-n-crafts/ts'
import type { TimeEntryEvent } from '@modules/domain/TimeEntry/TimeEntry.decider.ts'
import { SimpleEventBus } from '@arts-n-crafts/ts'

export class EventBus
  extends SimpleEventBus<TimeEntryEvent>
  implements EventProducer<TimeEntryEvent>, EventConsumer<TimeEntryEvent> {
}
