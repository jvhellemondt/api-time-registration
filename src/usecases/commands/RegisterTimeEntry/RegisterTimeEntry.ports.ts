import z from 'zod/v4'

export const registerTimeEntryCommandPayload = z.strictObject({
  userId: z.uuid(),
  startTime: z.iso.datetime(),
  endTime: z.iso.datetime(),
})

export type RegisterTimeEntryCommandPayload = z.infer<typeof registerTimeEntryCommandPayload>

export interface RegisterTimeEntryResult {
  id: string
}
