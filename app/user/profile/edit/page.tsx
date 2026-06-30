'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthWithStorage, getStoredToken } from '@/features/auth/context/auth-provider';
import { useUnifiedDialog } from '@/features/dialogs/context/unified-dialog-provider';
import { uploadMedia, deleteMedia } from '@/features/media/service/media-service';
import { updateCurrentUser, createSocialNetwork, deleteSocialNetwork } from '@/features/auth/service/auth-service';
import type { SocialNetworkItem } from '@/domain/entities/event-dashboard/entity';
import './edit.css';

const SOCIAL_NETWORK_TYPES = [
  'email',
  'instagram',
  'facebook',
  'twitter',
  'tiktok',
  'pinterest',
  'artstation',
  'linktree',
  'web',
  'youtube',
  'discord',
  'twitch',
  'other',
];

export default function EditProfilePage() {
  const router = useRouter();
  const { user, refreshCurrentUser } = useAuthWithStorage();
  const { showLoading, hideLoading, showError, showSuccess } = useUnifiedDialog();

  const [username, setUsername] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [socialNetworks, setSocialNetworks] = useState<SocialNetworkItem[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedMediaId, setUploadedMediaId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [originalNetworkIds, setOriginalNetworkIds] = useState<Set<number>>(new Set());

  const isOriginalNetwork = (id: number) => originalNetworkIds.has(id);

  useEffect(() => {
    if (!user) return;

    setUsername(user.username || '');
    setAboutMe(user.aboutMe || '');
    const backendNetworks = user.socialNetworks ?? [];
    setOriginalNetworkIds(new Set(backendNetworks.map((sn) => sn.id)));
    setSocialNetworks(
      backendNetworks.map((sn: SocialNetworkItem) => ({
        id: sn.id,
        documentId: sn.documentId,
        type: sn.type,
        name: sn.name,
        url: sn.url,
      })),
    );

    if (user.profileImage && typeof user.profileImage === 'object' && 'url' in user.profileImage) {
      setUploadedImage(user.profileImage.url);
      if ('id' in user.profileImage) {
        setUploadedMediaId((user.profileImage as { id: number }).id);
      }
    } else if (typeof user.profileImage === 'string') {
      setUploadedImage(user.profileImage);
    }
  }, [user]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const token = localStorage.getItem('auth_token') ?? undefined;
      const result = await uploadMedia(file, token, {
        ref: 'plugin::users-permissions.user',
        refId: user!.id,
        field: 'profileImage',
      });
      setUploadedMediaId(result[0].id);
      setUploadedImage(result[0].url);
      await refreshCurrentUser();
      showSuccess('Image uploaded successfully');
    } catch (error: unknown) {
      showError(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = async () => {
    if (!uploadedMediaId) return;

    try {
      const token = localStorage.getItem('auth_token') ?? undefined;
      await deleteMedia(uploadedMediaId, token);
      setUploadedImage(null);
      setUploadedMediaId(null);
      await refreshCurrentUser();
      showSuccess('Profile image removed');
    } catch (error: unknown) {
      showError(error instanceof Error ? error.message : 'Failed to remove profile image');
    }
  };

  const handleAddNetwork = () => {
    setSocialNetworks([
      ...socialNetworks,
      { id: Date.now(), type: '', name: '', url: '' },
    ]);
  };

  const handleUpdateNetwork = (index: number, field: keyof SocialNetworkItem, value: string) => {
    setSocialNetworks(
      socialNetworks.map((network, i) =>
        i === index ? { ...network, [field]: value } : network,
      ),
    );
  };

  const handleSaveNewNetwork = async (index: number) => {
    if (!user) return;
    const sn = socialNetworks[index];

    if (!sn.type || !sn.name || !sn.url) {
      showError('Please fill all fields before saving');
      return;
    }

    showLoading('Saving social network...');
    try {
      const token = getStoredToken();
      const result = await createSocialNetwork({
        type: sn.type,
        name: sn.name,
        url: sn.url,
        userId: user.id,
      }, token ?? undefined);

      const newId = result.data.id;
      const newDocumentId = result.data.documentId;
      const updatedNetworks = [...socialNetworks];
      updatedNetworks[index] = { ...sn, id: newId, documentId: newDocumentId };
      setSocialNetworks(updatedNetworks);
      setOriginalNetworkIds((prev) => new Set([...prev, newId]));

      await refreshCurrentUser();
      showSuccess('Social network saved');
    } catch (error: unknown) {
      showError(error instanceof Error ? error.message : 'Failed to save social network');
    } finally {
      hideLoading();
    }
  };

  const handleDeleteSocialNetwork = async (documentId: string) => {
    showLoading('Deleting social network...');
    try {
      const token = getStoredToken();
      await deleteSocialNetwork(documentId, token ?? undefined);
      setSocialNetworks(socialNetworks.filter((sn) => sn.documentId !== documentId));
      await refreshCurrentUser();
      showSuccess('Social network deleted');
    } catch (error: unknown) {
      showError(error instanceof Error ? error.message : 'Failed to delete social network');
    } finally {
      hideLoading();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) return;

    setIsSubmitting(true);
    showLoading('Saving changes...');

    try {
      const params: Parameters<typeof updateCurrentUser>[1] = {
        username,
        aboutMe: aboutMe || undefined,
      };

      const token = getStoredToken();
      
      // Update basic profile fields
      await updateCurrentUser(user.id, params, token ?? undefined);
      
      // Create new social networks (those not in originalNetworkIds)
      for (const sn of socialNetworks.filter((s) => !originalNetworkIds.has(s.id))) {
        if (sn.type && sn.name && sn.url) {
          await createSocialNetwork({ type: sn.type, name: sn.name, url: sn.url, userId: user.id }, token ?? undefined);
        }
      }

      await refreshCurrentUser();
      showSuccess('Profile updated successfully');
      router.push('/user/profile');
    } catch (error: unknown) {
      showError(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
      hideLoading();
    }
  };

  return (
    <main className="edit-page__container">
      <button
        onClick={() => router.push('/user/profile')}
        className="edit-page__back-btn"
      >
        Back
      </button>
      <h1 className="edit-page__title">Edit Profile</h1>
      <div className="edit-page__card-wrapper">
        <form onSubmit={handleSubmit} className="edit-page__form">
          {/* Image Upload */}
          <div className="edit-page__form-image-section">
            {uploadedImage ? (
              <div className="edit-page__form-image-preview-container">
                <div className="edit-page__form-image-preview-wrapper">
                  <Image
                    src={uploadedImage}
                    alt="Preview"
                    fill
                    className="edit-page__form-image-preview-img"
                    sizes="140px"
                  />
                </div>
                <button
                  type="button"
                  className="edit-page__form-image-remove"
                  onClick={handleRemoveImage}
                  disabled={isUploading}
                >
                  ✕
                </button>
              </div>
            ) : (
              <label
                htmlFor="profile-image-input"
                className="edit-page__form-image-trigger"
                title="Upload image"
              >
                {isUploading ? (
                  <span className="edit-page__form-upload-status">Uploading...</span>
                ) : (
                  <>
                    <span className="edit-page__form-upload-icon">＋</span>
                    <span className="edit-page__form-upload-text">Add Image</span>
                  </>
                )}
              </label>
            )}
            <input
              id="profile-image-input"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="edit-page__form-file-input"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
          </div>

          {/* Username */}
          <label htmlFor="username" className="edit-page__form-label">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your username"
            className="edit-page__form-input"
          />

          {/* About Me */}
          <label htmlFor="aboutMe" className="edit-page__form-label">About Me</label>
          <textarea
            id="aboutMe"
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
            placeholder="Tell us about yourself..."
            className="edit-page__form-textarea"
          />

          {/* Social Networks */}
          <label className="edit-page__form-label">Social Networks</label>
          <div className="edit-page__form-references">
            {socialNetworks.map((ref, index) => (
              <div key={index} className="edit-page__form-ref-item">
                <select
                  value={ref.type}
                  disabled={isOriginalNetwork(ref.id)}
                  onChange={(e) => handleUpdateNetwork(index, 'type', e.target.value)}
                  className="edit-page__form-ref-select"
                >
                  <option value="">Select type</option>
                  {SOCIAL_NETWORK_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={ref.name}
                  disabled={isOriginalNetwork(ref.id)}
                  readOnly={isOriginalNetwork(ref.id)}
                  onChange={(e) => handleUpdateNetwork(index, 'name', e.target.value)}
                  placeholder="Display name"
                  className="edit-page__form-ref-input"
                />
                <input
                  type="text"
                  value={ref.url}
                  disabled={isOriginalNetwork(ref.id)}
                  readOnly={isOriginalNetwork(ref.id)}
                  onChange={(e) => handleUpdateNetwork(index, 'url', e.target.value)}
                  placeholder="https://..."
                  className="edit-page__form-ref-input"
                />
                <button
                  type="button"
                  onClick={() => isOriginalNetwork(ref.id) && ref.documentId ? handleDeleteSocialNetwork(ref.documentId) : handleSaveNewNetwork(index)}
                  className="edit-page__form-ref-remove"
                  title={isOriginalNetwork(ref.id) ? 'Remove reference' : 'Save reference'}
                >
                  {isOriginalNetwork(ref.id) ? '✕' : '✓'}
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddNetwork}
              className="edit-page__form-add-ref"
            >
              + Add Reference
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!username || isSubmitting}
            className="edit-page__form-submit"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </main>
  );
}
