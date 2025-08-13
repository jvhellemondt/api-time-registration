/* eslint-disable no-console */
import process from 'node:process'
import { fail, invariant } from '@jvhellemondt/arts-and-crafts.ts'
import { MongoClient, ServerApiVersion } from 'mongodb'

const MONGODB_USER = process.env.MONGODB_USER ?? 'root'
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD ?? 'password'
const MONGODB_HOST = process.env.MONGODB_HOST ?? 'localhost:27017'
const MONGODB_DBNAME = process.env.MONGODB_DBNAME ?? 'development'
const MONGODB_QUERYPARAMS = process.env.MONGODB_QUERYPARAMS ?? 'retryWrites=true&w=majority'
const MONGODB_URI = `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}/${MONGODB_DBNAME}?${MONGODB_QUERYPARAMS}`

let client: MongoClient | null = null

export type MongoRecord<T> = T & { _id: string }

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

  if (client === null) {
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
      console.log('MongoDatabase: Connected to MongoDB')
    }
    catch (connectError) {
      console.error('Failed to connect to MongoDB Event Store:', connectError)
      client = null
      throw connectError
    }
  }
}

export async function getClient(): Promise<MongoClient> {
  await ensureConnected()
  invariant(client !== null, fail(new Error('MongoDatabase: Client is not initialized')))
  return client
}
