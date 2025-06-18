/*
* An Aggregator is responsible for updating projections
* and persisting the projection in the database
* */
export interface Aggregator {
  handlers: Record<string, () => void>
  queries: Record<string, () => void>
  start: () => void
}
