import z from 'zod/v4'

export const registerTimeEntryCommandPayload = z.strictObject({
  userId: z.uuid(),
  startTime: z.number().int().gte(0).lte(4102444800000),
  endTime: z.number().int().gte(0).lte(4102444800000),
})

export type RegisterTimeEntryCommandPayload = z.infer<typeof registerTimeEntryCommandPayload>
