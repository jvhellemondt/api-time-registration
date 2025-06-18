/*
* A Retriever is responsible for answering queries from consumers
* It should retrieve the projected data (views) from the DB and provide the data to the consumer
* */
export interface Retriever {
  handlers: Record<string, () => void>
  queries: Record<string, () => void>
  start: () => void
}
