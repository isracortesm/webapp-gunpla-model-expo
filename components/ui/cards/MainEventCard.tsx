import Image from "next/image";
import ReactMarkdown from "react-markdown";
import "./MainEventCard.css";
import { SocialNetworkIcons } from "@/shared/components/ui/social-networks/SocialNetworkIcons";
import { type SocialNetworkItem } from "@/domain/entities/event-dashboard/entity";
import { EventEntity } from "@/domain/entities/event-dashboard/entity";

interface MainEventCardProps {
  event: EventEntity;
  socialNetworks?: SocialNetworkItem[];
}

export default function MainEventCard({ event }: MainEventCardProps) {
  const imageUrl = event.image?.url || "";
  const category = event.category?.name || "Uncategorized";
  const isPaid = event.costType === 'paid';
  const subtitle = event.shortDescription;

  return (
    <div className="event-card">
      {/* Image Container with Aspect Ratio */}
      <div className="event-card-image-container">
        {imageUrl && (
          <>
            <Image
              src={imageUrl}
              alt={event.name}
              fill
              className="object-cover"
              priority
            />

            {/* Gradient Overlay - Transparent to White from bottom */}
            <div className="event-card-gradient-overlay" />
          </>
        )}
      </div>

      {/* Content Section */}
      <div className="event-card-content">
        {/* Title and Chips Row */}
        <div className="event-card-title-row">
          <h2 className="event-card-title">{event.name}</h2>

          {/* Chips */}
          <div className="event-card-chips-container">
            {/* Category Chip */}
            <span className="event-card-category-chip">{category}</span>

            {/* Payment Type Chip */}
            <span
              className={isPaid ? "event-card-payment-chip-paid" : "event-card-payment-chip-free"}
            >
              {isPaid ? `Costo $${Math.round(event.cost ?? 0)}` : "Gratuito"}
            </span>
          </div>
        </div>

        {/* Subtitle */}
        <p className="event-card-subtitle">{subtitle}</p>

        {/* Social Network Icons */}
        {event.socialNetworks && event.socialNetworks.length > 0 && (
          <SocialNetworkIcons networks={event.socialNetworks} />
        )}

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
            {event.description}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
