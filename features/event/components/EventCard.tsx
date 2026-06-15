import Image from "next/image";
import ReactMarkdown from "react-markdown";

interface EventCardProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  category: string;
  isPaid: boolean;
  description: string;
}

export default function EventCard({
  title,
  subtitle,
  imageUrl,
  category,
  isPaid,
  description,
}: EventCardProps) {
  return (
    <div className="w-full max-w-4xl mx-auto bg-zinc-900/10 dark:bg-black rounded-xl overflow-hidden border-b border-zinc-200/30">
      {/* Image Container with Aspect Ratio */}
      <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          priority
        />

        {/* Gradient Overlay - Transparent to White from bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-white/80 pointer-events-none" />
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title and Chips Row */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <h2 className="text-2xl font-bold leading-tight text-white dark:text-zinc-50 flex-1 mr-4">
            {title}
          </h2>

          {/* Chips */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Category Chip */}
            <span className="rounded-full px-3 py-1 text-xs font-semibold bg-zinc-800/40 dark:bg-zinc-700/40 backdrop-blur-sm border-b border-white/20 text-white dark:text-zinc-50">
              {category}
            </span>

            {/* Payment Type Chip */}
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                isPaid
                  ? "bg-[#383838] dark:bg-zinc-700"
                  : "bg-green-500/20 dark:bg-green-600/20 border-b border-white/20 dark:border-zinc-50/20"
              } backdrop-blur-sm text-white dark:text-zinc-50`}
            >
              {isPaid ? "Paid Event" : "Free Event"}
            </span>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-base leading-normal text-white/80 dark:text-zinc-400 mb-6">
          {subtitle}
        </p>

        {/* Markdown Description Container */}
        <div className="rounded-lg bg-white/5 dark:bg-black/20 p-5 border-b border-zinc-200/30 dark:border-zinc-700/30">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-xl font-bold text-white dark:text-zinc-50 mb-4">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-lg font-semibold text-white/90 dark:text-zinc-300 mb-3">
                  {children}
                </h2>
              ),
              p: ({ children }) => (
                <p className="text-base leading-normal text-white/80 dark:text-zinc-400 mb-3 last:mb-0">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside-disc pl-6 my-3 space-y-2 text-white/80 dark:text-zinc-400">{children}</ul>
              ),
              li: ({ children }) => (
                <li className="text-base leading-normal mb-1 last:mb-0">
                  {children}
                </li>
              ),
            }}
          >
            {description}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
