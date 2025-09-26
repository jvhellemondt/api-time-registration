import type { DomainEvent, EventProducer } from '@arts-n-crafts/ts'
import type { TimeEntryEvent } from '@modules/domain/TimeEntry/TimeEntry.decider.ts'
import { parseAsError } from '@arts-n-crafts/ts'
import { Result } from 'oxide.ts'

interface PulsarProducerMessage {
  payload: string
  key?: string
  properties?: Record<string, string>
  context?: string
  replicationClusters?: string[]
}

function toPulsarMessage<T>(event: DomainEvent<T>): PulsarProducerMessage {
  return {
    payload: JSON.stringify(event.payload),
    key: event.id,
    properties: {
      type: event.type,
      aggregateId: event.aggregateId,
      timestamp: event.timestamp,
      ...event.metadata,
    },
    context: event.aggregateId,
  }
}

export class PulsarEventProducer implements EventProducer<TimeEntryEvent> {
  constructor(
    private readonly brokerUrl: string,
    private readonly tenant: string = 'public',
    private readonly namespace: string = 'default',
  ) {
  }

  async publish(stream: string, anEvent: TimeEntryEvent): Promise<void> {
    const url = new URL(`${this.brokerUrl}/topics/persistent/${this.tenant}/${this.namespace}/${stream}`)
    const body = {
      producerName: 'time-entries-producer',
      messages: [
        toPulsarMessage(anEvent),
      ],
    }
    const [err, response] = (
      await Result.safe(fetch(
        url,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        },
      ))
    ).intoTuple()
    if (!response?.ok) {
      throw new Error(`Failed to publish to Pulsar: ${response?.statusText}`)
    }
    if (err !== null) {
      const error = parseAsError(err)
      throw error
    }
  }
}
