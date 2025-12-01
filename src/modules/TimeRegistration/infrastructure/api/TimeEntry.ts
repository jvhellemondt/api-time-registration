import type { Repository } from '@arts-n-crafts/ts'
import type { TimeEntryEvent } from '@modules/TimeRegistration/domain/TimeEntry/TimeEntry.decider.ts'
import type { TimeEntryEntity } from '@modules/TimeRegistration/domain/TimeEntry/TimeEntry.entity.ts'
import type { ListTimeEntriesDirectivePort } from '@modules/TimeRegistration/usecases/queries/ListTimeEntries/ListTimeEntries.ports.ts'
import { createRegisterTimeEntryCommand } from '@modules/TimeRegistration/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.command.ts'
import { RegisterTimeEntryHandler } from '@modules/TimeRegistration/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.handler.ts'
import { registerTimeEntryCommandPayload } from '@modules/TimeRegistration/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.ports.ts'
import { ListTimeEntriesByUserIdHandler } from '@modules/TimeRegistration/usecases/queries/ListTimeEntries/ListTimeEntries.handler.ts'
import {
  listTimeEntriesByUserIdPayload,

} from '@modules/TimeRegistration/usecases/queries/ListTimeEntries/ListTimeEntries.ports.ts'
import { createListTimeEntriesByUserIdQuery } from '@modules/TimeRegistration/usecases/queries/ListTimeEntries/ListTimeEntries.query.ts'
import { Hono } from 'hono'
import { v7 as uuidv7 } from 'uuid'

interface TimeEntryApiProps {
  listTimeEntriesDirective: ListTimeEntriesDirectivePort
  repository: Repository<TimeEntryEvent, Promise<TimeEntryEntity>>
}

export default function TimeEntryApi(props: TimeEntryApiProps) {
  return new Hono()
    .get('/list-time-entries', async (c) => {
      const anUserId = c.req.header('User-Id')
      const aPayloadParseResult = listTimeEntriesByUserIdPayload.safeParse({ userId: anUserId })
      if (aPayloadParseResult.error) {
        return c.json({ error: aPayloadParseResult.error.message }, 400)
      }
      const aQuery = createListTimeEntriesByUserIdQuery(aPayloadParseResult.data)
      const anHandler = new ListTimeEntriesByUserIdHandler(props.listTimeEntriesDirective)
      const aResult = await anHandler.execute(aQuery)
      return c.json(aResult, 200)
    })

    .post('/register-time-entry', async (c) => {
      const anUserId = c.req.header('User-Id')
      const aBody = await c.req.json <{ startTime: string, endTime: string }>()
      const aPayloadParseResult = registerTimeEntryCommandPayload.safeParse({ userId: anUserId, ...aBody })
      if (aPayloadParseResult.error) {
        return c.json({ error: aPayloadParseResult.error.message }, 400)
      }

      const aCommand = createRegisterTimeEntryCommand(uuidv7(), aPayloadParseResult.data)
      const anHandler = new RegisterTimeEntryHandler(props.repository)
      const aResult = await anHandler.execute(aCommand)
      return c.json({ ...aResult }, 201)
    })
}
