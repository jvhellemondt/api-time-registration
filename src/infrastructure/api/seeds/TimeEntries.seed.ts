import type { EventBus } from '@jvhellemondt/arts-and-crafts.ts'
import type { UUID } from 'node:crypto'
import { randomUUID } from 'node:crypto'
import { subHours } from 'date-fns'
import { TimeEntryRegistered } from '@/domain/events/TimeEntryRegistered.event'

const userFoo = { name: 'foo', id: '94c5964f-3535-4991-b112-c09e887ba72e' as UUID }
const userBar = { name: 'bar', id: 'b4622d27-0fc4-48dd-839d-191a5eeab72a' as UUID }
const userBaz = { name: 'baz', id: 'bfe1089b-78db-4f04-93ac-50db2ba8bcd6' as UUID }
const endTime = new Date()
const startTime = subHours(endTime, 3)

function getRandomArrayItem(): typeof userFoo {
  const arr = [
    userFoo,
    userBar,
    userBaz,
  ]
  const randomIndex = Math.floor(Math.random() * arr.length)
  return arr[randomIndex]
}

export async function seedTimeEntries(eventBus: EventBus) {
  const events = Array.from({ length: 5_000 }).map(() => TimeEntryRegistered(randomUUID(), { userId: getRandomArrayItem().id, startTime, endTime }))
  await Promise.all(events.map((event) => {
    return eventBus.publish(event)
  }))
}
