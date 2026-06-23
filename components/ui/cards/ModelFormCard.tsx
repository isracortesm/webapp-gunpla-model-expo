'use client';

import { useState, FormEvent, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthWithStorage, getStoredToken } from '@/features/auth/context/auth-provider';
import { useUnifiedDialog } from '@/features/dialogs/context/unified-dialog-provider';
import { uploadMedia } from '@/features/media/service/media-service';
import { deleteMedia } from '@/features/media/service/media-service';
import { createModel, updateModel } from '@/features/models/service/models-service';
import type { ModelEntity } from '@/domain/entities/models/model-entity';
import './ModelFormCard.css';

const REFERENCES_TYPES = [
  'email',
  'instagram',
  'puttyandpaint',
  'facebook',
  'pinterest',
  'twitter',
  'tiktok',
  'artstation',
  'web',
  'linktree',
  'other',
] as const;

interface ModelFormCardProps {
  mode: 'create' | 'edit';
  initialData?: ModelEntity;
  documentId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ModelFormCard({ mode, initialData, documentId, onSuccess, onCancel }: ModelFormCardProps) {
  const router = useRouter();
  const { user } = useAuthWithStorage();
  const { showLoading, hideLoading, showError } = useUnifiedDialog();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<{ id: number; documentId: string; url: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [references, setReferences] = useState<{ type: string; name: string; url: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const token = getStoredToken();

  useEffect(() => {
    if (mode !== 'edit' || !initialData) return;

    setName(initialData.name);
    setDescription(initialData.description);
    setReferences(initialData.references || []);

    if (initialData.image?.url) {
      setUploadedImage({
        id: initialData.image.id,
        documentId: initialData.image.documentId,
        url: initialData.image.url,
      });
    }
  }, [mode, initialData]);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setIsUploading(true);
    showLoading('Uploading image...');
    try {
      const result = await uploadMedia(file, token);
      const img = result[0];
      setUploadedImage({ id: img.id, documentId: img.documentId, url: img.url });
      setImageFile(file);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload image';
      showError(message, 'Upload Error');
    } finally {
      hideLoading();
      setIsUploading(false);
    }
  }

  async function handleRemoveImage() {
    if (!uploadedImage || !token) return;

    showLoading('Removing image...');
    try {
      await deleteMedia(uploadedImage.id, token);
      setUploadedImage(null);
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to remove image';
      showError(message, 'Error');
    } finally {
      hideLoading();
    }
  }

  function addReference() {
    setReferences((prev) => [...prev, { type: 'instagram', name: '', url: '' }]);
  }

  function removeReference(index: number) {
    setReferences((prev) => prev.filter((_, i) => i !== index));
  }

  function updateReference(index: number, field: 'type' | 'name' | 'url', value: string) {
    setReferences((prev) =>
      prev.map((ref, i) => (i === index ? { ...ref, [field]: value } : ref))
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user || !user.id) return;

    setIsSubmitting(true);
    showLoading(mode === 'create' ? 'Creating model...' : 'Updating model...');
    try {
      if (mode === 'create') {
        await createModel({
          name,
          description,
          userId: user.id,
          imageId: uploadedImage?.id,
          token: token ?? undefined,
          references,
        });
      } else if (documentId) {
        await updateModel(documentId, {
          name,
          description,
          userId: user.id,
          imageId: uploadedImage?.id,
          token: token ?? undefined,
          references,
        });
      }
      onSuccess();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : `Failed to ${mode} model`;
      showError(message, 'Error');
    } finally {
      hideLoading();
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="model-form-card">
      <div className="model-form-card__image-section">
        {uploadedImage ? (
          <div className="model-form-card__image-preview-container">
            <div className="model-form-card__image-preview-wrapper">
              <Image
                src={uploadedImage.url}
                alt="Preview"
                fill
                className="model-form-card__image-preview-img"
                sizes="140px"
              />
            </div>

            <button
              type="button"
              className="model-form-card__image-remove"
              onClick={handleRemoveImage}
              disabled={isUploading}
            >
              ✕
            </button>
          </div>
        ) : (
          <label
            htmlFor="image"
            className="model-form-card__image-trigger"
            title="Upload image"
          >
            {isUploading ? (
              <span className="model-form-card__upload-status">Uploading...</span>
            ) : (
              <>
                <span className="model-form-card__upload-icon">＋</span>
                <span className="model-form-card__upload-text">Add Image</span>
              </>
            )}
          </label>
        )}
        <input
          id="image"
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="model-form-card__file-input"
          onChange={handleFileSelect}
          disabled={isUploading}
        />
      </div>

      <label htmlFor="name" className="model-form-card__label">Model Name</label>
      <input
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="Enter model name"
        className="model-form-card__input"
      />

      <label htmlFor="description" className="model-form-card__label">Description</label>
      <textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        placeholder="Describe your model"
        className="model-form-card__textarea"
      />

      <label className="model-form-card__label">References</label>
      <div className="model-form-card__references">
        {references.map((ref, index) => (
          <div key={index} className="model-form-card__ref-item">
            <select
              value={ref.type}
              onChange={(e) => updateReference(index, 'type', e.target.value)}
              className="model-form-card__ref-select"
            >
              {REFERENCES_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={ref.name}
              onChange={(e) => updateReference(index, 'name', e.target.value)}
              placeholder="Display name"
              className="model-form-card__ref-input"
            />
            <input
              type="text"
              value={ref.url}
              onChange={(e) => updateReference(index, 'url', e.target.value)}
              placeholder="https://..."
              className="model-form-card__ref-input"
            />
            <button
              type="button"
              onClick={() => removeReference(index)}
              className="model-form-card__ref-remove"
              title="Remove reference"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addReference}
          className="model-form-card__add-ref"
        >
          + Add Reference
        </button>
      </div>

      <button
        type="submit"
        disabled={!name || !description || isSubmitting}
        className="model-form-card__submit"
      >
        {isSubmitting
          ? (mode === 'create' ? 'Creating...' : 'Saving...')
          : (mode === 'create' ? 'Create Model' : 'Save Changes')
        }
      </button>
    </form>
  );
}
