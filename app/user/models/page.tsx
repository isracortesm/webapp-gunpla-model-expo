'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useAuthWithStorage } from '@/features/auth/context/auth-provider';
import { ModelRepositoryImpl } from '@/data/repositories/models/model-repository-impl';
import { HttpService } from '@/data/services/http-client';
import { GetModelsUseCase } from '@/domain/usecases/models/get-models-usecase';
import { ModelEntity } from '@/domain/entities/models/model-entity';
import { PaginatedModelResult } from '@/domain/entities/models/paginated-model-result';
import { useRouter } from 'next/navigation';
import './models.css';

export default function ModelsListPage() {
  const { user } = useAuthWithStorage();
  const router = useRouter();
  const [models, setModels] = useState<ModelEntity[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Initialize repository and use case
  const httpService = new HttpService();
  const modelRepository = new ModelRepositoryImpl(httpService);
  const getModelsUseCase = new GetModelsUseCase(modelRepository);

  const fetchModels = useCallback(async (currentPage: number) => {
    if (!user || !user.id) return;
    
    setIsLoading(true);
    try {
      const result: PaginatedModelResult = await getModelsUseCase.execute({
        page: currentPage,
        pageSize: pageSize,
        userId: user.id,
      });

      setModels(prev => (currentPage === 1 ? result.data : [...prev, ...result.data]));
      setPageCount(result.meta.pagination.pageCount);
      setHasMore(currentPage < result.meta.pagination.pageCount);
    } catch (error) {
      console.error('Error fetching models:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, pageSize, getModelsUseCase]);

  useEffect(() => {
    fetchModels(1);
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const threshold = 50; // pixels from bottom
    const isBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + threshold;

    if (isBottom && hasMore && !isLoading && page < pageCount) {
      fetchModels(page + 1);
      setPage(prev => prev + 1);
    }
  }, [hasMore, isLoading, page, pageCount, fetchModels]);

  return (
    <main className="models-page__container">
      <button
        onClick={() => router.push('/')}
        className="models-page__back-btn">
        Back
      </button>
      
      <h1 className="models-page__title">My Models</h1>

      <div className="max-w-4xl mx-auto w-full">
        <div
          className="models-list__container"
          onScroll={handleScroll}
        >
          {models.map((model, index) => (
            <div key={`${model.id}-${index}`} className="model-card">
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

              <div className="model-card-content">
                <h2 className="model-card-title">{model.name}</h2>
                <p className="model-card-subtitle">{model.description}</p>
              </div>
            </div>
          ))}
          
          {isLoading && <p className="models-page__loader-text">Loading more models...</p>}
          {!hasMore && models.length > 0 && <p className="models-page__loader-text">No more models to show.</p>}
        </div>
    
        <div className="models-page__count">
          Page {page} of {pageCount || 1}
        </div>
      </div>
    </main>
  );
}
