import z from 'zod/v4'

export const listTimeEntriesByUserIdPayload = z.strictObject({
  userId: z.uuid(),
})

export type ListTimeEntriesByUserIdInput = z.input<typeof listTimeEntriesByUserIdPayload>
export type ListTimeEntriesByUserIdOutput = z.output<typeof listTimeEntriesByUserIdPayload>
