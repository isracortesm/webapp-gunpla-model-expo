'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { QRCode } from 'react-qrcode-logo';
import { useAuthWithStorage } from '@/features/auth/context/auth-provider';
import { useUnifiedDialog } from '@/features/dialogs/context/unified-dialog-provider';
import { getParticipantDetail } from '@/features/event-dashboard/service/event-dashboard-service';
import type { ActivityParticipantEntity } from '@/domain/entities/event-dashboard/entity';
import PageHeader from '@/components/ui/PageHeader';
import './access.css';

export default function AccessPage() {
  const params = useParams<{ documentId: string }>();
  const router = useRouter();
  const { user } = useAuthWithStorage();
  const { showLoading, hideLoading, showError } = useUnifiedDialog();
  const [participant, setParticipant] = useState<ActivityParticipantEntity | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const userId = user.id;
    const token = localStorage.getItem('auth_token') || undefined;

    async function load() {
      showLoading('Cargando información de acceso...');
      try {
        const result = await getParticipantDetail(params.documentId, userId, token);
        setParticipant(result.data[0] ?? null);
      } catch {
        showError('No se pudo cargar la información de acceso', 'Error');
      } finally {
        hideLoading();
        setIsReady(true);
      }
    }

    load();
  }, [params.documentId, user, showLoading, hideLoading, showError]);

  if (!isReady) return null;

  if (!participant) {
    return (
      <main className="access__container">
        <PageHeader title="Acceso" onBack={() => router.push('/user/activities')} />
        <div className="access__card">
          <p className="access__empty">No se encontró tu registro en esta actividad</p>
        </div>
      </main>
    );
  }

  return (
    <main className="access__container">
      <PageHeader title="Acceso" onBack={() => router.push('/user/activities')} />

      <div className="access__card">
        <h2 className="access__title">{participant.activity?.name}</h2>
        <p className="access__subtitle">{participant.activity?.shortDescription}</p>

        <div className="access__qr">
          <QRCode value={params.documentId} qrStyle="dots" eyeRadius={10} size={200} />
        </div>

        <div className="access__chips">
          <span className={`access__chip access__chip--${participant.statusName}`}>
            {participant.statusName === 'paid' ? 'Pagado' : 'Registrado'}
          </span>
          <span className={`access__chip access__chip--${participant.checkIn ? 'check-in' : 'no-check-in'}`}>
            {participant.checkIn ? '✓ Check-in realizado' : '✗ Sin check-in'}
          </span>
        </div>
      </div>
    </main>
  );
}
