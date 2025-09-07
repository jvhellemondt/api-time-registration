import z from 'zod'

export const timeEntryModel = z.strictObject({
  id: z.uuid(),
  userId: z.uuid(),
  startTime: z.iso.datetime(),
  endTime: z.iso.datetime(),
  minutes: z.number(),
})

export type TimeEntryModel = z.infer<typeof timeEntryModel>

export interface StoreTimeEntriesDirectivePort {
  execute(payload: TimeEntryModel): Promise<void>
}

export interface UpdateTimeEntriesDirectivePort {
  execute(payload: Partial<TimeEntryModel>): Promise<void>
}
