'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUnifiedDialog } from '@/features/dialogs/context/unified-dialog-provider';
import { getModelByDocumentId, deleteModel } from '@/features/models/service/models-service';
import ModelDetailCard from '@/components/ui/cards/ModelDetailCard';
import type { ModelEntity } from '@/domain/entities/models/model-entity';
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
      showLoading('Cargando modelo...');
      try {
        const data = await getModelByDocumentId(params.documentId);
        setModel(data);
      } catch {
        showError('Error al cargar el modelo', 'Error');
      } finally {
        hideLoading();
        setIsLoading(false);
      }
    }
    load();
  }, [params.documentId, showLoading, hideLoading, showError]);

  async function handleDelete() {
      showConfirmation(
        'Eliminar Modelo',
        '¿Estás seguro de que deseas eliminar este modelo? Esta acción no se puede deshacer.',
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
          showSuccess('Modelo eliminado correctamente');
          router.push('/user/models');
        } catch {
          showError('Error al eliminar el modelo', 'Error');
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
        Volver
      </button>
      <button
        onClick={() => router.push(`/user/models/${params.documentId}/edit`)}
        className="detail-page__edit-btn"
      >
        Editar
      </button>
      <h1 className="detail-page__title">Detalle del Modelo</h1>
      <div className="detail-page__card-wrapper">
        <ModelDetailCard model={model} />
      </div>
      <div className="detail-page__model-number">
        <span className="detail-page__model-number__label">Modelo N°</span>
        <span className="detail-page__model-number__value">{model.id}</span>
      </div>
      <div className="detail-page__delete-wrapper">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="delete-button"
        >
          {isDeleting ? 'Eliminando...' : 'Eliminar Modelo'}
        </button>
      </div>
    </main>
  );
}

