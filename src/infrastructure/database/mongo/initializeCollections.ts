import type { Db } from 'mongodb'
import { collectionsSchemaMap } from '../collections'

export async function initializeCollections(database: Db) {
  const listCollections = await database
    .listCollections({}, { nameOnly: true })
    .toArray()
  const listCollectionNames = listCollections
    .map(({ name }) => name)
  const missingCollections = collectionsSchemaMap
    .filter(({ name }) => !listCollectionNames.includes(name))
  await Promise.all(
    missingCollections
      .map(async collection => database.createCollection(collection.name)),
  )
}
