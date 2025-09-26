import type { DomainEvent, Outbox } from '@arts-n-crafts/ts'

interface OutboxEntry<TEvent> {
  id: string
  event: TEvent
  published: boolean
  retryCount: number
  lastAttemptAt?: string
}

export class InMemoryOutbox<TEvent extends DomainEvent> implements Outbox {
  protected entries: OutboxEntry<TEvent>[] = []
  protected idCounter = 0

  // @ts-expect-error not a promise
  enqueue(event: TEvent): void {
    this.entries.push({
      id: (this.idCounter++).toString(),
      event,
      published: false,
      retryCount: 0,
    })
  }

  // @ts-expect-error not a promise
  getPending(limit = 100): OutboxEntry<TEvent>[] {
    return this.entries.filter(e => !e.published).slice(0, limit)
  }

  // @ts-expect-error not a promise
  markAsPublished(id: string): void {
    const entry = this.entries.find(e => e.id === id)
    if (entry) {
      entry.published = true
    }
  }

  // @ts-expect-error not a promise
  markAsFailed(id: string): void {
    const entry = this.entries.find(e => e.id === id)
    if (entry) {
      entry.retryCount += 1
      entry.lastAttemptAt = new Date().toISOString()
    }
  }
}
