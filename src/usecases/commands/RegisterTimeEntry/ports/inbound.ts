import z from 'zod/v4'

export const RegisterTimeEntryPayload = z.strictObject({
  userId: z.uuid(),
  startTime: z.iso.datetime(),
  endTime: z.iso.datetime(),
})

export type RegisterTimeEntryInput = z.input<typeof RegisterTimeEntryPayload>
export type RegisterTimeEntryOutput = z.output<typeof RegisterTimeEntryPayload>
