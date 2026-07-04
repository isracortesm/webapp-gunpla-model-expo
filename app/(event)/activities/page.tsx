'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getEvent, getEventActivities } from '@/features/event-dashboard/service/event-dashboard-service';
import { useUnifiedDialog } from '@/features/dialogs/context/unified-dialog-provider';
import { ActivityEntity, EventEntity } from '@/domain/entities/event-dashboard/entity';
import './activities.css';

const EVENT_CODE = 'HMKGME26';

export default function ActivitiesListPage() {
  const router = useRouter();
  const { showLoading, hideLoading, showError } = useUnifiedDialog();
  const [event, setEvent] = useState<EventEntity | null>(null);
  const [activities, setActivities] = useState<ActivityEntity[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);
  const [pageCount, setPageCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    const load = async () => {
      if (hasFetchedRef.current) return;
      hasFetchedRef.current = true;

      showLoading('Cargando evento...');
      let eventData: EventEntity | null = null;
      try {
        eventData = await getEvent(EVENT_CODE);
        setEvent(eventData);
      } catch (error) {
        console.error('Error fetching event:', error);
        showError('Error al cargar el evento', 'Error');
        setIsReady(true);
        return;
      } finally {
        hideLoading();
      }

      if (!eventData?.id) {
        setIsReady(true);
        return;
      }

      showLoading('Cargando actividades...');
      try {
        const result = await getEventActivities(eventData.id, 1, pageSize);
        setActivities(result.data);
        setPageCount(result.meta.pagination.pageCount);
        setHasMore(1 < result.meta.pagination.pageCount);
      } catch (error) {
        console.error('Error fetching activities:', error);
        showError('Error al cargar actividades', 'Error');
      } finally {
        hideLoading();
        setIsReady(true);
      }
    };

    load();
  }, [hideLoading, showError, showLoading, pageSize]);

  const fetchNextPage = useCallback(async () => {
    if (!event?.id) return;

    showLoading('Fetching activities...');
    try {
      const result = await getEventActivities(event.id, page + 1, pageSize);
      setActivities((prev) => [...prev, ...result.data]);
      setPageCount(result.meta.pagination.pageCount);
      setHasMore(page + 1 < result.meta.pagination.pageCount);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error('Error fetching activities:', error);
      showError('Failed to fetch activities', 'Error');
    } finally {
      hideLoading();
    }
  }, [event, page, pageSize, showLoading, hideLoading, showError]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      const threshold = 50;
      const isBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + threshold;

      if (isBottom && hasMore && page < pageCount) {
        fetchNextPage();
      }
    },
    [hasMore, page, pageCount, fetchNextPage]
  );

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

  if (!isReady) {
    return null;
  }

  if (!event) {
    return (
      <main className="activities-page__container">
        <div className="activities-page__empty">Evento no encontrado</div>
      </main>
    );
  }

  return (
    <main className="activities-page__container">

      <div className="max-w-4xl mx-auto w-full">
        <div className="activities-list__container" onScroll={handleScroll}>
          {activities.map((activity, index) => (
            <article key={`${activity.id}-${index}`} className="activity-card" onClick={() => router.push(`/activities/${activity.documentId}`)} style={{ cursor: 'pointer' }}>
              <div className="activity-card-content">
                <h2 className="activity-card-title">{activity.name}</h2>
                <p className="activity-card-subtitle">{activity.shortDescription}</p>
                <div className="activity-card-meta">
                  <span
                    className={
                      activity.costType === 'free'
                        ? 'activity-card-cost-chip--free'
                        : 'activity-card-cost-chip--paid'
                    }
                  >
                    {activity.costType === 'free' ? 'Gratuito' : `Costo $${Math.round(activity.cost ?? 0)}`}
                  </span>
                  {activity.capacity != null && (
                    <span className="activity-card-capacity">
                    Aforo: {activity.capacity}
                    </span>
                  )}
                </div>
                <time className="activity-card-date" dateTime={activity.startDate}>
                  {formatDate(activity.startDate)}
                </time>
              </div>
              <div className="activity-card-image-container">
                {activity.image?.url ? (
                  <>
                    <Image
                      src={activity.image.url}
                      alt={activity.name}
                      fill
                      className="object-cover"
                    />
                    <div className="activity-card-gradient-overlay" />
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
            </article>
          ))}

          {activities.length === 0 && (
            <div className="activities-page__empty">No hay actividades disponibles</div>
          )}
        </div>

        <div className="activities-page__count">
          Página {page} de {pageCount || 1}
        </div>
      </div>
    </main>
  );
}
