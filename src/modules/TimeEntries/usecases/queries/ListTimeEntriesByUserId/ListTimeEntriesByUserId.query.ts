import type { ListTimeEntriesByUserIdPayload } from './ports/inbound'
import { createQuery } from '@jvhellemondt/arts-and-crafts.ts'

export function ListTimeEntriesByUserId(input: ListTimeEntriesByUserIdPayload) {
  return createQuery('ListTimeEntriesByUserId', input)
}
