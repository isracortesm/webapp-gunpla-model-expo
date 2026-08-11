'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUnifiedDialog } from '@/features/dialogs/context/unified-dialog-provider';
import {
  getCompetitionByActivity,
  getCompetitionResultsByCompetition,
} from '@/features/competition/service/competition-service';
import type {
  CompetitionEntity,
  CompetitionModelEntryEntity,
  CompetitionResultEntity,
} from '@/domain/entities/competition/entity';
import PageHeader from '@/components/ui/PageHeader';
import './results.css';

function isPopulatedResultModel(
  model: CompetitionResultEntity['model'],
): model is CompetitionModelEntryEntity {
  return !!model && 'model' in model;
}

export default function ActivityResultsPage() {
  const params = useParams<{ documentId: string }>();
  const router = useRouter();
  const { showLoading, hideLoading, showError } = useUnifiedDialog();

  const [competition, setCompetition] = useState<CompetitionEntity | null>(null);
  const [results, setResults] = useState<CompetitionResultEntity[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isReady, setIsReady] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    async function load() {
      showLoading('Cargando resultados...');
      try {
        const competitionData = await getCompetitionByActivity(params.documentId);
        setCompetition(competitionData);
        const resultsData = await getCompetitionResultsByCompetition(competitionData.documentId);
        setResults(resultsData);
      } catch {
        showError('No se pudieron cargar los resultados', 'Error');
      } finally {
        hideLoading();
        setIsReady(true);
      }
    }

    load();
  }, [params.documentId, showLoading, hideLoading, showError]);

  const visibleResults = useMemo(() => {
    const filtered =
      selectedCategory === 'all'
        ? results
        : results.filter((result) => {
            if (!isPopulatedResultModel(result.model)) return false;
            return result.model.category?.documentId === selectedCategory;
          });

    return [...filtered].sort((a, b) => {
      const nameA = isPopulatedResultModel(a.model) ? a.model.model.name : '';
      const nameB = isPopulatedResultModel(b.model) ? b.model.model.name : '';
      return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
    });
  }, [results, selectedCategory]);

  if (!isReady) return null;

  if (!competition?.hasPublicResults) {
    return (
      <main className="results__container">
        <PageHeader title="Resultados" onBack={() => router.push(`/activities/${params.documentId}`)} />
        <p className="results__empty">Los resultados aún no han sido publicados.</p>
      </main>
    );
  }

  const hasCategories = competition.categories.length > 0;

  return (
    <main className="results__container">
      <PageHeader title="Resultados" onBack={() => router.push(`/activities/${params.documentId}`)} />

      {hasCategories && (
        <div className="results__filters">
          <button
            className={`results__filter-chip${selectedCategory === 'all' ? ' results__filter-chip--active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            Todas
          </button>
          {competition.categories.map((category) => (
            <button
              key={category.documentId}
              className={`results__filter-chip${selectedCategory === category.documentId ? ' results__filter-chip--active' : ''}`}
              onClick={() => setSelectedCategory(category.documentId)}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      {visibleResults.length === 0 ? (
        <p className="results__empty">Aún no hay resultados publicados.</p>
      ) : (
        <div className={`results__list${hasCategories ? '' : ' results__list--first'}`}>
          {visibleResults.map((result) => {
            if (!isPopulatedResultModel(result.model)) return null;
            const entry = result.model;
            const model = entry.model;
            const batch = result.batch && result.batch.batch !== 'none' ? result.batch : null;

            return (
              <div
                key={result.documentId}
                className="results__card"
                onClick={() =>
                  router.push(
                    `/activities/${params.documentId}/results/${model.documentId}/public`,
                  )
                }
              >
                <div className="results__model-image-container">
                  {model.image?.url ? (
                    <Image src={model.image.url} alt={model.name} fill className="object-cover" />
                  ) : (
                    <Image src="/globe.svg" alt="Placeholder" fill className="object-cover" />
                  )}
                </div>
                <div className="results__model-info">
                  <p className="results__model-name">{model.name}</p>
                  {entry.category && (
                    <span className="results__model-category">{entry.category.name}</span>
                  )}
                </div>
                {batch && (
                  <div className="results__batch-badge">
                    {batch.batchImage?.url && (
                      <div className="results__batch-image-container">
                        <Image
                          src={batch.batchImage.url}
                          alt={batch.batchName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <span className="results__batch-name">{batch.batchName}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
