'use client';

import React from 'react';
import { useAuthWithStorage } from '@/features/auth/context/auth-provider';
import ProfileCard from '@/components/ui/cards/ProfileCard';
import { useRouter } from 'next/navigation';
import './profile.css';

export default function UserProfilePage() {
  const { user, fetchCurrentUser } = useAuthWithStorage();
  const router = useRouter();

  React.useEffect(() => {
    if (!user) {
      // If there's no user in context but we are on the profile page, 
      // it might be because it hasn't been fetched yet or session expired.
      // However, useAuthWithStorage usually handles initial load from storage.
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <main className="profile-page__container">
      <button
        onClick={() => router.push('/')}
        className="profile-page__back-btn">
        Volver
      </button>
      <button
        onClick={() => router.push('/user/profile/edit')}
        className="profile-page__edit-btn">
        Editar
      </button>
      <h1 className="profile-page__title">Perfil</h1>
      <div className="profile-page__card-wrapper">
        <ProfileCard user={user} />
      </div>
      <div className="profile-page__change-password-wrapper">
        <button
          className="profile-page__change-password-btn"
            onClick={() => router.push('/user/change-password')}>
          Cambiar Contraseña
        </button>
      </div>
    </main>
  );
}