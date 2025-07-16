/* eslint-disable no-console */
import type { Database, DatabaseRecord, Specification, Statement } from '@jvhellemondt/arts-and-crafts.ts'
import process from 'node:process'
import { Operation } from '@jvhellemondt/arts-and-crafts.ts'
import { MongoClient, ServerApiVersion } from 'mongodb'
import { buildMongoQuery } from './buildMongoQuery'

interface MongoRecord { _id: string, [key: string]: any }

const MONGODB_USER = process.env.MONGODB_USER || 'root'
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD || 'password'
const MONGODB_HOST = process.env.MONGODB_HOST || 'localhost:27017'
const MONGODB_URI = `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}/?retryWrites=true&w=majority`

let client: MongoClient | null = null

async function ensureConnected(): Promise<void> {
  if (client) {
    try {
      await client.db('admin').command({ ping: 1 })
      return
    }
    catch (pingError) {
      console.warn('Existing MongoDB connection ping failed. Disconnecting and attempting to reconnect...', pingError)
      try {
        await client.close()
      }
      catch (closeError) {
        console.error('Error closing old client after failed ping:', closeError)
      }
      finally {
        client = null
      }
    }
  }

  if (!client) {
    try {
      client = new MongoClient(MONGODB_URI, {
        monitorCommands: true,
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      })
      await client.connect()
    }
    catch (connectError) {
      console.error('Failed to connect to MongoDB Event Store:', connectError)
      client = null
      throw connectError
    }
  }
}

export const MongoDatabase: Database & { connect: () => Promise<typeof MongoDatabase> } = {
  async connect() {
    ensureConnected()
      .then(() => {
        console.log('MongoDatabase: Connected to MongoDB')
      })
      .catch((error) => {
        console.error('MongoDatabase: Failed to connect to MongoDB:', error)
      })
    return this
  },

  async query<T = DatabaseRecord>(
    collectionName: string,
    specification: Specification<T>,
  ): Promise<T[]> {
    await ensureConnected()
    const db = client!.db(collectionName)
    const collection = db.collection<MongoRecord>(collectionName)

    const mongoQuery = buildMongoQuery(specification.toQuery())
    const results = await collection.find(mongoQuery).toArray()
    return results as T[]
  },

  async execute(collectionName: string, statement: Statement): Promise<void> {
    await ensureConnected()
    const db = client?.db(collectionName)
    if (!db)
      throw new Error('Database not connected')

    const collection = db.collection<MongoRecord>(collectionName)
    const { operation, payload: { id, ...payload } } = statement
    const _id = id

    switch (operation) {
      case Operation.CREATE:
        await collection.insertOne({ _id, ...payload })
        break

      case Operation.UPDATE:
        if (!id)
          throw new Error('Missing _id for update')
        await collection.updateOne({ _id }, { $set: payload })
        break

      case Operation.DELETE:
        if (!id)
          throw new Error('Missing id for delete')
        await collection.deleteOne({ _id })
        break

      default:
        throw new Error(`Unsupported operation: ${operation}`)
    }
  },
}
