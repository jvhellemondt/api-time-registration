import type { TimeEntryModel } from '@modules/TimeRegistration/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports.ts'
import { mapTimeEntryModelToListTimeEntriesItemMapper } from '@modules/TimeRegistration/mappers/mapTimeEntryModelToListTimeEntriesItem.mapper.ts'
import { subHours } from 'date-fns'
import { v7 as uuidv7 } from 'uuid'

describe('mapTimeEntryModelToListTimeEntriesItemMapper', () => {
  it('should be defined', () => {
    expect(mapTimeEntryModelToListTimeEntriesItemMapper).toBeDefined()
  })

  it('should map the TimeEntryModel to ListTimeEntriesItem', () => {
    const timeEntryModels: TimeEntryModel[] = [
      { id: uuidv7(), userId: uuidv7(), startTime: subHours(new Date(), 2).getTime(), endTime: new Date().getTime(), minutes: 120 },
      { id: uuidv7(), userId: uuidv7(), startTime: subHours(new Date(), 2).getTime(), endTime: new Date().getTime(), minutes: 120 },
    ]
    const mapResult = timeEntryModels.map(mapTimeEntryModelToListTimeEntriesItemMapper)
    expect(mapResult).toEqual([
      { id: timeEntryModels[0].id, startTime: timeEntryModels[0].startTime, endTime: timeEntryModels[0].endTime, duration: { in: 'minutes', value: 120 } },
      { id: timeEntryModels[1].id, startTime: timeEntryModels[1].startTime, endTime: timeEntryModels[1].endTime, duration: { in: 'minutes', value: 120 } },
    ])
  })
})
