'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthWithStorage } from '@/features/auth/context/auth-provider';
import { useUnifiedDialog } from '@/features/dialogs/context/unified-dialog-provider';
import { uploadMedia, deleteMedia } from '@/features/media/service/media-service';
import { updateCurrentUser } from '@/features/auth/service/auth-service';
import type { UserEntity } from '@/domain/entities/auth/entity';
import type { SocialNetworkItem } from '@/domain/entities/event-dashboard/entity';
import './edit.css';

const SOCIAL_NETWORK_TYPES = [
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
  const { user, fetchCurrentUser } = useAuthWithStorage();
  const { showLoading, hideLoading, showError, showSuccess } = useUnifiedDialog();

  const [username, setUsername] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [socialNetworks, setSocialNetworks] = useState<SocialNetworkItem[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedMediaId, setUploadedMediaId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const getProfileImageId = (profileImage: UserEntity['profileImage']): number | undefined => {
    if (!profileImage) return undefined;
    if (typeof profileImage === 'object' && 'id' in profileImage) return (profileImage as { id: number }).id;
    return undefined;
  };

  useEffect(() => {
    if (!user) return;

    setUsername(user.username || '');
    setAboutMe(user.aboutMe || '');
    setSocialNetworks(
      user.socialNetworks?.map((sn: SocialNetworkItem) => ({
        id: sn.id,
        type: sn.type,
        name: sn.name,
        url: sn.url,
      })) ?? [],
    );

    if (user.profileImage && typeof user.profileImage === 'object' && 'url' in user.profileImage) {
      setUploadedImage(user.profileImage.url);
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
      const result = await uploadMedia(file, token);
      setUploadedMediaId(result[0].id);
      setUploadedImage(result[0].url);
      showSuccess('Image uploaded successfully');
    } catch (error: unknown) {
      showError(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = async () => {
    if (!uploadedImage || !user?.profileImage) return;

    try {
      const imageId = getProfileImageId(user.profileImage);
      if (!imageId) {
        setUploadedImage(null);
        return;
      }

      const token = localStorage.getItem('auth_token') ?? undefined;
      await deleteMedia(imageId, token);
      setUploadedImage(null);
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

  const handleRemoveNetwork = (index: number) => {
    setSocialNetworks(socialNetworks.filter((_, i) => i !== index));
  };

  const handleUpdateNetwork = (index: number, field: keyof SocialNetworkItem, value: string) => {
    setSocialNetworks(
      socialNetworks.map((network, i) =>
        i === index ? { ...network, [field]: value } : network,
      ),
    );
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
        socialNetworks: socialNetworks.filter((sn) => sn.type && sn.name && sn.url),
      };

      if (uploadedMediaId !== null) {
        params.profileImage = uploadedMediaId;
      } else if (!uploadedImage && user?.profileImage) {
        const imageId = getProfileImageId(user.profileImage);
        params.profileImage = imageId ?? null;
      }

      const updatedUser = await updateCurrentUser(user.id, params);
      fetchCurrentUser(updatedUser);
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
                  onChange={(e) => handleUpdateNetwork(index, 'name', e.target.value)}
                  placeholder="Display name"
                  className="edit-page__form-ref-input"
                />
                <input
                  type="text"
                  value={ref.url}
                  onChange={(e) => handleUpdateNetwork(index, 'url', e.target.value)}
                  placeholder="https://..."
                  className="edit-page__form-ref-input"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveNetwork(index)}
                  className="edit-page__form-ref-remove"
                  title="Remove reference"
                >
                  ✕
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
