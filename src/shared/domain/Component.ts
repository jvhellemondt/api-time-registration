export interface Component {
  eventHandlers: (...args: unknown[]) => Record<string, () => void>
  commandHandlers: (...args: unknown[]) => Record<string, () => void>
  start: () => void
}
