import type { TimeEntryModel } from '@/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports'
import z from 'zod/v4'

export const listTimeEntriesByUserIdPayload = z.strictObject({
  userId: z.uuid(),
})

export type ListTimeEntriesByUserIdPayload = z.infer<typeof listTimeEntriesByUserIdPayload>

export interface ListTimeEntriesDirectivePort {
  execute(userId: string): Promise<TimeEntryModel[]>
}
