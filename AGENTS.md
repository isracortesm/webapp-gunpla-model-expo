# AI Agent Entry Point

## Repo facts

- **Commands:** `npm run dev`, `npm run build`, `npm run lint`. No typecheck script — run `npx tsc --noEmit` manually.
- **No tests** — no test framework, no test script, no CI, no pre-commit hooks.
- **Env vars** (`NEXT_PUBLIC_HOST_URI`, `NEXT_PUBLIC_DEBUG`) in `.env.local`.
- **`@/` maps to project root** (no `src/` folder).
- **Auth:** JWT stored in `localStorage` (`auth_token`, `auth_user`).

## Architecture — reality vs. docs

See `.agents/rules/` for the documented ideal. The codebase diverges in these ways:

- **No `src/` folder** — everything is at project root.
- **No standalone `providers/` directory** — providers live in `features/<name>/context/` (e.g., `features/auth/context/auth-provider.tsx`).
- **Feature service layer** — `features/*/service/` directly imports from `data/` to wire use cases + repos. This bypasses the `features → data` prohibition in the docs, but this is how the code works.
- **Dual UI component homes** — `components/ui/` (app-specific: Footer, Toolbar) and `shared/components/ui/` (reusable).
- **`lib/`, `constants/`, `types/`** — exist but empty. Utilities live in `shared/utils/`.
- **No DI framework** — manual `new` instantiation throughout.

## Read Order

Agents should read documents in the following order:

### 1. Project Context

* .agents/rules/00-project-context.md

Provides business context and system boundaries.

### 2. Project Structure

* .agents/rules/00-project-structure.md

Defines the expected folder organization.

### 3. Architecture Rules

* .agents/rules/01-architecture.md

Defines architectural constraints and responsibilities.

### 4. Next.js Rules

* .agents/rules/02-nextjs.md

Defines framework-specific guidelines.

### 5. TypeScript Rules

* .agents/rules/03-typescript.md

Defines typing standards and restrictions.

## Important

Do not create new architectural patterns unless explicitly requested.
Reuse existing patterns whenever possible.
