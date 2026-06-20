'use client';

import React from 'react';
import { useAuthWithStorage } from '@/features/auth/context/auth-provider';
import ProfileCard from '@/components/ui/cards/ProfileCard';
import { useRouter } from 'next/navigation';

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
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <button 
          onClick={() => router.push('/')}
          className="mb-4 text-sm text-gray-600 hover:underline"
        >
          ← Back to Home
        </button>
        <ProfileCard user={user} />
      </div>
    </main>
  );
}