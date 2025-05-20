import type { DomainEvent, EventBus } from '@jvhellemondt/arts-and-crafts.ts'
import type { Collection, Db } from 'mongodb'
import process from 'node:process'
import { EventStore } from '@jvhellemondt/arts-and-crafts.ts'
import { MongoClient, ServerApiVersion } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://root:password@localhost:27017/time-registration?authSource=admin'
const DB_NAME = 'timeEntries'
const EVENTS_COLLECTION = 'events'

let client: MongoClient | null = null // Initialize to null
let eventsCollection: Collection<DomainEvent> | null = null // Initialize to null
let db: Db | null = null // Initialize to null

async function ensureConnected(): Promise<void> {
  // 1. Check if an existing connection is active and healthy
  if (client && db) { // Only attempt ping if client and db are potentially initialized
    try {
      await client.db('admin').command({ ping: 1 })
      console.log('Existing MongoDB connection is alive.')
      return // Connection is good, nothing more to do
    }
    catch (pingError) {
      console.warn('Existing MongoDB connection ping failed. Disconnecting and attempting to reconnect...', pingError)
      // If ping failed, force close the old client and set to null to force new connection
      try {
        await client.close()
      }
      catch (closeError) {
        console.error('Error closing old client after failed ping:', closeError)
      }
      finally {
        client = null
        db = null
        eventsCollection = null
      }
    }
  }

  // 2. If no active connection (or ping failed), establish a new one
  if (!client) { // Only create a new client if it's null
    try {
      client = new MongoClient(MONGODB_URI, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      })
      await client.connect() // This establishes the connection
      db = client.db(DB_NAME) // Assign db after successful connection
      eventsCollection = db.collection<DomainEvent>(EVENTS_COLLECTION)

      await eventsCollection.createIndex({ aggregateId: 1, sequenceNumber: 1 }, { unique: true })

      console.log('MongoDB Event Store connected and ready.')
    }
    catch (connectError) {
      console.error('Failed to connect to MongoDB Event Store:', connectError)
      // Important: clear client/db/collection on connection failure to avoid bad state
      client = null
      db = null
      eventsCollection = null
      throw connectError // Re-throw to indicate connection failure
    }
  }
}

export class MongoEventStore extends EventStore {
  constructor(eventBus: EventBus) {
    super(eventBus)
  }

  public async connect(): Promise<void> {
    await ensureConnected()
  }

  public override async store(event: DomainEvent): Promise<void> {
    await ensureConnected()

    if (!eventsCollection) {
      throw new Error('Events collection not initialized after connection attempt.')
    }

    try {
      const result = await eventsCollection.insertOne({ ...event })

      if (result.acknowledged) {
        console.log(`Event stored: ${event.type} for ${event.aggregateId} (Seq: {event.sequenceNumber})`)
      }
      else {
        throw new Error('Failed to acknowledge event insertion.')
      }
    }
    catch (error: any) {
      if (error.code === 11000) {
        throw new Error(
          `Optimistic concurrency violation: Event with sequence number {event.sequenceNumber} `
          + `for aggregate ${event.aggregateId} already exists.`,
        )
      }
      console.error('Error storing event:', error.message)
      throw error
    }
  }

  public override async loadEvents(aggregateId: string): Promise<DomainEvent[]> {
    await ensureConnected()

    if (!eventsCollection) {
      throw new Error('Events collection not initialized after connection attempt.')
    }

    const events = await eventsCollection
      .find({ aggregateId })
      .sort({ sequenceNumber: 1 })
      .toArray()

    return events as DomainEvent[]
  }

  public async disconnect(): Promise<void> { // Made public per original method signature
    if (client) {
      try {
        await client.close()
        console.log('MongoDB Event Store disconnected.')
      }
      catch (error) {
        console.error('Error disconnecting MongoDB client:', error)
      }
      finally {
        client = null
        db = null
        eventsCollection = null
      }
    }
  }
}
