# 🧾 Time Registration System — Design Document

## 🎯 Goal

To build a scalable, event-driven time tracking system that:

- Logs (based on entry) when users started and stopped doing a task
- Enables flexible queries and analytics via projections

---

## 🧩 Context

- Users log time by specifying a start and end time.
- System must support:
  - **CQRS** for separation of reads and writes
  - **Event Sourcing** for a full audit trail and replayability
  - **EDA** (Event-Driven Architecture) for loosely coupled components
  - **Multiple time zones**, with entries projected into users' local day-based timelines

---

## 🧱 Architecture

- **Event Sourcing**
  Commands emit immutable events stored in an event store.

- **EDA (Event-Driven Architecture)**
  Projections and external systems react to events asynchronously.

- **Decider Pattern**
  Stateless, functional `TimeEntryDecider` makes decisions based on past events.

- **CQRS**
  Write side (commands) and read side (projections/queries) are fully separated.

---

## 📤 Write Model

### 🔹 Command

```typescript
interface RegisterTimeEntry {
  userId: UUID
  from: Date // UTC
  to: Date // UTC
}
```

### 🔹 Decider

**TimeEntryDecider**:
- Accepts `CreateTimeEntry`
- Validates `from < to` (nice-to-have)
- Emits `TimeEntryCreated` event

### 🔹 Event

```typescript
interface TimeEntryCreated {
  userId: UUID
  from: Date // UTC
  to: Date // UTC
}
```

---

## 📊 Read Model

### 🔹 Projection: `UserTimelineProjection`

- Keyed by `userId` + **local date**
- Handles `TimeEntryCreated` events

### 🔹 Projection Structure

```typescript
interface TimeBlock {
  from: DateTime // UTC
  to: DateTime // UTC
}
```

---

## 🌍 Time Zone Handling

- All time is stored as UTC

---

## 🔎 Query Examples

```typescript
getTimeBlocksForUser(userId: UUID, day: YYYY-MM-DD): TimeBlock[]
getTotalHours(userId: UUID, range: DateRange): Duration
```

---

## 🔁 Event Flow

```
Command → TimeEntryDecider → Event → Event Store → UserTimelineProjection → Query DB
```

---

## ✅ Business Rules

- Overlaps are allowed
- No activity description (for now)

---

## 🧩 Extensibility

- Add categories/tags to events later
- Add `changeStartTime`, `changeEndTime` and `changeDate` command + event if needed
- Aggregate stats projection (`TotalHoursPerDay`, `Streaks`, etc.)
