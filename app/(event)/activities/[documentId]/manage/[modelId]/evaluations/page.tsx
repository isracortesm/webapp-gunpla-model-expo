'use client';

import { useState, useEffect, useRef } from 'react';
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
import { getActivityByDocumentId } from '@/features/event-dashboard/service/event-dashboard-service';
import { getModelByDocumentId } from '@/features/models/service/models-service';
import SocialNetworkIcons from '@/shared/components/ui/social-networks/SocialNetworkIcons';
import PageHeader from '@/components/ui/PageHeader';
import type {
  CompetitionEvaluationEntity,
  CompetitionResultEntity,
} from '@/domain/entities/competition/entity';
import type { ModelEntity } from '@/domain/entities/models/model-entity';
import type { SocialNetworkItem } from '@/domain/entities/event-dashboard/entity';
import './evaluations.css';

export default function ActivityModelEvaluationsPage() {
  const params = useParams<{ documentId: string; modelId: string }>();
  const router = useRouter();
  const { user, isAuthReady } = useAuth();
  const { showLoading, hideLoading, showError, showMessage } = useUnifiedDialog();

  const [isReady, setIsReady] = useState(false);
  const [model, setModel] = useState<ModelEntity | null>(null);
  const [result, setResult] = useState<CompetitionResultEntity | null>(null);
  const [evaluations, setEvaluations] = useState<CompetitionEvaluationEntity[]>([]);
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
    const token: string = rawToken;

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

        const models = await getCompetitionModelsByActivity(params.documentId, token);
        const entry = models.find((item) => item.model.documentId === params.modelId);

        if (!entry) {
          showError('El modelo no pertenece a esta competencia', 'Error');
          router.push(`/activities/${params.documentId}/manage`);
          return;
        }

        let modelData: ModelEntity = entry.model;
        try {
          modelData = await getModelByDocumentId(params.modelId);
        } catch {
          // references are optional; the competition entry already provides name/description/image
        }
        setModel(modelData);

        const competition = await getCompetitionByActivity(params.documentId, token);

        let resultData = await getCompetitionResult(
          competition.documentId,
          entry.documentId,
          token,
        );
        if (!resultData) {
          resultData = await createCompetitionResult(
            {
              competition: competition.documentId,
              model: entry.documentId,
              order: 0,
              totalPoints: 0,
            },
            token,
          );
        }
        setResult(resultData);

        const evaluationsData = await getCompetitionEvaluationsByResultAndReviewer(
          resultData.documentId,
          collaborator.documentId,
          token,
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

  if (!isReady) return null;

  const handleCaptureEvaluations = () => {
    showMessage('info', 'La captura de evaluaciones estará disponible próximamente.', 'Próximamente');
  };

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
            <span className="evaluations__result-label">Total de puntos</span>
            <p className="evaluations__result-note">Promedio de todos los evaluadores</p>
          </div>
          <span className="evaluations__result-value">{result.totalPoints}</span>
        </div>
      )}

      <section className="evaluations__section">
        <h3 className="evaluations__section-title">Mis evaluaciones</h3>
        {evaluations.length > 0 && (
          <div className="evaluations__judge-average">
            <div className="evaluations__judge-average-info">
              <span className="evaluations__judge-average-label">Mi promedio</span>
              <p className="evaluations__judge-average-note">Promedio de las evaluaciones del juez</p>
            </div>
            <span className="evaluations__judge-average-value">{judgeAverage}</span>
          </div>
        )}
        {evaluations.length > 0 ? (
          <div className="evaluations__list">
            {evaluations.map((evaluation) => (
              <div key={evaluation.documentId} className="evaluations__item">
                <div className="evaluations__item-header">
                  <p className="evaluations__item-criteria">{evaluation.criteria}</p>
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
            <button className="evaluations__capture-btn" onClick={handleCaptureEvaluations}>
              Capturar evaluaciones
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
