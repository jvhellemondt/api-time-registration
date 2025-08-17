import process from 'node:process'
import { fail } from '@jvhellemondt/arts-and-crafts.ts'
import { MongoClient, ServerApiVersion } from 'mongodb'
import { ensureConnected } from './ensureConnected'
import { initializeCollections } from './initializeCollections'

const MONGODB_USER = process.env.MONGODB_USER ?? 'root'
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD ?? 'password'
const MONGODB_HOST = process.env.MONGODB_HOST ?? 'localhost:27017'
const MONGODB_DBNAME = process.env.MONGODB_DBNAME ?? 'development'
const MONGODB_QUERYPARAMS = process.env.MONGODB_QUERYPARAMS ?? 'retryWrites=true&w=majority'
export const MONGODB_URI = `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}/${MONGODB_DBNAME}?${MONGODB_QUERYPARAMS}`

export const client: MongoClient = new MongoClient(MONGODB_URI, {
  monitorCommands: true,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

export async function getClient(): Promise<MongoClient> {
  try {
    await ensureConnected(client)
  }
  catch {
    fail(new Error('MongoDatabase::client: not initialized'))
  }
  const database = client.db()
  await initializeCollections(database)

  return client
}
