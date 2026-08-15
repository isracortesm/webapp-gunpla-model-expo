'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useAuth } from '@/features/auth/context/auth-context';
import { useUnifiedDialog } from '@/features/dialogs/context/unified-dialog-provider';
import { getActivityParticipants, getActivityByDocumentId, updateActivityCollaboratorMetadata } from '@/features/event-dashboard/service/event-dashboard-service';
import { getCompetitionByActivity, getCompetitionModelsByActivity, sendResultEmail, sendResultEmailsToAll } from '@/features/competition/service/competition-service';
import { storeActivityCollaboratorRole } from '@/shared/utils/activity-collaborator-storage';
import type { ActivityParticipantEntity, PopulatedUser, CollaboratorEvaluationMetadata } from '@/domain/entities/event-dashboard/entity';
import type { CompetitionEntity, CompetitionModelEntryEntity, CompetitionBatchEntity } from '@/domain/entities/competition/entity';
import PageHeader from '@/components/ui/PageHeader';
import EditParticipantDialog from '@/components/ui/dialogs/EditParticipantDialog';
import './manage.css';

function batchColorClass(batch: CompetitionBatchEntity | { id: number; documentId: string } | null | undefined) {
  const value = batch && 'batch' in batch ? batch.batch : '';
  if (value === 'gold') return 'gold';
  if (value === 'silver') return 'silver';
  if (value === 'bronze' || value === 'bronce') return 'bronze';
  return 'default';
}

