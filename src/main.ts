import { InMemoryCommandBus, InMemoryQueryBus } from '@jvhellemondt/arts-and-crafts.ts'
import { Hono } from 'hono'
import TimeEntryApi from './infrastructure/api/TimeEntry'

const commandBus = new InMemoryCommandBus()
const queryBus = new InMemoryQueryBus()

const timeEntryApi = TimeEntryApi(commandBus, queryBus)

const server = new Hono()
  .route('', timeEntryApi)

export default server
