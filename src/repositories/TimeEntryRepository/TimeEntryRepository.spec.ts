import { InMemoryTimeEntryRepository } from './implementations/InMemoryTimeEntry.implementation'

describe('timeEntryRepository', () => {
  it('should be defined', () => {
    expect(InMemoryTimeEntryRepository).toBeDefined()
  })
})
