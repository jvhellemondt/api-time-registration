import type { Config } from '@config'
import { fail } from '@arts-n-crafts/ts'
import { MongoClient, ServerApiVersion } from 'mongodb'
import { ensureConnected } from './ensureConnected.ts'

export async function createMongoClient(config: Config['mongodb']): Promise<MongoClient> {
  const client: MongoClient = new MongoClient(config.uri, {
    monitorCommands: true,
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  })

  try {
    await ensureConnected(client)
  }
  catch {
    fail(new Error('MongoDatabase::client > not initialized'))
  }
  return client
}
