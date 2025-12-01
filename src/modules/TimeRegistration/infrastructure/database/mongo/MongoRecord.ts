export type MongoRecord<T> = Omit<T, 'id'> & { _id: string }
