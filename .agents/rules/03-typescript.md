# TypeScript Standards

Follow these conventions for all TypeScript code.

## General Principles

* Prefer type safety over convenience.
* Avoid `any`.
* Prefer explicit types when they improve readability.
* Keep types close to the domain they represent.
* Prefer immutable data structures whenever possible.

---

## Naming Conventions

### Types

Use PascalCase.

```ts id="b3gm5t"
type Event = {}

interface EventRepository {}
```

### Variables

Use camelCase.

```ts id="jlwmkk"
const eventId = "123";
```

### Constants

Use UPPER_SNAKE_CASE only for true constants.

```ts id="z9fg3t"
const MAX_EVENTS_PER_PAGE = 20;
```

### Functions

Use camelCase and action-oriented names.

```ts id="m8u6j8"
getEvents()
createEvent()
validateUser()
```

---

## Interfaces vs Types

Prefer:

```ts id="t5lzzc"
type Event = {
  id: string;
  name: string;
};
```

for models and DTOs.

Use:

```ts id="0lshs5"
interface EventRepository {
  getEvents(): Promise<Event[]>;
}
```

for contracts and abstractions.

---

## Nullability

Prefer:

```ts id="pjlwm5"
name?: string
```

over:

```ts id="3c4h5v"
name: string | undefined
```

Avoid:

```ts id="s59q6g"
name: any
```

Always handle nullable values explicitly.

---

## Domain Models

Domain models represent business entities.

Example:

```ts id="y6lsiu"
export type Event = {
  id: string;
  title: string;
  description: string;
};
```

Rules:

* Keep domain models framework-independent.
* Do not include API-specific fields.
* Do not include UI-specific properties.

---

## DTOs

DTOs represent external data contracts.

Example:

```ts id="r5v34w"
export type EventDto = {
  id?: string;
  title?: string;
  description?: string;
};
```

Rules:

* DTO fields should match API responses.
* DTOs belong in the data layer.
* Prefer optional fields for external responses.

---

## Mappers

Always map DTOs into domain models.

Example:

```ts id="xnnr0j"
export function toEvent(dto: EventDto): Event {
  return {
    id: dto.id ?? "",
    title: dto.title ?? "",
    description: dto.description ?? "",
  };
}
```

Rules:

* Never expose DTOs to the UI.
* Never expose API contracts to domain.
* Normalize null values inside mappers.

---

## Repository Contracts

Repository contracts belong in domain.

Example:

```ts id="d9rbrz"
export interface EventRepository {
  getEvents(): Promise<Event[]>;
}
```

Rules:

* Domain defines contracts.
* Data implements contracts.

---

## Functions

Prefer small, focused functions.

Good:

```ts id="v6xl0m"
function calculateTotal(items: Item[]): number {
  ...
}
```

Avoid:

```ts id="53kvab"
function processEverything() {
  ...
}
```

---

## Async/Await

Prefer:

```ts id="b8n33z"
const events = await repository.getEvents();
```

Avoid:

```ts id="j4fh8e"
repository.getEvents().then(...)
```

unless composition requires it.

---

## Enums

Prefer union types.

Instead of:

```ts id="1dzctw"
enum EventStatus {
  Draft,
  Published,
}
```

Use:

```ts id="t9icmh"
type EventStatus =
  | "draft"
  | "published";
```

---

## React Props

Define explicit props types.

Example:

```ts id="4ahz4w"
type EventCardProps = {
  title: string;
  description: string;
};
```

Avoid inline prop definitions in large components.

---

## Imports

Prefer absolute imports.

Example:

```ts id="x33ju6"
import { GetEventsUseCase } from "@/domain/usecases";
```

Avoid deep relative imports.

```ts id="ocgrfk"
import { GetEventsUseCase } from "../../../../domain/usecases";
```

---

## Type Assertions

Avoid:

```ts id="8z20zn"
value as Event
```

Prefer proper type guards.

```ts id="s6t5wz"
if (isEvent(value)) {
  ...
}
```

---

## Error Handling

Use typed errors.

Example:

```ts id="xqg0z6"
type AppError = {
  code: string;
  message: string;
};
```

Avoid throwing raw strings.

```ts id="ow2zjl"
throw "error";
```

---

## Code Style

Prefer:

* Early returns
* Small functions
* Composition over inheritance
* Pure functions when possible

Avoid:

* Nested conditionals
* Large files
* God objects
* Excessive use of any

---

## Forbidden

Do not use:

```ts id="y4h6zk"
any
```

except as a last resort and with justification.

Do not expose DTOs outside the data layer.

Do not place business logic inside React components.
