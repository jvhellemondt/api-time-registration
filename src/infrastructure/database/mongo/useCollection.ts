import type { Db, Document } from 'mongodb'
import type { COLLECTION } from '../collections'

export function useCollection(database: Db) {
  return <T extends Document>(collectionName: COLLECTION) => {
    return database.collection<T>(collectionName)
  }
}
