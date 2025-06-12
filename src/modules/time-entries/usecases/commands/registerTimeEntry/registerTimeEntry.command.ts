import z from 'zod/v4'
import { command } from '@/shared/infrastructure/commandBus/command'
import { registerTimeEntryPayload } from './ports/inbound'

export const registerTimeEntryCommand = command.extend({
  type: z.string().default('registerTimeEntry'),
  aggregateId: z.string(),
  payload: registerTimeEntryPayload,
})
