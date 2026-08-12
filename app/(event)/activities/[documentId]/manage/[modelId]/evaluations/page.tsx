'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/features/auth/context/auth-context';
import { useUnifiedDialog } from '@/features/dialogs/context/unified-dialog-provider';
import {
  getCompetitionByActivity,
  getCompetitionModelsByActivity,
  getCompetitionResult,
  createCompetitionResult,
  getCompetitionEvaluationsByResultAndReviewer,
} from '@/features/competition/service/competition-service';
import { getActivityByDocumentId, getActivityParticipants, updateActivityCollaboratorMetadata } from '@/features/event-dashboard/service/event-dashboard-service';
import { getModelByDocumentId } from '@/features/models/service/models-service';
import SocialNetworkIcons from '@/shared/components/ui/social-networks/SocialNetworkIcons';
import PageHeader from '@/components/ui/PageHeader';
import EvaluationFormDialog from '@/components/ui/dialogs/EvaluationFormDialog';
import type {
  CompetitionCategoryEntity,
  CompetitionEvaluationEntity,
  CompetitionModelEntryEntity,
  CompetitionResultEntity,
} from '@/domain/entities/competition/entity';
import type { ModelEntity } from '@/domain/entities/models/model-entity';
import type { SocialNetworkItem } from '@/domain/entities/event-dashboard/entity';
import type { CollaboratorEvaluationMetadata, PopulatedUser } from '@/domain/entities/event-dashboard/entity';
import './evaluations.css';