export default function ActivityManagePage() {
  const params = useParams<{ documentId: string }>();
  const router = useRouter();
  const { user, isAuthReady } = useAuth();
  const { showLoading, hideLoading, showError, showConfirmation, showSuccess } = useUnifiedDialog();
  const [participants, setParticipants] = useState<ActivityParticipantEntity[]>([]);
  const [isReady, setIsReady] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') || '' : '';
  const [selectedParticipant, setSelectedParticipant] = useState<ActivityParticipantEntity | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isModelSearchOpen, setIsModelSearchOpen] = useState(false);
  const [modelSearchInput, setModelSearchInput] = useState('');
  const [emailDialogParticipant, setEmailDialogParticipant] = useState<ActivityParticipantEntity | null>(null);
  const [emailCcInput, setEmailCcInput] = useState('');
  const [isCompetitionActivity, setIsCompetitionActivity] = useState(false);
  const [competition, setCompetition] = useState<CompetitionEntity | null>(null);
  const [competitionModels, setCompetitionModels] = useState<CompetitionModelEntryEntity[]>([]);
  const [collaboratorMetadata, setCollaboratorMetadata] = useState<CollaboratorEvaluationMetadata | null>(null);
  const [collaboratorDocumentId, setCollaboratorDocumentId] = useState<string | null>(null);
  const [expandedParticipantId, setExpandedParticipantId] = useState<number | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const loaded = useRef(false);

  const syncEvaluationMetadata = useCallback(async (
    models: CompetitionModelEntryEntity[],
    participants: ActivityParticipantEntity[],
    currentMetadata: CollaboratorEvaluationMetadata | null,
    collaboratorDocId: string | null | undefined,
    authToken: string,
  ) => {
    if (!collaboratorDocId) return;

    const paidUserIds = new Set(
      participants
        .filter((p) => p.statusName === 'paid')
        .map((p) => (p.user as PopulatedUser | undefined)?.id)
        .filter((id): id is number => id != null),
    );
    const eligibleModels = models.filter((m) => paidUserIds.has(m.user?.id ?? -1));

    if (!currentMetadata) {
      const defaultMetadata: CollaboratorEvaluationMetadata = {
        summary: { totalAssigned: eligibleModels.length, totalCompleted: 0 },
        items: [],
      };
      setCollaboratorMetadata(defaultMetadata);
      try {
        await updateActivityCollaboratorMetadata(collaboratorDocId, defaultMetadata, authToken);
      } catch {
        // metadata persistence is best-effort; progress still renders locally
      }
      return;
    }

    const currentModelIds = new Set(eligibleModels.map((entry) => entry.model.id));
    const originalItems = currentMetadata.items ?? [];
    const syncedItems = [...originalItems];
    const totalAssigned = eligibleModels.length;
    const totalCompleted = originalItems.filter(
      (item) => item.status === 'COMPLETED' && currentModelIds.has(item.modelId),
    ).length;
    const summary = currentMetadata.summary ?? { totalAssigned: 0, totalCompleted: 0 };

    const syncedMetadata: CollaboratorEvaluationMetadata = {
      ...currentMetadata,
      summary: { totalAssigned, totalCompleted },
      items: syncedItems,
    };

    setCollaboratorMetadata(syncedMetadata);

    const changed =
      summary.totalAssigned !== totalAssigned ||
      summary.totalCompleted !== totalCompleted ||
      JSON.stringify(originalItems) !== JSON.stringify(syncedItems);

    if (changed) {
      try {
        await updateActivityCollaboratorMetadata(collaboratorDocId, syncedMetadata, authToken);
      } catch {
        // best-effort; retried on next open
      }
    }
  }, []);

  useEffect(() => {
    if (!isAuthReady) return;
    if (loaded.current) return;
    loaded.current = true;

    const rawToken = localStorage.getItem('auth_token');
    if (!rawToken) {
      router.push('/auth/login');
      return;
    }
    const t: string = rawToken;

    async function load() {
      showLoading('Cargando actividad...');
      try {
        const activity = await getActivityByDocumentId(params.documentId);

        const collaborator = activity.collaborators?.find(
          (c) => (c.user as { documentId?: string })?.documentId === user?.documentId,
        );

        if (!collaborator) {
          showError('No tienes permisos para gestionar esta actividad', 'Acceso denegado');
          router.push(`/activities/${params.documentId}`);
          return;
        }

        setCollaboratorDocumentId(collaborator.documentId ?? null);

        if (user) {
          storeActivityCollaboratorRole(activity.documentId, collaborator.role);
        }

        let models: CompetitionModelEntryEntity[] = [];
        if (activity.category?.type === 'competition') {
          setIsCompetitionActivity(true);
          try {
            const competitionData = await getCompetitionByActivity(params.documentId, t);
            setCompetition(competitionData);
          } catch {
            // competition is supplementary; the participants view remains available
          }
          try {
            models = await getCompetitionModelsByActivity(params.documentId, t);
            setCompetitionModels(models);
          } catch {
            // models are supplementary; the participants view remains available
          }
        }

        const participantsResult = await getActivityParticipants(params.documentId, t);
        setParticipants(participantsResult.data);

        if (activity.category?.type === 'competition' && collaborator) {
          await syncEvaluationMetadata(
            models,
            participantsResult.data,
            collaborator.metadata ?? null,
            collaborator.documentId,
            t,
          );
        }
      } catch {
        showError('No se pudieron cargar los participantes', 'Error');
      } finally {
        hideLoading();
        setIsReady(true);
      }
    }

    load();
  }, [params.documentId, router, showLoading, hideLoading, showError, user, isAuthReady, syncEvaluationMetadata]);

  const refreshParticipants = useCallback(async () => {
    try {
      const result = await getActivityParticipants(params.documentId, token);
      setParticipants(result.data);
      if (isCompetitionActivity && collaboratorDocumentId) {
        await syncEvaluationMetadata(competitionModels, result.data, collaboratorMetadata, collaboratorDocumentId, token);
      }
    } catch {
      // silently fail, dialog already shows success
    }
  }, [params.documentId, token, isCompetitionActivity, collaboratorDocumentId, collaboratorMetadata, competitionModels, syncEvaluationMetadata]);

  const modelsByParticipantId = useMemo(() => {
    const map: Record<number, CompetitionModelEntryEntity[]> = {};
    for (const entry of competitionModels) {
      const userId = entry.user?.id;
      if (userId == null) continue;
      (map[userId] ??= []).push(entry);
    }
    return map;
  }, [competitionModels]);

  const statusByModelId = useMemo(() => {
    const map = new Map<number, 'IN_PROGRESS' | 'COMPLETED'>();
    for (const item of collaboratorMetadata?.items ?? []) {
      const existing = map.get(item.modelId);
      if (!existing || (existing === 'IN_PROGRESS' && item.status === 'COMPLETED')) {
        map.set(item.modelId, item.status);
      }
    }
    return map;
  }, [collaboratorMetadata]);

  const eligibleModels = useMemo(() => {
    const paidUserIds = new Set(
      participants
        .filter((p) => p.statusName === 'paid')
        .map((p) => (p.user as PopulatedUser | undefined)?.id)
        .filter((id): id is number => id != null),
    );
    return competitionModels.filter((m) => paidUserIds.has(m.user?.id ?? -1));
  }, [participants, competitionModels]);

  const progressPercent =
    collaboratorMetadata && collaboratorMetadata.summary.totalAssigned > 0
      ? Math.min(
          100,
          Math.round(
            (collaboratorMetadata.summary.totalCompleted / collaboratorMetadata.summary.totalAssigned) * 100,
          ),
        )
      : 0;

  const handleQrScan = useCallback((decodedText: string) => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(() => {});
      scannerRef.current = null;
    }
    setIsScanning(false);

    const match = participants.find((p) => p.documentId === decodedText);
    if (match) {
      setSelectedParticipant(match);
      setIsDialogOpen(true);
    } else {
      showError('Participante no encontrado', 'Error');
    }
  }, [participants, showError]);

  const handleModelSearch = useCallback(() => {
    const num = Number(modelSearchInput.trim());
    if (!modelSearchInput.trim() || Number.isNaN(num)) {
      showError('Ingresa un número de modelo válido', 'Error');
      return;
    }
    const match = eligibleModels.find((entry) => entry.model.id === num);
    if (match) {
      setModelSearchInput('');
      setIsModelSearchOpen(false);
      router.push(
        `/activities/${params.documentId}/manage/${match.model.documentId}/evaluations`,
      );
    } else {
      showError('Modelo no encontrado', 'Error');
    }
  }, [modelSearchInput, eligibleModels, router, params.documentId, showError]);

  const handleSendResultsToAll = useCallback(() => {
    if (!competition) return;
    showConfirmation(
      'Enviar resultados',
      '¿Enviar los resultados por correo a todos los participantes?',
      async () => {
        showLoading('Enviando correos...');
        try {
          const result = await sendResultEmailsToAll({ competition: competition.documentId }, token);
          const message =
            result.failed > 0
              ? `Resultados enviados: ${result.sent} de ${result.total} (fallidos: ${result.failed})`
              : `Resultados enviados a ${result.sent} participantes`;
          showSuccess(message, 'Envío completado');
        } catch {
          showError('No se pudieron enviar los correos', 'Error');
        } finally {
          hideLoading();
        }
      },
    );
  }, [competition, token, showConfirmation, showLoading, hideLoading, showSuccess, showError]);

  const handleOpenEmailSend = useCallback((participant: ActivityParticipantEntity) => {
    setEmailCcInput('');
    setEmailDialogParticipant(participant);
  }, []);

  const handleSendResultSubmit = useCallback(async () => {
    const participant = emailDialogParticipant;
    if (!participant || !competition) return;

    const populatedUser = participant?.user as PopulatedUser | undefined;
    const participantDocumentId = populatedUser?.documentId as string | undefined;
    if (!participantDocumentId) {
      showError('No se encontró el usuario del participante', 'Error');
      return;
    }

    const cc = emailCcInput.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (cc && !emailPattern.test(cc)) {
      showError('Ingresa un correo alternativo válido', 'Error');
      return;
    }

    setEmailDialogParticipant(null);
    setEmailCcInput('');

    showLoading('Enviando correo...');
    try {
      const result = await sendResultEmail(
        {
          participant: participantDocumentId,
          competition: competition.documentId,
          cc: cc || undefined,
        },
        token,
      );
      showSuccess(
        cc
          ? `Resultado enviado a ${result.sentTo} con copia a ${cc}`
          : `Resultado enviado a ${result.sentTo}`,
        'Envío completado',
      );
    } catch {
      showError('No se pudo enviar el correo', 'Error');
    } finally {
      hideLoading();
    }
  }, [emailDialogParticipant, emailCcInput, competition, token, showLoading, hideLoading, showSuccess, showError]);

  useEffect(() => {
    if (!isScanning) return;

    const scanner = new Html5QrcodeScanner(
      'qr-scanner',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );
    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        handleQrScan(decodedText);
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [isScanning, handleQrScan]);

  if (!isReady) return null;

  return (
    <main className="manage__container">
      <PageHeader title="Gestión" onBack={() => router.push(`/activities/${params.documentId}`)} />

      {isCompetitionActivity && collaboratorMetadata && (
        <div className="manage__progress">
          <div className="manage__progress-header">
            <p className="manage__progress-label">
              {collaboratorMetadata.summary.totalCompleted} de {collaboratorMetadata.summary.totalAssigned} evaluaciones completadas
            </p>
            <p className="manage__progress-percent">{progressPercent}%</p>
          </div>
          <div className="manage__progress-track">
            <div className="manage__progress-bar" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      )}

      {isCompetitionActivity && competition?.batchLimits && competition.batchLimits.length > 0 && (
        <div className="manage__batchlimits">
          {competition.batchLimits.map((batchLimit, index) => {
            const pct =
              batchLimit.limit > 0
                ? Math.min(100, Math.round((batchLimit.assigned / batchLimit.limit) * 100))
                : 0;
            const color = batchColorClass(batchLimit.batch);
            return (
              <div key={batchLimit.id ?? index} className="manage__batchlimit">
                <div className="manage__batchlimit-header">
                  <div className="manage__batchlimit-title">
                    <span className="manage__batchlimit-name">
                      {batchLimit.batch && 'batchName' in batchLimit.batch
                        ? batchLimit.batch.batchName
                        : `Lote ${index + 1}`}
                    </span>
                  </div>
                  <span className="manage__batchlimit-count">
                    {batchLimit.assigned} / {batchLimit.limit}
                  </span>
                </div>
                <div className="manage__batchlimit-track">
                  <div
                    className={`manage__batchlimit-bar manage__batchlimit-bar--${color}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isCompetitionActivity && competition && competition.hasPublicResults && (
        <section className="manage__emails">
          <div className="manage__emails-header">
            <p className="manage__emails-title">Envío de resultados</p>
          </div>
          <div className="manage__emails-actions">
            <button className="manage__emails-btn" onClick={handleSendResultsToAll}>
              Enviar a todos
            </button>
          </div>
        </section>
      )}

      {participants.length === 0 ? (
        <p className="manage__empty">No hay participantes registrados</p>
      ) : (
        <div className={`manage__list${isCompetitionActivity ? '' : ' manage__list--no-progress'}`}>
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
                {isCompetitionActivity && (
                  <div className="manage__models" onClick={(e) => e.stopPropagation()}>
                    {p.statusName === 'paid' ? (
                      <>
                        <div className="manage__models-actions">
                          <button
                            className="manage__models-toggle"
                            onClick={() =>
                              setExpandedParticipantId((prev) => (prev === p.id ? null : p.id))
                            }
                          >
                            {expandedParticipantId === p.id ? 'Ocultar modelos' : 'Ver modelos'}
                          </button>
                          {competition?.hasPublicResults && (
                            <button
                              className="manage__models-email-btn"
                              onClick={() => handleOpenEmailSend(p)}
                            >
                              Enviar resultados
                            </button>
                          )}
                        </div>
                        {expandedParticipantId === p.id && (
                          <div className="manage__models-list">
                            {populatedUser?.id != null &&
                            modelsByParticipantId[populatedUser.id]?.length ? (
                              modelsByParticipantId[populatedUser.id].map((entry) => {
                                const status = statusByModelId.get(entry.model.id);
                                return (
                                  <div
                                    key={entry.documentId}
                                    className="manage__model-card"
                                    onClick={() =>
                                      router.push(
                                        `/activities/${params.documentId}/manage/${entry.model.documentId}/evaluations`,
                                      )
                                    }
                                  >
                                    <div className="manage__model-image-container">
                                      {entry.model.image?.url ? (
                                        <Image
                                          src={entry.model.image.url}
                                          alt={entry.model.name}
                                          fill
                                          className="object-cover"
                                        />
                                      ) : (
                                        <Image
                                          src="/globe.svg"
                                          alt="Placeholder"
                                          fill
                                          className="object-cover"
                                        />
                                      )}
                                    </div>
                                    <div className="manage__model-info">
                                      <p className="manage__model-name">#{entry.model.id} - {entry.model.name}</p>
                                      <span className="manage__model-evaluate">Evaluar →</span>
                                    </div>
                                    {status && (
                                      <span
                                        className={`manage__model-status manage__model-status--${status === 'COMPLETED' ? 'completed' : 'in-progress'}`}
                                      >
                                        {status === 'COMPLETED' ? 'Finalizado' : 'En progreso'}
                                      </span>
                                    )}
                                  </div>
                                );
                              })
                            ) : (
                              <p className="manage__models-empty">Sin modelos registrados</p>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="manage__models-empty">
                        Participación no pagada — modelos no disponibles
                      </p>
                    )}
                  </div>
                )}
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

      <div className="manage__fabs">
        {isCompetitionActivity && (
          <button className="manage__fab" onClick={() => setIsModelSearchOpen(true)}>
            <Image
              src="/search_icon.svg"
              alt="Buscar modelo"
              width={24}
              height={24}
              className="manage__fab-icon"
            />
          </button>
        )}
        <button className="manage__fab" onClick={() => setIsScanning(true)}>
          <svg className="manage__fab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <rect x="7" y="7" width="4" height="4" />
            <rect x="13" y="7" width="4" height="4" />
            <rect x="7" y="13" width="4" height="4" />
            <rect x="13" y="13" width="4" height="4" />
          </svg>
        </button>
      </div>

      {isModelSearchOpen && (
        <div className="manage__scanner-overlay" onClick={() => setIsModelSearchOpen(false)}>
          <div className="manage__scanner-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="manage__scanner-title">Buscar modelo por número</h3>
            <input
              type="number"
              className="manage__search-input"
              placeholder="N° de modelo"
              value={modelSearchInput}
              onChange={(e) => setModelSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleModelSearch();
              }}
              autoFocus
            />
            <button className="manage__search-btn" onClick={handleModelSearch}>
              Buscar
            </button>
            <button className="manage__scanner-cancel" onClick={() => setIsModelSearchOpen(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {isScanning && (
        <div className="manage__scanner-overlay" onClick={() => { setIsScanning(false); }}>
          <div className="manage__scanner-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="manage__scanner-title">Escanear código QR</h3>
            <div id="qr-scanner" />
            <button className="manage__scanner-cancel" onClick={() => setIsScanning(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {emailDialogParticipant && (
        <div className="manage__scanner-overlay" onClick={() => setEmailDialogParticipant(null)}>
          <div className="manage__scanner-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="manage__scanner-title">Enviar resultado</h3>
            <p className="manage__email-info">
              Se enviará al correo registrado del participante:{' '}
              <strong>{(emailDialogParticipant.user as PopulatedUser | undefined)?.email}</strong>
            </p>
            <input
              type="email"
              className="manage__search-input"
              placeholder="Correo alternativo para enviar una copia (opcional)"
              value={emailCcInput}
              onChange={(e) => setEmailCcInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendResultSubmit();
              }}
              autoFocus
            />
            <button className="manage__search-btn" onClick={handleSendResultSubmit}>
              Confirmar envío
            </button>
            <button className="manage__scanner-cancel" onClick={() => setEmailDialogParticipant(null)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
