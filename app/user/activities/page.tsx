'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthWithStorage } from '@/features/auth/context/auth-provider';
import { getUserActivities } from '@/features/event-dashboard/service/event-dashboard-service';
import { useUnifiedDialog } from '@/features/dialogs/context/unified-dialog-provider';
import { ActivityEntity } from '@/domain/entities/event-dashboard/entity';
import PageHeader from '@/components/ui/PageHeader';
import UserActivityCard from '@/components/ui/cards/UserActivityCard';
import './activities.css';

export default function UserActivitiesListPage() {
  const router = useRouter();
  const { user } = useAuthWithStorage();
  const { showLoading, hideLoading, showError } = useUnifiedDialog();
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

      if (!user || !user.id) {
        setIsReady(true);
        return;
      }

      const token = localStorage.getItem('auth_token') || undefined;

      showLoading('Cargando actividades...');
      try {
        const result = await getUserActivities(user.id, 1, pageSize, token);
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
  }, [hideLoading, showError, showLoading, pageSize, user]);

  const fetchNextPage = useCallback(async () => {
    if (!user?.id) return;

    const token = localStorage.getItem('auth_token') || undefined;

    showLoading('Cargando actividades...');
    try {
      const result = await getUserActivities(user.id, page + 1, pageSize, token);
      setActivities((prev) => [...prev, ...result.data]);
      setPageCount(result.meta.pagination.pageCount);
      setHasMore(page + 1 < result.meta.pagination.pageCount);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error('Error fetching activities:', error);
      showError('Error al cargar actividades', 'Error');
    } finally {
      hideLoading();
    }
  }, [user, page, pageSize, showLoading, hideLoading, showError]);

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

  if (!isReady) {
    return null;
  }

  return (
    <main className="user-activities__container">
      <PageHeader title="Mis Actividades" onBack={() => router.push("/")} position="static" />

      <div className="max-w-4xl mx-auto w-full">
        <div className="user-activities-list__container" onScroll={handleScroll}>
          {activities.map((activity, index) => (
            <UserActivityCard key={`${activity.id}-${index}`} activity={activity} />
          ))}

          {activities.length === 0 && (
            <div className="user-activities__empty">
              <p>No hay actividades registradas</p>
              <button onClick={() => router.push('/activities')} className="user-activities__browse-btn">
                Explorar actividades
              </button>
            </div>
          )}
        </div>

        <div className="user-activities-page__count">
          Página {page} de {pageCount || 1}
        </div>
      </div>
    </main>
  );
}