export default function ActivityModelEvaluationsPage() {
  const params = useParams<{ documentId: string; modelId: string }>();
  const router = useRouter();
  const { user, isAuthReady } = useAuth();
  const { showLoading, hideLoading, showError } = useUnifiedDialog();

  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') || '' : '';

  const [isReady, setIsReady] = useState(false);
  const [model, setModel] = useState<ModelEntity | null>(null);
  const [result, setResult] = useState<CompetitionResultEntity | null>(null);
  const [evaluations, setEvaluations] = useState<CompetitionEvaluationEntity[]>([]);
  const [category, setCategory] = useState<CompetitionCategoryEntity | null>(null);
  const [entry, setEntry] = useState<CompetitionModelEntryEntity | null>(null);
  const [reviewerDocumentId, setReviewerDocumentId] = useState<string | null>(null);
  const [collaboratorMetadata, setCollaboratorMetadata] = useState<CollaboratorEvaluationMetadata | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogOpenCount, setDialogOpenCount] = useState(0);
  const loaded = useRef(false);

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
      showLoading('Cargando evaluaciones...');
      try {
        const activity = await getActivityByDocumentId(params.documentId);

        const collaborator = activity.collaborators?.find(
          (c) => (c.user as { documentId?: string })?.documentId === user?.documentId,
        );

        if (!collaborator || !collaborator.documentId) {
          showError('No tienes permisos para evaluar esta actividad', 'Acceso denegado');
          router.push(`/activities/${params.documentId}`);
          return;
        }

        const models = await getCompetitionModelsByActivity(params.documentId, t);
        const modelEntry = models.find((item) => item.model.documentId === params.modelId);

        if (!modelEntry) {
          showError('El modelo no pertenece a esta competencia', 'Error');
          router.push(`/activities/${params.documentId}/manage`);
          return;
        }
        setEntry(modelEntry);

        const participantsResult = await getActivityParticipants(params.documentId, t);
        const paidUserIds = new Set(
          participantsResult.data
            .filter((p) => p.statusName === 'paid')
            .map((p) => (p.user as PopulatedUser | undefined)?.id)
            .filter((id): id is number => id != null),
        );

        const ownerParticipant = participantsResult.data.find(
          (p) => (p.user as PopulatedUser | undefined)?.id === modelEntry.user?.id,
        );

        if (!ownerParticipant || ownerParticipant.statusName !== 'paid') {
          showError(
            'El modelo no está disponible para evaluación (participación no pagada)',
            'Acceso denegado',
          );
          router.push(`/activities/${params.documentId}/manage`);
          return;
        }

        let modelData: ModelEntity = modelEntry.model;
        try {
          modelData = await getModelByDocumentId(params.modelId);
        } catch {
          // references are optional; the competition entry already provides name/description/image
        }
        setModel(modelData);

        const competition = await getCompetitionByActivity(params.documentId, t);

        const modelCategory = modelEntry.category ?? competition.categories[0] ?? null;
        setCategory(modelCategory);
        setReviewerDocumentId(collaborator.documentId);

        const eligibleModelsCount = models.filter((m) => paidUserIds.has(m.user?.id ?? -1)).length;
        const baseMetadata: CollaboratorEvaluationMetadata = collaborator.metadata ?? {
          summary: { totalAssigned: eligibleModelsCount, totalCompleted: 0 },
          items: [],
        };
        setCollaboratorMetadata(baseMetadata);

        let resultData = await getCompetitionResult(
          competition.documentId,
          modelEntry.documentId,
          t,
        );
        if (!resultData) {
          resultData = await createCompetitionResult(
            {
              competition: competition.documentId,
              model: modelEntry.documentId,
              order: 0,
              totalPoints: 0,
            },
            t,
          );
        }
        setResult(resultData);

        const evaluationsData = await getCompetitionEvaluationsByResultAndReviewer(
          resultData.documentId,
          collaborator.documentId,
          t,
        );
        setEvaluations(evaluationsData);
      } catch {
        showError('No se pudieron cargar las evaluaciones', 'Error');
      } finally {
        hideLoading();
        setIsReady(true);
      }
    }

    load();
  }, [params.documentId, params.modelId, router, showLoading, hideLoading, showError, user, isAuthReady]);

  const syncEvaluated = useCallback(async (evaluationsData: CompetitionEvaluationEntity[]) => {
    if (!entry || !reviewerDocumentId || !category || !collaboratorMetadata) return;
    if (evaluationsData.length === 0) return;

    const modelId = entry.model.id;
    const evaluationId = evaluationsData.reduce((max, evaluation) => Math.max(max, evaluation.id), 0);
    const status: 'COMPLETED' | 'IN_PROGRESS' =
      evaluationsData.length >= category.criterias.length ? 'COMPLETED' : 'IN_PROGRESS';

    const otherItems = (collaboratorMetadata.items ?? []).filter((item) => item.modelId !== modelId);
    const items = [...otherItems, { modelId, evaluationId, status }];

    const metadata: CollaboratorEvaluationMetadata = {
      summary: {
        totalAssigned: collaboratorMetadata.summary.totalAssigned,
        totalCompleted: items.filter((item) => item.status === 'COMPLETED').length,
      },
      items,
    };

    await updateActivityCollaboratorMetadata(reviewerDocumentId, metadata, token);
    setCollaboratorMetadata(metadata);
  }, [entry, reviewerDocumentId, category, collaboratorMetadata, token]);

  const handleDialogSaved = useCallback(async () => {
    if (!entry || !reviewerDocumentId) return;

    try {
      const competition = await getCompetitionByActivity(params.documentId, token);
      const resultData = await getCompetitionResult(competition.documentId, entry.documentId, token);
      if (!resultData) return;
      setResult(resultData);
      const evaluationsData = await getCompetitionEvaluationsByResultAndReviewer(
        resultData.documentId,
        reviewerDocumentId,
        token,
      );
      setEvaluations(evaluationsData);
      await syncEvaluated(evaluationsData);
    } catch {
      // silent; next open reloads fresh data
    }
  }, [entry, reviewerDocumentId, params.documentId, token, syncEvaluated]);

  const handleOpenDialog = () => {
    setDialogOpenCount((prev) => prev + 1);
    setIsDialogOpen(true);
  };

  if (!isReady) return null;

  const judgeAverage =
    evaluations.length > 0
      ? Math.round(
          (evaluations.reduce((sum, evaluation) => sum + evaluation.points, 0) /
            evaluations.length) *
            100,
        ) / 100
      : 0;

  return (
    <main className="evaluations__container">
      <PageHeader title="Evaluaciones" onBack={() => router.push(`/activities/${params.documentId}/manage`)} />

      {model && (
        <div className="evaluations__model-card">
          <div className="evaluations__model-image-container">
            {model.image?.url ? (
              <Image src={model.image.url} alt={model.name} fill className="object-cover" />
            ) : (
              <Image src="/globe.svg" alt="Placeholder" fill className="object-cover" />
            )}
          </div>
          <div className="evaluations__model-info">
            <h2 className="evaluations__model-name">{model.name}</h2>
            {model.description && (
              <p className="evaluations__model-description">{model.description}</p>
            )}
            {model.references && model.references.length > 0 && (
              <div className="evaluations__model-references">
                <SocialNetworkIcons networks={model.references as SocialNetworkItem[]} />
              </div>
            )}
          </div>
        </div>
      )}

      {result && (
        <div className="evaluations__result">
          <div className="evaluations__result-info">
            <span className="evaluations__result-label">Promedio total</span>
            <p className="evaluations__result-note">Promedio de todos los evaluadores</p>
          </div>
          <span className="evaluations__result-value">{result.totalPoints} pts</span>
        </div>
      )}

      <section className="evaluations__section">
        <div className="evaluations__section-header">
          <h3 className="evaluations__section-title">Mis evaluaciones</h3>
          {evaluations.length > 0 && (
            <button className="evaluations__edit-btn" onClick={handleOpenDialog}>
              Editar evaluaciones
            </button>
          )}
        </div>
        {evaluations.length > 0 ? (
          <div className="evaluations__list">
            {evaluations.map((evaluation) => (
              <div key={evaluation.documentId} className="evaluations__item">
                <div className="evaluations__item-header">
                  <p className="evaluations__item-criteria">{evaluation.name}</p>
                  <span className="evaluations__item-points">{evaluation.points} pts</span>
                </div>
                {evaluation.comments && (
                  <p className="evaluations__item-comments">{evaluation.comments}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="evaluations__empty">
            <p className="evaluations__empty-text">
              Aún no has capturado evaluaciones para este modelo.
            </p>
            <button className="evaluations__capture-btn" onClick={handleOpenDialog}>
              Capturar evaluaciones
            </button>
          </div>
        )}
        {evaluations.length > 0 && (
          <div className="evaluations__judge-average">
            <span className="evaluations__judge-average-label">Mi promedio</span>
            <span className="evaluations__judge-average-value">{judgeAverage} pts</span>
          </div>
        )}
      </section>

      {category && result && reviewerDocumentId && (
        <EvaluationFormDialog
          key={dialogOpenCount}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSaved={handleDialogSaved}
          category={category}
          result={result}
          reviewerDocumentId={reviewerDocumentId}
          evaluations={evaluations}
          token={token}
        />
      )}
    </main>
  );
}
