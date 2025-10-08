import z from 'zod'

export const timeEntryModel = z.strictObject({
  id: z.uuid(),
  userId: z.uuid(),
  startTime: z.number().int().gte(0).lte(4102444800000),
  endTime: z.number().int().gte(0).lte(4102444800000),
  minutes: z.number(),
})

export type TimeEntryModel = z.infer<typeof timeEntryModel>

export interface StoreTimeEntriesDirectivePort {
  execute(payload: TimeEntryModel): Promise<void>
}

export interface UpdateTimeEntriesDirectivePort {
  execute(payload: Partial<TimeEntryModel>): Promise<void>
}
