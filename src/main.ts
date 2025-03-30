import { CommandBus, EventBus, InMemoryEventStore } from '@jvhellemondt/arts-and-crafts.ts'
import { Hono } from 'hono'
import TimeEntryApi from './infrastructure/api/TimeEntry'
import { InMemoryTimeEntryRepository } from './repositories/TimeEntryRepository/implementations/InMemoryTimeEntry.implementation'
import { TimeRegistrationModule } from './TimeRegistration.module'

const eventBus = new EventBus()
const commandBus = new CommandBus()
const eventStore = new InMemoryEventStore(eventBus)
const repository = new InMemoryTimeEntryRepository(eventStore)

const timeRegistrationModule = new TimeRegistrationModule(eventStore, commandBus, repository)

timeRegistrationModule.registerModule()

const timeEntryApi = new TimeEntryApi(commandBus)

const app = new Hono()

app.get('/health', c => c.text('OK'))
app.route('/time-entry', timeEntryApi.app)

export default app
