'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthWithStorage } from '@/features/auth/context/auth-provider';
import { useUnifiedDialog } from '@/features/dialogs/context/unified-dialog-provider';
import { getCompetitions, getCompetitionModels, deleteCompetitionModel } from '@/features/competition/service/competition-service';
import { getActivityByDocumentId, checkActivityRegistration, deleteActivityParticipant } from '@/features/event-dashboard/service/event-dashboard-service';
import type { CompetitionEntity, CompetitionModelEntryEntity } from '@/domain/entities/competition/entity';
import AddCompetitionModelDialog from '@/components/ui/dialogs/AddCompetitionModelDialog';
import '../../../../user/models/models.css';
import './competition.css';

export default function CompetitionPage() {
  const params = useParams<{ documentId: string }>();
  const router = useRouter();
  const { user } = useAuthWithStorage();
  const { showLoading, hideLoading, showError, showConfirmation, showSuccess } = useUnifiedDialog();
  const [competition, setCompetition] = useState<CompetitionEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [models, setModels] = useState<CompetitionModelEntryEntity[]>([]);
  const [modelsPage, setModelsPage] = useState(1);
  const [modelsPageCount, setModelsPageCount] = useState(0);
  const [hasMoreModels, setHasMoreModels] = useState(true);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [modelRefreshKey, setModelRefreshKey] = useState(0);
  const [participantDocId, setParticipantDocId] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const participantCheckedRef = useRef(false);

  const registeredModelIds = models.map((entry) => entry.model.documentId);

  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') || undefined : undefined;

  useEffect(() => {
    async function load() {
      showLoading('Cargando competencia...');
      try {
        const result = await getCompetitions(token);
        setCompetition(result[0] ?? null);
      } catch {
        showError('Error al cargar la competencia', 'Error');
      } finally {
        hideLoading();
        setIsLoading(false);
      }
    }
    load();
  }, [showLoading, hideLoading, showError]);

  useEffect(() => {
    if (!params.documentId || participantCheckedRef.current) return;
    participantCheckedRef.current = true;

    async function check() {
      try {
        const activity = await getActivityByDocumentId(params.documentId);
        const result = await checkActivityRegistration(activity.id, user?.id ?? 0, token);
        setIsRegistered(result.registered);
        setParticipantDocId(result.participantDocumentId);
      } catch {
        // ignore
      }
    }
    check();
  }, [params.documentId, user, token]);

  const fetchModels = useCallback(async (currentPage: number, competitionId: number) => {
    if (!user?.id) return;

    showLoading('Cargando modelos...');
    try {
      const result = await getCompetitionModels(competitionId, user.id, token);
      setModels(result);
      setModelsPageCount(1);
      setHasMoreModels(false);
    } catch {
      showError('Error al cargar modelos', 'Error');
    } finally {
      hideLoading();
      setModelsLoaded(true);
    }
  }, [user, showLoading, hideLoading, showError]);

  useEffect(() => {
    if (competition?.id && user?.id) {
      fetchModels(1, competition.id);
    }
  }, [competition, user, fetchModels, modelRefreshKey]);

  const handleCancelParticipation = () => {
    if (!participantDocId) return;

    showConfirmation(
      'Cancelar participación',
      '¿Estás seguro de que deseas cancelar tu participación en esta competencia?',
      async () => {
        showLoading('Cancelando...');
        try {
          await deleteActivityParticipant(participantDocId, token);
          router.push(`/activities/${params.documentId}`);
        } catch {
          showError('Error al cancelar la participación', 'Error');
          hideLoading();
        }
      },
    );
  };

  const handleModelsScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const threshold = 50;
    const isBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + threshold;

    if (isBottom && hasMoreModels && modelsPage < modelsPageCount) {
      fetchModels(modelsPage + 1, competition!.id);
      setModelsPage(prev => prev + 1);
    }
  }, [hasMoreModels, modelsPage, modelsPageCount, competition, fetchModels]);

  const handleDeleteModel = (entryDocumentId: string) => {
    showConfirmation(
      'Eliminar modelo',
      '¿Estás seguro de que deseas eliminar este modelo de la competencia?',
      async () => {
        showLoading('Eliminando modelo...');
        try {
          await deleteCompetitionModel(entryDocumentId, token);
          showSuccess('Modelo eliminado correctamente');
          setModelRefreshKey((prev) => prev + 1);
        } catch {
          showError('Error al eliminar modelo', 'Error');
        } finally {
          hideLoading();
        }
      },
    );
  };

  if (isLoading) return null;

  if (!competition) {
    return (
      <main className="competition__container">
        <button onClick={() => router.back()} className="competition__back-btn">Volver</button>
        <h1 className="competition__title">Competencia</h1>
        <p className="competition__empty">No hay competencias disponibles</p>
      </main>
    );
  }

  return (
    <main className="competition__container">
      <button onClick={() => router.back()} className="competition__back-btn">Volver</button>
      <h1 className="competition__title">Competencia</h1>

      <div className="competition__card">
        <div className="competition__info">
          <h2 className="competition__type">{competition.type === 'criteriaByCategory' ? 'Criterios por Categoría' : competition.type}</h2>
          <p className="competition__limit">
            En esta competencia puedes registrar hasta <strong>{competition.modelsLimit}</strong> modelos.
          </p>
          <p className="competition__discover">Agrega tus modelos y descubre nuestras categorías.</p>
        </div>
      </div>

      {isRegistered && (
        <div className="competition__cancel-section">
          <button onClick={handleCancelParticipation} className="competition__cancel-participation-btn">
            Cancelar participación
          </button>
        </div>
      )}

      {modelsLoaded && (
        <div className="competition__models-section">
          <h3 className="competition__models-title">Modelos Registrados</h3>
          <div className="max-w-4xl mx-auto w-full">
            <div
              className="competition-list__container"
              onScroll={handleModelsScroll}
            >
              {models.map((entry) => {
                const model = entry.model;

                return (
                  <div
                    key={`${entry.id}`}
                    className="model-card"
                    style={{ cursor: 'default' }}
                  >
                    <div className="model-card-content">
                      <h2 className="model-card-title">{model.name}</h2>
                      <p className="model-card-subtitle">{model.description}</p>
                      <button
                        onClick={() => handleDeleteModel(entry.documentId)}
                        className="competition__remove-btn"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="model-card-image-container">
                      {model.image?.url ? (
                        <>
                          <Image
                            src={model.image.url}
                            alt={model.name}
                            fill
                            className="object-cover"
                          />
                          <div className="model-card-gradient-overlay" />
                        </>
                      ) : (
                        <Image
                          src="/globe.svg"
                          alt="Placeholder"
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
              {models.length < competition.modelsLimit && (
                <div className="model-card model-card--add" onClick={() => setIsDialogOpen(true)} style={{ cursor: 'pointer' }}>
                  <div className="model-card-content">
                    <h2 className="model-card-title">+ Agregar Modelo</h2>
                    <p className="model-card-subtitle">Registrar un modelo a esta competencia</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <AddCompetitionModelDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setModelRefreshKey((prev) => prev + 1);
        }}
        competition={competition}
        userId={user?.id ?? 0}
        registeredModelIds={registeredModelIds}
        token={token}
      />
    </main>
  );
}
