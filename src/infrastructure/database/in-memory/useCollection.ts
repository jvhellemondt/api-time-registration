import type { CreateStatement, Database, DeleteStatement, PatchStatement, PutStatement, Specification } from '@jvhellemondt/arts-and-crafts.ts'
import type { COLLECTION } from '../collections'
import { Operation } from '@jvhellemondt/arts-and-crafts.ts'

export interface UseCollection<T> {
  query(specification: Specification<T>): Promise<T[]>
  execute(statement: CreateStatement<T> | PutStatement<T> | PatchStatement<T> | DeleteStatement): Promise<void>
}

export function useCollection<T>(database: Database<T>, collectionName: COLLECTION): UseCollection<T> {
  return {
    query: async (specification: Specification<T>) => {
      return database.query(collectionName, specification)
    },
    execute: async (statement: CreateStatement<T> | PutStatement<T> | PatchStatement<T> | DeleteStatement): Promise<void> => {
      switch (statement.operation) {
        case Operation.CREATE:
          return database.execute(collectionName, statement)
        case Operation.PUT:
          return database.execute(collectionName, statement)
        case Operation.PATCH:
          return database.execute(collectionName, statement)
        case Operation.DELETE:
          return database.execute(collectionName, statement)
      }
    },
  }
}
