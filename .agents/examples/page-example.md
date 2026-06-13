# Page Example

## Purpose

Reference implementation for Next.js pages.

## Rules Demonstrated

* Server Component
* Service consumption
* Metadata usage
* No direct API calls
* No business logic

```tsx
import type { Metadata } from 'next';

import { getFeaturedContests } from '@/features/contests/services/get-featured-contests';
import { ContestList } from '@/features/contests/components/contest-list';

export const metadata: Metadata = {
  title: 'Contests',
  description: 'Browse active contests.',
};

export default async function ContestsPage() {
  const contests = await getFeaturedContests();

  return (
    <main className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">
        Active Contests
      </h1>

      <ContestList contests={contests} />
    </main>
  );
}
```

## Notes

Pages must remain thin.

Pages orchestrate data and UI.

Pages do not contain:

* API calls
* Mapping logic
* Validation logic
* Business rules
