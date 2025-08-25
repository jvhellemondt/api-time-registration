import z from 'zod/v4'

export const listTimeEntriesByUserIdPayload = z.strictObject({
  userId: z.uuid(),
})

export type ListTimeEntriesByUserIdPayload = z.infer<typeof listTimeEntriesByUserIdPayload>

export interface ListTimeEntriesItem {
  id: string
  startTime: string
  endTime: string
  duration: {
    in: 'hours' | 'minutes' | 'seconds'
    value: number
  }
}

export interface ListTimeEntriesDirectivePort {
  execute(userId: string): Promise<ListTimeEntriesItem[]>
}
