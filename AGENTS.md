# AI Agent Entry Point

This directory contains all project-specific guidance for AI coding agents.

## Read Order

Agents should read documents in the following order:

### 1. Project Context

* rules/00-project-context.md

Provides business context and system boundaries.

### 2. Project Structure

* rules/00-project-structure.md

Defines the expected folder organization.

### 3. Architecture Rules

* rules/01-architecture.md

Defines architectural constraints and responsibilities.

### 4. Next.js Rules

* rules/02-nextjs.md

Defines framework-specific guidelines.

### 5. TypeScript Rules

* rules/03-typescript.md

Defines typing standards and restrictions.

### 6. API Rules

* rules/04-api.md

Defines API communication patterns.

### 7. UI Rules

* rules/05-ui.md

Defines UI and component standards.

### 8. Quality Rules

* rules/06-quality.md

Defines validation and completion requirements.

### 9. Examples

Review examples before generating new code:

* examples/page-example.md
* examples/component-example.md
* examples/service-example.md
* examples/mapper-example.md

## Priority

When conflicts exist:

1. 00-project-context.md
2. 00-project-structure.md
3. Architecture Rules
4. Feature Rules
5. Examples

## Important

Do not create new architectural patterns unless explicitly requested.

Reuse existing patterns whenever possible.
