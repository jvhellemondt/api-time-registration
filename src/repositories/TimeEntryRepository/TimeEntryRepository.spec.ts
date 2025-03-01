import { InMemoryTimeEntryRepository } from './implementations/InMemoryTimeEntry.implementation'

describe('timeEntryRepository', () => {
  it('should be defined', () => {
    expect(InMemoryTimeEntryRepository).toBeDefined()
  })

  it('should extend on repository', () => {
    expect(InMemoryTimeEntryRepository.prototype).toHaveProperty('load')
    expect(InMemoryTimeEntryRepository.prototype).toHaveProperty('store')
  })
})
