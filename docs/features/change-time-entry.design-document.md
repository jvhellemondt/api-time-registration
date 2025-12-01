# 🧾 Change Time Entry — Design Document

## 🎯 Goal

Enable users to modify startTime, endTime, or date of registered time entries, ensuring accurate time tracking. Support distinct commands for each change, maintain consistency via event sourcing, update read models, and deliver features incrementally using Feature-Driven Development (FDD) with Domain-Driven Design (DDD) ubiquitous language.

---

## 🧩 Context

The system manages time entries (e.g., work shifts) in a DDD bounded context, using CQRS to separate write (commands) and read (queries) operations, Event Sourcing for state storage, and an event-driven architecture for loose coupling. The “Change Time Entry” feature extends the system to handle updates to existing time entries, aligning with FDD’s iterative delivery and DDD’s ubiquitous language (e.g., ChangeTimeEntryStart, TimeEntryStartChanged).

---

## 🧱 Architecture

- **Feature-driven design** (FDD) is an agile methodology that organizes development around delivering client-valued features, ensuring incremental and tangible progress. From an architecture perspective, FDD aligns with Domain-Driven Design (DDD), Command Query Responsibility Segregation (CQRS), Event Sourcing, and Event-Driven Architecture to createRouter a scalable, maintainable system for managing time entries.

---

## 📤 Write Model

### Feature: Change start time of time entry

#### 🔹 Command

```typescript
interface ChangeStartTimeOfTimeEntry {
  timeEntryId: UUID
	newStartTime: "HH:mm"
}
```

#### 🔹 Decider

**TimeEntryDecider**:
- Accepts `ChangeStartTime`
- Emits `TimeEntryStartTimeChanged` event

#### 🔹 Event

```typescript
interface TimeEntryStartTimeChanged {
	timeEntryId: UUID
	newStartTime: "HH:mm"
}
```

### Feature: Change end time of time entry

#### 🔹 Command

```typescript
interface ChangeEndTimeOfTimeEntry {
  timeEntryId: UUID
	newEndTime: "HH:mm"
}
```

#### 🔹 Decider

**TimeEntryDecider**:
- Accepts `ChangeEndTime`
- Emits `TimeEntryEndTimeChanged` event

#### 🔹 Event

```typescript
interface TimeEntryEndTimeChanged {
	timeEntryId: UUID
	newEndTime: "HH:mm"
}
```

### Feature: Change date of time entry

#### 🔹 Command

```typescript
interface ChangeDateOfTimeEntry {
  timeEntryId: UUID
	newDate: "yyyy/mm/dd"
}
```

#### 🔹 Decider

**TimeEntryDecider**:
- Accepts `ChangeDate`
- Emits `TimeEntryDateChanged` event

#### 🔹 Event

```typescript
interface TimeEntryDateChanged {
	timeEntryId: UUID
	newDate: "yyyy/mm/dd"
}
```

## 📊 Read Model

### 🔹 Projection: `TimeEntriesProjection`


- Extend to handle `TimeEntryStartTimeChanged` events
- Extend to handle `TimeEntryEndTimeChanged` events
- Extend to handle `TimeEntryDateChanged` events

### 🔹 Projection Structure

```typescript
interface TimeEntryModel {
	id: UUID
	userId: UUID
	startTime: Date
	endTime: Date
	minutes: Number
}
```

## 🔁 Event Flow

```
Command → TimeEntryDecider → Event → Event Store → TimeEntriesProjection → Query DB
```