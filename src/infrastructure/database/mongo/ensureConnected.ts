import type { MongoClient } from 'mongodb'

export async function ensureConnected(client: MongoClient): Promise<void> {
  try {
    await client.db('admin').command({ ping: 1 })
    return
  }
  catch (pingError) {
    console.warn('MongoDatabase: Existing MongoDB connection ping failed. Disconnecting and attempting to reconnect...', pingError)
    try {
      await client.close()
    }
    catch (closeError) {
      console.error('MongoDatabase: Error closing old client after failed ping:', closeError)
    }
  }

  try {
    await client.connect()
  }
  catch (connectError) {
    console.error('MongoDatabase: Failed to connect to MongoDB Event Store:', connectError)
    throw connectError
  }
}
