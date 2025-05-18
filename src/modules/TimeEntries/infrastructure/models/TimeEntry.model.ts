import type { UUID } from 'node:crypto'
import type { TimeEntryProps } from '@/TimeEntries/domain/TimeEntry/TimeEntry'

export interface TimeEntryModel extends TimeEntryProps {
  id: UUID
}
