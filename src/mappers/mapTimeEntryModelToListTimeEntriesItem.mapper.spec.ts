import type { TimeEntryModel } from '@/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports.ts'
import { subHours } from 'date-fns'
import { v7 as uuidv7 } from 'uuid'
import { mapTimeEntryModelToListTimeEntriesItemMapper } from '@/mappers/mapTimeEntryModelToListTimeEntriesItem.mapper.ts'

describe('mapTimeEntryModelToListTimeEntriesItemMapper', () => {
  it('should be defined', () => {
    expect(mapTimeEntryModelToListTimeEntriesItemMapper).toBeDefined()
  })

  it('should map the TimeEntryModel to ListTimeEntriesItem', () => {
    const timeEntryModels: TimeEntryModel[] = [
      { id: uuidv7(), userId: uuidv7(), startTime: subHours(new Date(), 2).toISOString(), endTime: new Date().toISOString() },
      { id: uuidv7(), userId: uuidv7(), startTime: subHours(new Date(), 2).toISOString(), endTime: new Date().toISOString() },
    ]
    const mapResult = timeEntryModels.map(mapTimeEntryModelToListTimeEntriesItemMapper)
    expect(mapResult).toEqual([
      { id: timeEntryModels[0].id, startTime: timeEntryModels[0].startTime, endTime: timeEntryModels[0].endTime },
      { id: timeEntryModels[1].id, startTime: timeEntryModels[1].startTime, endTime: timeEntryModels[1].endTime },
    ])
  })
})
