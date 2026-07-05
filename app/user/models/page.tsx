'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useAuthWithStorage } from '@/features/auth/context/auth-provider';
import { getModels } from '@/features/models/service/models-service';
import { useUnifiedDialog } from '@/features/dialogs/context/unified-dialog-provider';
import { ModelEntity } from '@/domain/entities/models/model-entity';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import './models.css';

export default function ModelsListPage() {
  const { user } = useAuthWithStorage();
  const router = useRouter();
  const [models, setModels] = useState<ModelEntity[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);
  const [pageCount, setPageCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Initialize repository and use case
  const { showLoading, hideLoading, showError } = useUnifiedDialog();

  const fetchModels = useCallback(async (currentPage: number) => {
    if (!user || !user.id) return;
    
    showLoading('Cargando modelos...');
    try {
      const result = await getModels(currentPage, pageSize, user.id);
 
      setModels(prev => (currentPage === 1 ? result.data : [...prev, ...result.data]));
      setPageCount(result.meta.pagination.pageCount);
      setHasMore(currentPage < result.meta.pagination.pageCount);
    } catch (error) {
      console.error('Error fetching models:', error);
      showError('Error al cargar modelos', 'Error');
    } finally {
      hideLoading();
    }
  }, [user, pageSize, showLoading, hideLoading, showError]);

  useEffect(() => {
    fetchModels(1);
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const threshold = 50; // pixels from bottom
    const isBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + threshold;

    if (isBottom && hasMore && page < pageCount) {
      fetchModels(page + 1);
      setPage(prev => prev + 1);
    }
  }, [hasMore, page, pageCount, fetchModels]);

  return (
    <main className="models-page__container">
      <PageHeader title="Mis Modelos" onBack={() => router.push('/')} position="static" />

      <div className="max-w-4xl mx-auto w-full">
        <div
          className="models-list__container"
          onScroll={handleScroll}
        >
          {models.map((model, index) => (
            <div
              key={`${model.id}-${index}`}
              className="model-card"
              onClick={() => router.push(`/user/models/${model.documentId}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="model-card-content">
                <h2 className="model-card-title">{model.name}</h2>
                <p className="model-card-subtitle">{model.description}</p>
              </div>
              <div className="model-card-image-container">
                {model.image?.url ? (
                  <>
                    <Image
                      src={model.image.url}
                      alt={model.name}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="model-card-gradient-overlay" />
                  </>
                ) : (
                  <Image
                    src="/globe.svg"
                    alt="Placeholder"
                    fill
                    className="object-cover"
                    priority
                  />
                )}
              </div>
            </div>
          ))}
          
          {!hasMore && (
            <div className="model-card model-card--add" onClick={() => router.push('/user/models/create')}>
              <div className="model-card-content">
                <h2 className="model-card-title">+ Agregar Modelo</h2>
                <p className="model-card-subtitle">Crear un nuevo modelo</p>
              </div>
            </div>
          )}
        </div>
    
        <div className="models-page__count">
          Página {page} de {pageCount || 1}
        </div>
      </div>
    </main>
  );
}

