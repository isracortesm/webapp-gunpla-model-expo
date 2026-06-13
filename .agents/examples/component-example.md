# Component Example

## Purpose

Reference implementation for reusable UI components.

## Rules Demonstrated

* Typed props
* Presentation only
* Tailwind styling
* No API access
* No business logic

```tsx
import Image from 'next/image';

interface ContestCardProps {
  title: string;
  description: string;
  imageUrl: string;
}

export function ContestCard({
  title,
  description,
  imageUrl,
}: ContestCardProps) {
  return (
    <article className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <Image
        src={imageUrl}
        alt={title}
        width={600}
        height={400}
        className="h-48 w-full object-cover"
      />

      <div className="p-4">
        <h2 className="text-xl font-semibold">
          {title}
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          {description}
        </p>
      </div>
    </article>
  );
}
```

## Notes

Components are responsible only for rendering.

Components must not:

* Fetch data
* Call services
* Access environment variables
* Perform business logic
