export type COLLECTION = 'time_entries' | 'event_store'

type CollectionsSchemaMap = { name: COLLECTION }[]

export const collectionsSchemaMap: CollectionsSchemaMap = [
  { name: 'time_entries' },
  { name: 'event_store' },
]
