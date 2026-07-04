# Architecture

This project uses a feature-oriented Clean Architecture adapted for Next.js.

The goal is to keep business logic independent from UI frameworks, external services, and routing concerns.

## Layer Overview

```text
app
 ↓
features
 ↓
domain
 ↑
data
```

### app

Responsible for routing and page composition.

Contains:

* Next.js routes
* Layouts
* Route handlers
* Route-level metadata

Rules:

* Do not place business logic here.
* Do not call APIs directly from routes.
* Keep pages thin and focused on composition.

---

### domain

Contains the core business rules of the application.

Contains:

* Entities
* Repository contracts
* Use cases
* Domain models

Rules:

* Must not depend on React.
* Must not depend on Next.js.
* Must not depend on Strapi.
* Must not depend on Firebase.
* Must not depend on browser APIs.

Example:

```text
domain/
├── models/
├── repositories/
└── usecases/
```

---

### data

Contains external integrations and persistence implementations.

Contains:

* Strapi clients
* Firebase clients
* DTOs
* Mappers
* Repository implementations

Rules:

* Implements contracts defined in domain.
* May depend on external libraries.
* Must not contain UI code.

Example:

```text
data/
├── api/
├── repositories/
├── dto/
└── mappers/
```

---

### features

Contains presentation logic organized by feature.

Contains:

* Components
* Hooks
* View models
* Feature-specific services

Rules:

* Organize by business feature.
* Avoid cross-feature dependencies when possible.
* Consume use cases from domain.

Example:

```text
features/
├── events/
├── authentication/
├── exhibitors/
└── models/
```

---

### shared

Contains reusable code shared across features.

Contains:

* UI components
* Constants
* Shared types
* Utility hooks

Rules:

* Must remain generic.
* Must not contain feature-specific business logic.

Example:

```text
shared/
├── components/
├── hooks/
├── constants/
└── types/
```

---

### providers

Contains application-wide React providers.

Contains:

* Authentication provider
* Query provider
* Theme provider

Rules:

* Only global application providers belong here.
* Do not place business logic in providers.

---

### lib

Contains framework-independent utilities.

Contains:

* Formatters
* Helpers
* Validation utilities

Rules:

* Must remain stateless whenever possible.
* Do not place business workflows here.

---

## Dependency Rules

Allowed:

```text
app → features
features → domain
data → domain
shared → *
```

Forbidden:

```text
domain → data
domain → features
domain → app

features → data
```

---

## General Guidelines

* Prefer feature-based organization over type-based organization.
* Keep business rules inside use cases.
* Keep React components focused on rendering.
* Use repository interfaces in domain and implementations in data.
* Avoid direct API calls from components.
* Avoid creating new top-level folders without architectural justification.
* Prefer composition over inheritance.
* Keep files small and focused on a single responsibility.
