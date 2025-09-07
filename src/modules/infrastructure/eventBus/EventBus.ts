import type { EventBus as IEventBus } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryEvent } from '@modules/domain/TimeEntry/TimeEntry.decider.ts'
import { SimpleEventBus } from '@jvhellemondt/arts-and-crafts.ts'

export class EventBus
  extends SimpleEventBus<TimeEntryEvent>
  implements IEventBus<TimeEntryEvent> {
}
