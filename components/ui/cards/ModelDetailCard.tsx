import Image from 'next/image';
import SocialNetworkIcons from '@/shared/components/ui/social-networks/SocialNetworkIcons';
import type { ModelEntity } from '@/domain/entities/models/model-entity';
import type { SocialNetworkItem } from '@/domain/entities/event-dashboard/entity';
import './ModelDetailCard.css';

interface ModelDetailCardProps {
  model: ModelEntity;
}

export default function ModelDetailCard({ model }: ModelDetailCardProps) {
  return (
    <div className="detail-card">
      <div className="detail-image-container">
        {model.image?.url ? (
          <div className="detail-image-wrapper">
            <Image
              src={model.image.url}
              alt={model.name}
              fill
              className="detail-image"
              sizes="140px"
            />
          </div>
        ) : (
          <div className="detail-image-placeholder">No Image</div>
        )}
      </div>

      <div className="info-item">
        <label>Model Name</label>
        <span>{model.name}</span>
      </div>

      {model.description && (
        <div className="info-item about-me">
          <label>Description</label>
          <p>{model.description}</p>
        </div>
      )}

      {model.references && model.references.length > 0 && (
        <div className="info-item">
          <label>References</label>
          <SocialNetworkIcons networks={model.references as SocialNetworkItem[]} />
        </div>
      )}
    </div>
  );
}
