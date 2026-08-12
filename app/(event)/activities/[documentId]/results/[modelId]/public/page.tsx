'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/features/auth/context/auth-context';
import { useUnifiedDialog } from '@/features/dialogs/context/unified-dialog-provider';
import {
  getCompetitionByActivity,
  getCompetitionResultByModel,
  getCompetitionEvaluationsByResult,
} from '@/features/competition/service/competition-service';
import { getModelByDocumentId } from '@/features/models/service/models-service';
import SocialNetworkIcons from '@/shared/components/ui/social-networks/SocialNetworkIcons';
import PageHeader from '@/components/ui/PageHeader';
import type {
  CompetitionEntity,
  CompetitionEvaluationEntity,
  CompetitionModelEntryEntity,
  CompetitionResultEntity,
} from '@/domain/entities/competition/entity';
import type { ModelEntity } from '@/domain/entities/models/model-entity';
import type { SocialNetworkItem } from '@/domain/entities/event-dashboard/entity';
import './public.css';

function isPopulatedResultModel(
  model: CompetitionResultEntity['model'],
): model is CompetitionModelEntryEntity {
  return !!model && 'model' in model;
}

export default function ActivityModelPublicResultPage() {
  const params = useParams<{ documentId: string; modelId: string }>();
  const router = useRouter();
  const { user, isAuthReady } = useAuth();
  const { showLoading, hideLoading, showError } = useUnifiedDialog();

  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') || '' : '';

  const [isReady, setIsReady] = useState(false);
  const [competition, setCompetition] = useState<CompetitionEntity | null>(null);
  const [result, setResult] = useState<CompetitionResultEntity | null>(null);
  const [model, setModel] = useState<ModelEntity | null>(null);
  const [evaluations, setEvaluations] = useState<CompetitionEvaluationEntity[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    if (!isAuthReady) return;
    if (loaded.current) return;
    loaded.current = true;

    async function load() {
      showLoading('Cargando resultado...');
      try {
        const competitionData = await getCompetitionByActivity(params.documentId);
        setCompetition(competitionData);

        const resultData = await getCompetitionResultByModel(
          competitionData.documentId,
          params.modelId,
        );
        if (!resultData) {
          showError('No hay resultado para este modelo', 'Error');
          router.push(`/activities/${params.documentId}/results`);
          return;
        }
        setResult(resultData);

        const ownerUser = isPopulatedResultModel(resultData.model) ? resultData.model.user : undefined;
        const isOwnerUser = ownerUser != null && user != null && ownerUser.id === user.id;
        setIsOwner(isOwnerUser);

        let modelData: ModelEntity | null = null;
        if (isPopulatedResultModel(resultData.model)) {
          modelData = resultData.model.model;
        }
        try {
          modelData = await getModelByDocumentId(params.modelId);
        } catch {
          // references are optional; the competition result already provides name/description/image
        }
        setModel(modelData);

        if (isOwnerUser) {
          const evaluationsData = await getCompetitionEvaluationsByResult(
            resultData.documentId,
            token,
          );
          setEvaluations(evaluationsData);
        }
      } catch {
        showError('No se pudieron cargar los datos', 'Error');
      } finally {
        hideLoading();
        setIsReady(true);
      }
    }

    load();
  }, [params.documentId, params.modelId, router, showLoading, hideLoading, showError, user, isAuthReady, token]);

  const groupedEvaluations = useMemo(() => {
    const groups = new Map<
      string,
      { reviewer?: { id?: number; username?: string }; items: CompetitionEvaluationEntity[] }
    >();
    for (const evaluation of evaluations) {
      const reviewer = evaluation.reviewer;
      const key = reviewer?.id != null ? String(reviewer.id) : `anon-${evaluation.id}`;
      const existing = groups.get(key);
      if (existing) {
        existing.items.push(evaluation);
      } else {
        groups.set(key, { reviewer, items: [evaluation] });
      }
    }
    return Array.from(groups.values());
  }, [evaluations]);

  if (!isReady) return null;

  if (!competition?.hasPublicResults) {
    return (
      <main className="public__container">
        <PageHeader title="Resultado" onBack={() => router.push(`/activities/${params.documentId}/results`)} />
        <p className="public__empty">Los resultados aún no han sido publicados.</p>
      </main>
    );
  }

  const batch = result?.batch && result.batch.batch !== 'none' ? result.batch : null;

  return (
    <main className="public__container">
      <PageHeader title="Resultado" onBack={() => router.push(`/activities/${params.documentId}/results`)} />

      {model && (
        <div className="public__model-card">
          <div className="public__model-image-container">
            {model.image?.url ? (
              <Image src={model.image.url} alt={model.name} fill className="object-cover" />
            ) : (
              <Image src="/globe.svg" alt="Placeholder" fill className="object-cover" />
            )}
          </div>
          <div className="public__model-info">
            <h2 className="public__model-name">{model.name}</h2>
            {model.description && (
              <p className="public__model-description">{model.description}</p>
            )}
            {model.references && model.references.length > 0 && (
              <div className="public__model-references">
                <SocialNetworkIcons networks={model.references as SocialNetworkItem[]} />
              </div>
            )}
          </div>
          {batch && (
            <div className="public__batch-side">
              {batch.batchImage?.url && (
                <div className="public__batch-image-container">
                  <Image src={batch.batchImage.url} alt={batch.batchName} fill className="object-cover" />
                </div>
              )}
              <span className="public__batch-name">{batch.batchName}</span>
            </div>
          )}
        </div>
      )}

      <section className="public__section">
        {isOwner ? (
          groupedEvaluations.length > 0 ? (
            <>
              <div className="public__section-header">
                <h3 className="public__section-title">Evaluaciones</h3>
              </div>
              <div className="public__evaluations">
                {groupedEvaluations.map((group, index) => {
                  const judgeName = `Juez ${index + 1}`;
                  return (
                    <div key={group.reviewer?.id ?? index} className="public__judge-group">
                      <p className="public__judge-name">{judgeName}</p>
                      <div className="public__judge-items">
                        {group.items.map((evaluation) => (
                          <div key={evaluation.documentId} className="public__evaluation-item">
                            <div className="public__evaluation-header">
                              <p className="public__evaluation-criteria">{evaluation.name}</p>
                              <span className="public__evaluation-points">{evaluation.points} pts</span>
                            </div>
                            {evaluation.comments && (
                              <p className="public__evaluation-comments">{evaluation.comments}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="public__locked">
              <p className="public__locked-text">Aún no hay evaluaciones para este modelo.</p>
            </div>
          )
        ) : (
          <div className="public__locked">
            <p className="public__locked-text">
              Las evaluaciones no están disponibles públicamente.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
