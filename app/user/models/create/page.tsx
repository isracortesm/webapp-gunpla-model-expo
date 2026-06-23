'use client';

import { useState, FormEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthWithStorage } from '@/features/auth/context/auth-provider';
import { getStoredToken } from '@/features/auth/context/auth-provider';
import { useUnifiedDialog } from '@/features/dialogs/context/unified-dialog-provider';
import { uploadMedia } from '@/features/media/service/media-service';
import { deleteMedia } from '@/features/media/service/media-service';
import { createModel } from '@/features/models/service/models-service';
import './create.css';

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

export default function CreateModelPage() {
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
    showLoading('Creating model...');
    try {
      await createModel({
        name,
        description,
        userId: user.id,
        imageId: uploadedImage?.id,
        token: token ?? undefined,
        references,
      });
      router.push('/user/models');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create model';
      showError(message, 'Error');
    } finally {
      hideLoading();
      setIsSubmitting(false);
    }
  }

  return (
    <main className="create-page__container">
      <button
        onClick={() => router.push('/user/models')}
        className="create-page__back-btn">
        Back
      </button>
      <h1 className="create-page__title">New Model</h1>
      <div className="create-page__card-wrapper">
        <form onSubmit={handleSubmit} className="create-form">
          <div className="image-upload-section">
            {uploadedImage ? (
              <div className="image-preview-container">
                <div className="image-preview-wrapper">
                  <Image
                    src={uploadedImage.url}
                    alt="Preview"
                    fill
                    className="image-preview__img"
                    sizes="140px"
                  />
                </div>

                <button
                  type="button"
                  className="image-remove-button"
                  onClick={handleRemoveImage}
                  disabled={isUploading}
                >
                  ✕
                </button>
              </div>
            ) : (
              <label
                htmlFor="image"
                className="image-upload-trigger"
                title="Upload image"
              >
                {isUploading ? (
                  <span className="upload-status">Uploading...</span>
                ) : (
                  <>
                    <span className="upload-icon">＋</span>
                    <span className="upload-text">Add Image</span>
                  </>
                )}
              </label>
            )}
            <input
              id="image"
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden-input"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
          </div>

          <label htmlFor="name" className="input-label">Model Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter model name"
            className="text-input no-autofill"
          />

          <label htmlFor="description" className="input-label">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Describe your model"
            className="text-area no-autofill"
          />

          <label className="input-label">References</label>
          <div className="references-list">
            {references.map((ref, index) => (
              <div key={index} className="reference-item">
                <select
                  value={ref.type}
                  onChange={(e) => updateReference(index, 'type', e.target.value)}
                  className="reference-select"
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
                  className="reference-input"
                />
                <input
                  type="text"
                  value={ref.url}
                  onChange={(e) => updateReference(index, 'url', e.target.value)}
                  placeholder="https://..."
                  className="reference-input"
                />
                <button
                  type="button"
                  onClick={() => removeReference(index)}
                  className="reference-remove-btn"
                  title="Remove reference"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addReference}
              className="add-reference-btn"
            >
              + Add Reference
            </button>
          </div>

          <button
            type="submit"
            disabled={!name || !description || isSubmitting}
            className="create-button">
            {isSubmitting ? 'Creating...' : 'Create Model'}
          </button>
        </form>
      </div>
    </main>
  );
}
