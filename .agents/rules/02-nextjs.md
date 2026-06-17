# Next.js Conventions

This project uses Next.js App Router.

Follow these conventions when creating new code.

## Routing

Routes are defined using the App Router file system.

Examples:

```text
app/
├── page.tsx                 -> /
├── login/page.tsx           -> /login
├── events/page.tsx          -> /events
├── events/[id]/page.tsx     -> /events/:id
```

Rules:

* Use file-system routing.
* Keep route files minimal.
* Delegate UI to features.
* Delegate business logic to domain use cases.

Example:

```tsx
export default async function EventsPage() {
  return <EventsScreen />;
}
```

---

## Layouts

Use layouts only when multiple routes share a common structure.

Examples:

```text
app/
├── layout.tsx
└── admin/
    ├── layout.tsx
    ├── users/page.tsx
    └── settings/page.tsx
```

Rules:

* Avoid creating unnecessary layouts.
* Layouts should focus on composition.
* Do not place business logic in layouts.

---

## Server Components

Use Server Components by default.

Example:

```tsx
export default async function Page() {
  const events = await getEvents();

  return <EventsList events={events} />;
}
```

Rules:

* Prefer Server Components whenever possible.
* Fetch data on the server when no client interactivity is required.
* Avoid unnecessary `"use client"` directives.

---

## Client Components

Use Client Components only when required.

Examples:

* useState
* useEffect
* useContext
* Browser APIs
* Event handlers

Example:

```tsx
"use client";

export function LoginForm() {
  const [email, setEmail] = useState("");
}
```

Rules:

* Keep client components as small as possible.
* Push data fetching to the server whenever possible.

---

## Data Fetching

Preferred flow:

```text
Page
 ↓
Use Case
 ↓
Repository Contract
 ↓
Repository Implementation
 ↓
Strapi / Firebase
```

Avoid:

```tsx
fetch(...)
```

directly inside UI components.

---

## Forms

Rules:

* Use React Hook Form for complex forms.
* Use Zod for validation schemas.
* Keep validation schemas outside components.

Example:

```text
features/
└── authentication/
    ├── LoginForm.tsx
    └── loginSchema.ts
```

---

## Styling

Rules:

* Use Tailwind CSS.
* Prefer utility classes.
* Extract reusable patterns into shared components.
* Avoid large custom CSS files.

Example:

```tsx
<Button variant="primary" />
```

instead of repeatedly duplicating styles.

---

## Images

Use Next.js Image component.

Example:

```tsx
import Image from "next/image";
```

Rules:

* Do not use raw img tags unless necessary.
* Configure allowed image domains.

---

## Navigation

Use:

```tsx
import Link from "next/link";
```

for navigation.

Use:

```tsx
import { useRouter } from "next/navigation";
```

for programmatic navigation.

Avoid direct window.location usage.

---

## API Routes

Place route handlers inside:

```text
app/api/
```

Example:

```text
app/api/events/route.ts
```

Rules:

* Keep handlers thin.
* Delegate business logic to use cases.
* Do not duplicate domain logic.

---

## Metadata

Prefer route metadata.

Example:

```tsx
export const metadata = {
  title: "Events",
};
```

Avoid manually manipulating document.title.

---

## Folder Ownership

```text
app/        -> Routing
features/   -> Screens and UI
domain/     -> Business logic
data/       -> External services
shared/     -> Reusable components
providers/  -> Global providers
lib/        -> Utilities
```

Never place feature-specific code inside shared.
