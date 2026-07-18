'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { ActivityEntity } from '@/domain/entities/event-dashboard/entity';
import './UserActivityCard.css';

interface UserActivityCardProps {
  activity: ActivityEntity;
}

export default function UserActivityCard({ activity }: UserActivityCardProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <article className="user-activity-card">
      <div className="user-activity-card__image-container">
        {activity.image?.url ? (
          <>
            <Image
              src={activity.image.url}
              alt={activity.name}
              fill
              className="object-cover"
            />
            <div className="user-activity-card__gradient-overlay" />
          </>
        ) : (
          <Image
            src="/globe.svg"
            alt="Placeholder"
            fill
            className="object-cover opacity-50"
          />
        )}
      </div>

      <div className="user-activity-card__body">
        <div className="user-activity-card__info">
          <h3 className="user-activity-card__title">
            {activity.name}
          </h3>
          <p className="user-activity-card__subtitle">{activity.shortDescription}</p>
          <time className="user-activity-card__date" dateTime={activity.startDate}>
            {formatDate(activity.startDate)}
          </time>
        </div>

        <button
          className="user-activity-card__access-btn"
          onClick={() => router.push(`/user/activities/${activity.documentId}/access`)}
          aria-label="Código de acceso"
        >
          <Image src="/qrcode_scan.svg" alt="" width={28} height={28} />
          <span className="user-activity-card__access-label">ACCESO</span>
        </button>
      </div>
    </article>
  );
}
