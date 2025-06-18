/*
* A Component is responsible for taking actions/ mutations
* and thus sending events and persisting the events in the message store
* */
export interface Component {
  handlers: (...args: unknown[]) => Record<string, () => void>
  start: () => void
}
