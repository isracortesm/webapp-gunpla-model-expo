'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/context/auth-context';
import { useUnifiedDialog } from '@/features/dialogs/context/unified-dialog-provider';
import { getActivityParticipants } from '@/features/event-dashboard/service/event-dashboard-service';
import type { ActivityParticipantEntity, PopulatedUser } from '@/domain/entities/event-dashboard/entity';
import PageHeader from '@/components/ui/PageHeader';
import EditParticipantDialog from '@/components/ui/dialogs/EditParticipantDialog';
import './manage.css';

export default function ActivityManagePage() {
  const params = useParams<{ documentId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { showLoading, hideLoading, showError } = useUnifiedDialog();
  const [participants, setParticipants] = useState<ActivityParticipantEntity[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [token, setToken] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<ActivityParticipantEntity | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const rawToken = localStorage.getItem('auth_token');
    if (!rawToken) {
      router.push('/auth/login');
      return;
    }
    const t: string = rawToken;
    setToken(t);

    async function load() {
      showLoading('Cargando participantes...');
      try {
        const result = await getActivityParticipants(params.documentId, t);
        setParticipants(result.data);
      } catch {
        showError('No se pudieron cargar los participantes', 'Error');
      } finally {
        hideLoading();
        setIsReady(true);
      }
    }

    load();
  }, [params.documentId, router, showLoading, hideLoading, showError]);

  const refreshParticipants = useCallback(async () => {
    try {
      const result = await getActivityParticipants(params.documentId, token);
      setParticipants(result.data);
    } catch {
      // silently fail, dialog already shows success
    }
  }, [params.documentId, token]);

  if (!isReady) return null;

  return (
    <main className="manage__container">
      <PageHeader title="Gestión" onBack={() => router.push(`/activities/${params.documentId}`)} />

      {participants.length === 0 ? (
        <p className="manage__empty">No hay participantes registrados</p>
      ) : (
        <div className="manage__list">
          {participants.map((p) => {
            const populatedUser = p.user as PopulatedUser | undefined;
            return (
              <div
                key={p.id}
                className="manage__card"
                onClick={() => {
                  setSelectedParticipant(p);
                  setIsDialogOpen(true);
                }}
              >
                <div className="manage__card-header">
                  <p className="manage__username">{populatedUser?.username ?? '—'}</p>
                  <p className="manage__email">{populatedUser?.email ?? '—'}</p>
                </div>
                <div className="manage__chips">
                  <span className={`manage__chip manage__chip--${p.statusName}`}>
                    {p.statusName === 'paid' ? 'Pagado' : 'Registrado'}
                  </span>
                  <span className={`manage__chip manage__chip--${p.checkIn ? 'check-in' : 'no-check-in'}`}>
                    {p.checkIn ? '✓ Check-in realizado' : '✗ Check-in pendiente'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <EditParticipantDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedParticipant(null);
        }}
        onUpdated={refreshParticipants}
        participant={selectedParticipant}
        token={token}
      />
    </main>
  );
}
