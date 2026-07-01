'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getEvent, getEventNews } from '@/features/event-dashboard/service/event-dashboard-service';
import { useUnifiedDialog } from '@/features/dialogs/context/unified-dialog-provider';
import { NewsEntity, EventEntity } from '@/domain/entities/event-dashboard/entity';
import './news.css';

const EVENT_CODE = 'HMKGME26';

export default function NewsListPage() {
  const router = useRouter();
  const { showLoading, hideLoading, showError } = useUnifiedDialog();
  const [event, setEvent] = useState<EventEntity | null>(null);
  const [news, setNews] = useState<NewsEntity[]>([]);
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

      showLoading('Cargando noticias...');
      try {
        const result = await getEventNews(eventData.id, 1, pageSize);
        setNews(result.data);
        setPageCount(result.meta.pagination.pageCount);
        setHasMore(1 < result.meta.pagination.pageCount);
      } catch (error) {
        console.error('Error fetching news:', error);
        showError('Error al cargar noticias', 'Error');
      } finally {
        hideLoading();
        setIsReady(true);
      }
    };

    load();
  }, [hideLoading, showError, showLoading, pageSize]);

  const fetchNextPage = useCallback(async () => {
    if (!event?.id) return;

    showLoading('Fetching news...');
    try {
      const result = await getEventNews(event.id, page + 1, pageSize);
      setNews((prev) => [...prev, ...result.data]);
      setPageCount(result.meta.pagination.pageCount);
      setHasMore(page + 1 < result.meta.pagination.pageCount);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error('Error fetching news:', error);
      showError('Failed to fetch news', 'Error');
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
      <main className="news-page__container">
        <div className="news-page__empty">Evento no encontrado</div>
      </main>
    );
  }

  return (
    <main className="news-page__container">

      <div className="max-w-4xl mx-auto w-full">
        <div className="news-list__container" onScroll={handleScroll}>
          {news.map((item, index) => (
            <article
              key={`${item.id}-${index}`}
              className="news-card"
              onClick={() => router.push(`/news/${item.documentId}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="news-card-content">
                <h2 className="news-card-title">{item.title}</h2>
                <p className="news-card-subtitle">{item.subtitle}</p>
                <time className="news-card-date" dateTime={item.publishedAt}>
                  {formatDate(item.publishedAt)}
                </time>
              </div>
              <div className="news-card-image-container">
                {item.thumbnail?.url ? (
                  <>
                    <Image
                      src={item.thumbnail.url}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                    <div className="news-card-gradient-overlay" />
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

          {news.length === 0 && (
            <div className="news-page__empty">No hay noticias disponibles</div>
          )}
        </div>

        <div className="news-page__count">
          Página {page} de {pageCount || 1}
        </div>
      </div>
    </main>
  );
}
