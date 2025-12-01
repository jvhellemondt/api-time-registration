import type { EventStore } from '@arts-n-crafts/ts'
import type { TimeEntryEvent } from '@modules/domain/TimeEntry/TimeEntry.decider.ts'
import type { Outbox } from '@modules/infrastructure/outbox/Outbox.ts'
import type { Db } from 'mongodb'
import { TimeEntryRepository } from '@modules/domain/repositories/TimeEntryRepository/TimeEntry.repository.ts'
import TimeEntryApi from '@modules/infrastructure/api/TimeEntry.ts'
import {
  ListTimeEntriesDirective,
} from '@modules/infrastructure/database/mongo/directives/ListTimeEntries/ListTimeEntries.directive.ts'
import {
  StoreTimeEntriesDirective,
} from '@modules/infrastructure/database/mongo/directives/StoreTimeEntries/StoreTimeEntries.directive.ts'
import { EventBus } from '@modules/infrastructure/eventBus/EventBus.ts'
import { OutboxWorker } from '@modules/infrastructure/outbox/OutboxWorker.ts'
import {
  TimeEntriesProjector,
} from '@modules/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.handler.ts'

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
