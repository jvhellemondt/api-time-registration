import type { Database } from '@jvhellemondt/arts-and-crafts.ts'
import type { UseCollection } from './useCollection.ts'
import { FieldEquals, Operation, SimpleDatabase } from '@jvhellemondt/arts-and-crafts.ts'
import { useCollection } from './useCollection.ts'

interface Entry { id: string, name?: string, updated?: boolean }

describe('use collection', () => {
  let database: Database<Entry>
  let collection: UseCollection<Entry>

  beforeEach(async () => {
    database = new SimpleDatabase<Entry>()
    await database.execute('time_entries', { operation: Operation.CREATE, payload: { id: '1', name: 'John' } })
    collection = useCollection(database, 'time_entries')
  })

  it('should be defined', () => {
    expect(useCollection).toBeDefined()
  })

  it('should retrieve the entry', async () => {
    const specification = new FieldEquals('id', '1')
    const entry = await collection.query(specification)
    expect(entry).toEqual([{ id: '1', name: 'John' }])
  })

  it('should create entries', async () => {
    const payload = { id: '2' }
    const specification = new FieldEquals('id', '2')
    await collection.execute({ operation: Operation.CREATE, payload })
    const entry = await collection.query(specification)
    expect(entry).toEqual([{ id: '2' }])
  })

  it('should overwrite entries', async () => {
    const payload = { id: '1', updated: true }
    await collection.execute({ operation: Operation.PUT, payload })
    const entry = await collection.query(new FieldEquals('id', '1'))
    expect(entry).toEqual([{ id: '1', updated: true }])
    expect(entry[0].name).toBeUndefined()
  })

  it('should patch entries', async () => {
    const payload = { id: '1', updated: true }
    await collection.execute({ operation: Operation.PATCH, payload })
    const entry = await collection.query(new FieldEquals('id', '1'))
    expect(entry).toEqual([{ id: '1', name: 'John', updated: true }])
  })

  it('should delete entries', async () => {
    const payload = { id: '1' }
    await collection.execute({ operation: Operation.DELETE, payload })
    const entry = await collection.query(new FieldEquals('id', '1'))
    expect(entry).toEqual([])
  })
})
