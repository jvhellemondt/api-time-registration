import { z } from 'zod/v4'

export const registerTimeEntryPayload = z.strictObject({
  userId: z.string(),
  startTime: z.date(),
  endTime: z.date(),
})
