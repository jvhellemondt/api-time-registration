import { CommandBus, EventBus, InMemoryEventStore } from '@jvhellemondt/arts-and-crafts.ts'
import { ApiServer } from '@shared/infrastructure/api/ApiServer'
import TimeEntryApi from './modules/TimeEntries/infrastructure/api/TimeEntry'
import { InMemoryTimeEntryRepository } from './modules/TimeEntries/repositories/TimeEntryRepository/implementations/InMemoryTimeEntry.implementation'
import { TimeRegistrationModule } from './modules/TimeEntries/TimeRegistration.module'

const eventBus = new EventBus()
const commandBus = new CommandBus()
const eventStore = new InMemoryEventStore(eventBus)
const repository = new InMemoryTimeEntryRepository(eventStore)

const timeRegistrationModule = new TimeRegistrationModule(eventStore, commandBus, repository)
timeRegistrationModule.registerModule()

const timeEntryApi = new TimeEntryApi(commandBus)

const server = new ApiServer(timeEntryApi)

export default server.serve()
