'use client';

import { useState, useEffect } from 'react';
import MainEventCard from "@/components/ui/cards/MainEventCard";
import { EventEntity } from "@/domain/entities/event-dashboard/entity";
import { getEvent } from "@/features/event-dashboard/service/event-dashboard-service";
import { useLoadingDialog } from '@/features/loading-dialog/context/loading-dialog-provider';
import { useErrorDialog } from '@/features/error-dialog/context/error-dialog-provider';

export default function Home() {
  const [event, setEvent] = useState<EventEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showLoading, hideLoading } = useLoadingDialog();
  const { showError } = useErrorDialog();

  useEffect(() => {
    async function fetchEvent() {
      try {
        showLoading('Loading event...');
        const eventCode = "HMKGME26";
        const data = await getEvent(eventCode);
        setEvent(data);
      } catch (err: unknown) {
        if (err instanceof Error && 'status' in err) {
          showError(err.message);
        } else if (err instanceof Error) {
          showError(err.message);
        } else {
          showError('An unexpected error occurred.');
        }
      } finally {
        hideLoading();
        setIsLoading(false);
      }
    }

    fetchEvent();
  }, []);

  if (isLoading) {
    return <div className="main-content">Loading...</div>;
  }

  if (!event) {
    return <div className="main-content">Event not found</div>;
  }

  return (
    <div className="main-content">
      <MainEventCard
        event={event}/>
    </div>
  );
}
