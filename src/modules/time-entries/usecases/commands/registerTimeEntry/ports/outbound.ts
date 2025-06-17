import { z } from 'zod/v4'

export const registerTimeEntryResult = z.strictObject({
  id: z.string(),
})
