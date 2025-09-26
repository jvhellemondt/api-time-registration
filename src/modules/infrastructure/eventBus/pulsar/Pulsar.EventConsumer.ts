import type { EventConsumer, EventHandler } from '@arts-n-crafts/ts'
import type { TimeEntryEvent } from '@modules/domain/TimeEntry/TimeEntry.decider.ts'
import type { InMemoryOutbox } from '@modules/infrastructure/eventBus/pulsar/InMemoryOutbox.ts'
import { Buffer } from 'node:buffer'
import { createDomainEvent, parseAsError } from '@arts-n-crafts/ts'

interface PulsarWebSocketMessage {
  messageId: string | [number, number]
  payload: string
  properties?: Record<string, string>
  publishTime?: number
  eventTime?: number
  sequenceId?: number
  key?: string
  orderingKey?: string
}

export class PulsarEventConsumer implements EventConsumer<TimeEntryEvent> {
  private handlers = new Map<string, EventHandler<TimeEntryEvent>[]>()
  private websocket: WebSocket | undefined

  constructor(
    private readonly brokerUrl: string,
    private readonly stream: string = 'time-entries',
    private readonly outbox: InMemoryOutbox<TimeEntryEvent>,
    private readonly tenant: string = 'public',
    private readonly namespace: string = 'default',
  ) {
  }

  start(intervalMs: number): void {
    setInterval(() => {
      void this.tick().catch(console.error)
    }, intervalMs)
  }

  async tick(): Promise<void> {
    const pending = this.outbox.getPending()

    await Promise.all(pending.map(async (entry) => {
      try {
        const event = entry.event
        await this.consume(this.stream, event)
        this.outbox.markAsPublished(entry.id)
      }
      catch {
        this.outbox.markAsFailed(entry.id)
      }
    }))
  }

  disconnect() {
    this.websocket!.close()
  }

  async connect(subscription = 'time-entries-subscription') {
    const url = `${this.brokerUrl}/ws/v2/consumer/persistent/${this.tenant}/${this.namespace}/${this.stream}/${subscription}`
    this.websocket = new WebSocket(url)
    return new Promise((resolve) => {
      this.websocket!.addEventListener('message', (raw: MessageEvent<string>) => {
        try {
          const data = JSON.parse(raw.data.toString()) as PulsarWebSocketMessage
          const payload = JSON.parse(Buffer.from(data.payload, 'base64').toString('utf-8')) as TimeEntryEvent['payload']
          const event = createDomainEvent(data.properties!.type, data.properties!.aggregateId, payload)
          this.outbox.enqueue(event)
          const ackMsg = { messageId: data.messageId }
          this.websocket!.send(JSON.stringify(ackMsg))
        }
        catch (err) {
          console.error('Failed to handle message:', err)
        }
      })

      this.websocket!.addEventListener('error', (err) => {
        const error = parseAsError(err)
        console.error('WebSocket error:', err)
        throw error
      })

      this.websocket?.addEventListener('open', () => {
        resolve(true)
      })
    })
  }

  subscribe(
    stream: string,
    aHandler: EventHandler<TimeEntryEvent>,
  ): void {
    const handlersForType = this.handlers.get(stream) ?? []
    handlersForType.push(aHandler)
    this.handlers.set(stream, handlersForType)
  }

  async consume(stream: string, anEvent: TimeEntryEvent): Promise<void> {
    if (!this.handlers.has(stream))
      return
    const handlers = this.handlers.get(stream) as EventHandler<TimeEntryEvent>[]
    await Promise.all(handlers.map(async (handler) => {
      return handler.handle(anEvent)
    }))
  }
}
