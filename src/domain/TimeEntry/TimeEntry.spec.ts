import type { UUID } from 'node:crypto'
import { randomUUID } from 'node:crypto'
import { DomainEvent } from '@jvhellemondt/crafts-and-arts.ts'
import { subDays, subMinutes } from 'date-fns'
import { TimeEntryRegistered } from '../events/TimeEntryRegistered.event'
import { TimeEntry } from './TimeEntry'

describe('timeEntry', () => {
  const endTime = new Date()

  it('should be defined', () => {
    expect(TimeEntry).toBeDefined()
  })

  it('should contain user id, start time and end time', () => {
    const aggregateId = randomUUID()
    const props = { userId: randomUUID(), startTime: subDays(endTime, 3), endTime }
    const timeEntry = TimeEntry.create(props, aggregateId)
    expect(timeEntry.id).toBe(aggregateId)
    expect(timeEntry.props.userId).toBe(props.userId)
    expect(timeEntry.props.startTime).toBe(props.startTime)
    expect(timeEntry.props.endTime).toBe(endTime)
  })

  it('should rehydrate the TimeEntry', () => {
    const aggregateId = randomUUID()
    const props = { userId: randomUUID(), startTime: subDays(endTime, 3), endTime }
    const event = new TimeEntryRegistered(aggregateId, props)
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
    const event = new TimeEntryRegistered(aggregateId, props)
    const timeEntry = TimeEntry.rehydrate(aggregateId, [event, event])
    expect(timeEntry.uncommittedEvents).toHaveLength(0)
  })

  it('should throw an error upon calling rehydrate when no events are given', () => {
    expect(() => TimeEntry.rehydrate(randomUUID(), [])).toThrow()
  })

  it('should ignore a fakeEvent upon rehydration', () => {
    class FakeEvent extends DomainEvent<{ userId: UUID }> { }

    const aggregateId = randomUUID()
    const userId = randomUUID()
    const event = new TimeEntryRegistered(aggregateId, { userId, startTime: subMinutes(endTime, 120), endTime })
    const fakeId = randomUUID()
    const fakeEvent = new FakeEvent(aggregateId, { userId: fakeId })
    const aggregate = TimeEntry.rehydrate(aggregateId, [event, fakeEvent])
    expect(aggregate).toBeDefined()
    expect(aggregate.props.userId).not.toBe(fakeId)
    expect(aggregate.props.userId).toBe(userId)
  })
})
