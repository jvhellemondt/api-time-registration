export interface Aggregator {
  handlers: Record<string, () => void>
  queries: Record<string, () => void>
  start: () => void
}
