# 🧾 Time Registration System — Design Document

## 🎯 Goal

To build a scalable, event-driven time tracking system that:

- Logs when users start and stop working
- Handles overlapping time entries with the **"last from wins"** rule
- Supports retroactive logging and multiple time zones
- Enables flexible queries and analytics via projections

---

## 🧩 Context

- Users log time by specifying a start and end time.
- Entries may overlap. If they do, the **entry with the latest start time takes priority** in that range.
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
interface CreateTimeEntry {
  userId: UUID
  from: Date // UTC
  to: Date // UTC
}
```

### 🔹 Decider

**TimeEntryDecider**:
- Accepts `CreateTimeEntry`
- Validates `from < to`
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
- Converts `from/to` to user's **local time zone**
- Splits across days if needed
- Applies **"last `from` wins"** rule:
  - New entry overrides overlapping blocks where `entry.from > block.from`

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
- Each user has a configured IANA time zone (e.g. `"Europe/Berlin"`)
- Projection uses this to resolve the **local day key**

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

- `from < to`
- Overlaps are allowed
- In overlaps, **entry with later `from` wins for overlapping region**
- No activity description (for now)

---

## 🧩 Extensibility

- Add categories/tags to events later
- Add `DeleteTimeEntry` command + event if needed
- Aggregate stats projection (`TotalHoursPerDay`, `Streaks`, etc.)
