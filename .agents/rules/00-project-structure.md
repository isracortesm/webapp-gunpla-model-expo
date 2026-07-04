Expected Project Structure

This project follows a feature-oriented Clean Architecture adapted for Next.js.

src/
├── app/         # Next.js routing (pages, layouts, route handlers)
├── domain/      # Business entities, repository contracts, use cases
├── data/        # Repository implementations, API clients, DTOs, mappers
├── features/    # Feature-specific UI, hooks, and presentation logic
├── shared/      # Reusable UI components, types, constants
├── providers/   # React Context providers and application-level state
└── lib/         # Framework-independent utilities and helpers

Rules

New code must follow this structure.
Keep business logic inside domain.
Keep external service integrations (Strapi, Firebase, REST APIs, etc.) inside data.
Keep routing concerns inside app.
Organize UI by feature inside features.
Place reusable components in shared.
Do not create new top-level folders without explicit architectural justification.
Prefer feature-based organization over type-based organization whenever possible.
Avoid placing business logic inside React components.
Use dependency inversion: domain must not depend on data, features, or framework-specific code.