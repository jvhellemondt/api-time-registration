import { CommandBus, EventBus, InMemoryEventStore } from '@jvhellemondt/arts-and-crafts.ts'
import { InMemoryTimeEntryRepository } from './repositories/TimeEntryRepository/implementations/InMemoryTimeEntry.implementation'
import { TimeRegistrationModule } from './TimeRegistration.module'

const eventBus = new EventBus()
const commandBus = new CommandBus()
const eventStore = new InMemoryEventStore(eventBus)
const repository = new InMemoryTimeEntryRepository(eventStore)

const timeRegistrationModule = new TimeRegistrationModule(eventStore, commandBus, repository)

timeRegistrationModule.registerModule()

export { commandBus, eventStore }
