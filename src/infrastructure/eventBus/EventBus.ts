import type { EventBus as IEventBus } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryEvent } from '@/domain/TimeEntry/TimeEntry.decider'
import { SimpleEventBus } from '@jvhellemondt/arts-and-crafts.ts'

export class EventBus
  extends SimpleEventBus<TimeEntryEvent>
  implements IEventBus<TimeEntryEvent> {
}
