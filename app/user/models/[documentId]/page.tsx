'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUnifiedDialog } from '@/features/dialogs/context/unified-dialog-provider';
import { getModelByDocumentId, deleteModel } from '@/features/models/service/models-service';
import SocialNetworkIcons from '@/shared/components/ui/social-networks/SocialNetworkIcons';
import type { ModelEntity } from '@/domain/entities/models/model-entity';
import type { SocialNetworkItem } from '@/domain/entities/event-dashboard/entity';
import './detail.css';

export default function ModelDetailPage() {
  const params = useParams<{ documentId: string }>();
  const router = useRouter();
  const { showLoading, hideLoading, showError, showSuccess, showConfirmation } = useUnifiedDialog();

  const [model, setModel] = useState<ModelEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    async function load() {
      showLoading('Loading model...');
      try {
        const data = await getModelByDocumentId(params.documentId);
        setModel(data);
      } catch {
        showError('Failed to load model', 'Error');
      } finally {
        hideLoading();
        setIsLoading(false);
      }
    }
    load();
  }, [params.documentId, showLoading, hideLoading, showError]);

  async function handleDelete() {
    showConfirmation(
      'Delete Model',
      'Are you sure you want to delete this model? This action cannot be undone.',
      async () => {
        setIsDeleting(true);
        showLoading('Deleting model...');
        try {
          const token = localStorage.getItem('auth_token') || undefined;
          await deleteModel({
            documentId: params.documentId,
            imageId: model?.image?.id,
            token,
          });
          showSuccess('Model deleted successfully');
          router.push('/user/models');
        } catch {
          showError('Failed to delete model', 'Error');
        } finally {
          hideLoading();
          setIsDeleting(false);
        }
      },
    );
  }

  if (isLoading || !model) return null;

  return (
    <main className="detail-page__container">
      <button
        onClick={() => router.push('/user/models')}
        className="detail-page__back-btn"
      >
        Back
      </button>
      <h1 className="detail-page__title">Model Detail</h1>
      <div className="detail-page__card-wrapper">
        <div className="detail-card">
          <div className="detail-image-container">
            {model.image?.url ? (
              <div className="detail-image-wrapper">
                <Image
                  src={model.image.url}
                  alt={model.name}
                  fill
                  className="detail-image"
                  sizes="140px"
                />
              </div>
            ) : (
              <div className="detail-image-placeholder">No Image</div>
            )}
          </div>

          <div className="info-item">
            <label>Model Name</label>
            <span>{model.name}</span>
          </div>

          {model.description && (
            <div className="info-item about-me">
              <label>Description</label>
              <p>{model.description}</p>
            </div>
          )}

          {model.references && model.references.length > 0 && (
            <div className="detail-references-section">
              <label className="detail-field__label">References</label>
              <SocialNetworkIcons networks={model.references as SocialNetworkItem[]} />
            </div>
          )}

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="delete-button"
          >
            {isDeleting ? 'Deleting...' : 'Delete Model'}
          </button>
        </div>
      </div>
    </main>
  );
}

