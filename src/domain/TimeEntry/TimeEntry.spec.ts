import { randomUUID } from 'node:crypto'
import { createDomainEvent } from '@jvhellemondt/arts-and-crafts.ts'
import { subDays, subMinutes } from 'date-fns'
import { TimeEntryRegistered } from '../events/TimeEntryRegistered.event'
import { TimeEntry } from './TimeEntry'

describe('timeEntry', () => {
  const FakeEvent = (id: string, props: object) => createDomainEvent('FakeEvent', id, props)
  const endTime = new Date()

  it('should be defined', () => {
    expect(TimeEntry).toBeDefined()
  })

  it('should contain user id, start time and end time', () => {
    const aggregateId = randomUUID()
    const props = { userId: randomUUID(), startTime: subDays(endTime, 3), endTime }
    const timeEntry = TimeEntry.create(aggregateId, props)
    expect(timeEntry.id).toBe(aggregateId)
    expect(timeEntry.props.userId).toBe(props.userId)
    expect(timeEntry.props.startTime).toBe(props.startTime)
    expect(timeEntry.props.endTime).toBe(endTime)
  })

  it('should rehydrate the TimeEntry', () => {
    const aggregateId = randomUUID()
    const props = { userId: randomUUID(), startTime: subDays(endTime, 3), endTime }
    const event = TimeEntryRegistered(aggregateId, props)
    const timeEntry = TimeEntry.rehydrate(aggregateId, [event])
    expect(timeEntry).toBeDefined()
    expect(timeEntry.id).toBe(aggregateId)
    expect(timeEntry.props.userId).toBe(props.userId)
    expect(timeEntry.props.startTime).toBe(props.startTime)
    expect(timeEntry.props.endTime).toBe(endTime)
  })

  it('should not change anything if the registered event is consumed twice', () => {
    const aggregateId = randomUUID()
    const props = { userId: randomUUID(), startTime: subDays(endTime, 3), endTime }
    const event = TimeEntryRegistered(aggregateId, props)
    const timeEntry = TimeEntry.rehydrate(aggregateId, [event, event])
    expect(timeEntry.uncommittedEvents).toHaveLength(0)
  })

  it('should throw an error upon calling rehydrate when no events are given', () => {
    expect(() => TimeEntry.rehydrate(randomUUID(), [])).toThrow()
  })

  it('should throw an error upon calling rehydrate when wrong creation event is given', () => {
    expect(() => TimeEntry.rehydrate(randomUUID(), [FakeEvent(randomUUID(), { userId: randomUUID() })])).toThrow()
  })

  it('should ignore a fakeEvent upon rehydration', () => {
    const aggregateId = randomUUID()
    const userId = randomUUID()
    const event = TimeEntryRegistered(aggregateId, { userId, startTime: subMinutes(endTime, 120), endTime })
    const fakeId = randomUUID()
    const fakeEvent = FakeEvent(aggregateId, { userId: fakeId })
    const aggregate = TimeEntry.rehydrate(aggregateId, [event, fakeEvent])
    expect(aggregate).toBeDefined()
    expect(aggregate.props.userId).not.toBe(fakeId)
    expect(aggregate.props.userId).toBe(userId)
  })
})
