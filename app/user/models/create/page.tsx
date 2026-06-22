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
      await deleteMedia(uploadedImage.documentId, token);
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
    <div className="create-page">
      <form onSubmit={handleSubmit} className="create-form">
        <h1 className="create-title">New Model</h1>

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

        <div className="file-input-wrapper">
          <label className="input-label">Image</label>
          {uploadedImage ? (
            <div className="image-preview">
              <Image
                src={uploadedImage.url}
                alt="Preview"
                width={0}
                height={0}
                className="image-preview__img"
                sizes="100vw"
              />
              <button
                type="button"
                className="image-preview__remove"
                onClick={handleRemoveImage}
                disabled={isUploading}
              >
                X
              </button>
            </div>
          ) : (
            <>
              <label htmlFor="image" className="file-input-label">
                {isUploading ? 'Uploading...' : 'Click to select an image'}
              </label>
              <input
                id="image"
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="file-input"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
            </>
          )}
        </div>

        <button
          type="submit"
          disabled={!name || !description || isSubmitting}
          className="create-button"
        >
          {isSubmitting ? 'Creating...' : 'Create Model'}
        </button>

        <p className="back-link-text">
          <a href="/user/models" className="back-link">Back to models</a>
        </p>
      </form>
    </div>
  );
}
