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
        Back
      </button>
      <div className="profile-page__card-wrapper">
        <ProfileCard user={user} />
      </div>
    </main>
  );
}