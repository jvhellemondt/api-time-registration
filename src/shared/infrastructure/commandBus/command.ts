import z from 'zod/v4'

const commandMetadata = z.looseObject({
  timestamp: z.date(),
  kind: z.string().default('command'),
  correlationId: z.string().optional(),
  causationId: z.string().optional(),
})

export const command = z.object({
  type: z.string().min(1).max(100),
  aggregateId: z.string(),
  payload: z.record(z.string(), z.any()),
  metadata: commandMetadata,
  version: z.number().int().positive().default(1),
})
