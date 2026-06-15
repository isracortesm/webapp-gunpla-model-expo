import Image from "next/image";
import ReactMarkdown from "react-markdown";
import "./EventCard.css";

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
    <div className="event-card">
      {/* Image Container with Aspect Ratio */}
      <div className="event-card-image-container">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          priority
        />

        {/* Gradient Overlay - Transparent to White from bottom */}
        <div className="event-card-gradient-overlay" />
      </div>

      {/* Content Section */}
      <div className="event-card-content">
        {/* Title and Chips Row */}
        <div className="event-card-title-row">
          <h2 className="event-card-title">{title}</h2>

          {/* Chips */}
          <div className="event-card-chips-container">
            {/* Category Chip */}
            <span className="event-card-category-chip">{category}</span>

            {/* Payment Type Chip */}
            <span
              className={isPaid ? "event-card-payment-chip-paid" : "event-card-payment-chip-free"}
            >
              {isPaid ? "Paid Event" : "Free Event"}
            </span>
          </div>
        </div>

        {/* Subtitle */}
        <p className="event-card-subtitle">{subtitle}</p>

        {/* Markdown Description Container */}
        <div className="event-card-description-container">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1>{children}</h1>
              ),
              h2: ({ children }) => (
                <h2>{children}</h2>
              ),
              p: ({ children }) => (
                <p>{children}</p>
              ),
              ul: ({ children }) => (
                <ul>{children}</ul>
              ),
              li: ({ children }) => (
                <li>{children}</li>
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
