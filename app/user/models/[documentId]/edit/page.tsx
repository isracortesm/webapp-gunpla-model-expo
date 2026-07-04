'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUnifiedDialog } from '@/features/dialogs/context/unified-dialog-provider';
import { getModelByDocumentId } from '@/features/models/service/models-service';
import ModelFormCard from '@/components/ui/cards/ModelFormCard';
import type { ModelEntity } from '@/domain/entities/models/model-entity';
import './edit.css';

export default function EditModelPage() {
  const params = useParams<{ documentId: string }>();
  const router = useRouter();
  const { showLoading, hideLoading, showError } = useUnifiedDialog();

  const [model, setModel] = useState<ModelEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

  if (isLoading || !model) return null;

  return (
    <main className="edit-page__container">
      <button
        onClick={() => router.push(`/user/models/${params.documentId}`)}
        className="edit-page__back-btn"
      >
        Volver
      </button>
      <h1 className="edit-page__title">Editar modelo</h1>
      <div className="edit-page__card-wrapper">
        <ModelFormCard
          mode="edit"
          initialData={model}
          documentId={params.documentId}
          onSuccess={() => router.push(`/user/models/${params.documentId}`)}
          onCancel={() => router.push(`/user/models/${params.documentId}`)}
        />
      </div>
    </main>
  );
}
