import type { EventStore } from '@arts-n-crafts/ts'
import type { TimeEntryEvent } from '@modules/TimeRegistration/domain/TimeEntry/TimeEntry.decider.ts'
import type { Outbox } from '@modules/TimeRegistration/infrastructure/outbox/Outbox.ts'
import type { Db } from 'mongodb'
import { TimeEntryRepository } from '@modules/TimeRegistration/domain/repositories/TimeEntryRepository/TimeEntry.repository.ts'
import TimeEntryApi from '@modules/TimeRegistration/infrastructure/api/TimeEntry.ts'
import {
  ListTimeEntriesDirective,
} from '@modules/TimeRegistration/infrastructure/database/mongo/directives/ListTimeEntries/ListTimeEntries.directive.ts'
import {
  StoreTimeEntriesDirective,
} from '@modules/TimeRegistration/infrastructure/database/mongo/directives/StoreTimeEntries/StoreTimeEntries.directive.ts'
import { EventBus } from '@modules/TimeRegistration/infrastructure/eventBus/EventBus.ts'
import { OutboxWorker } from '@modules/TimeRegistration/infrastructure/outbox/OutboxWorker.ts'
import {
  TimeEntriesProjector,
} from '@modules/TimeRegistration/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.handler.ts'

export class TimeEntryModule {
  constructor(
    private readonly database: Db,
    private readonly eventStore: EventStore<TimeEntryEvent>,
    private readonly outbox: Outbox,
  ) {
  }

  get router() {
    const stream = 'time_entries'
    const eventBus = new EventBus()
    const outboxWorker = new OutboxWorker(this.outbox, eventBus, stream)
    outboxWorker.start(250)

    eventBus.subscribe(stream, new TimeEntriesProjector(new StoreTimeEntriesDirective(stream, this.database)))
    const repository = new TimeEntryRepository(this.eventStore)
    const listTimeEntriesDirective = new ListTimeEntriesDirective(stream, this.database)
    return TimeEntryApi({
      repository,
      listTimeEntriesDirective,
    })
  }
}
