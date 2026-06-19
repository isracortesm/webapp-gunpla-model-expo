'use client';

import { Suspense } from 'react';
import { getCurrentUser } from '@/features/auth/service/auth-service';
import { useAuthWithStorage } from '@/features/auth/context/auth-provider';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SocialNetworkIcons from '@/shared/components/ui/social-networks/SocialNetworkIcons';
import type { SocialNetworkItem } from '@/domain/entities/event-dashboard/entity';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuthWithStorage();

  return (
    <div className="profile-page">
      <header className="profile-header">
        <h1>Profile</h1>
        <button onClick={() => router.push('/')} className="btn btn-secondary">Back</button>
      </header>

      {user ? (
        <Suspense fallback={<div>Loading...</div>}>
          <UserDetails user={user} onLogout={logout} />
        </Suspense>
      ) : (
        <div className="profile-loading">Loading profile...</div>
      )}
    </div>
  );
}

interface UserDetailsProps {
  user: {
    id: number;
    username: string;
    email: string;
    provider: string;
    aboutMe?: string;
    profileImage?: { thumbnailUrl?: string | null; url?: string } | null;
    confirmed: boolean;
    blocked: boolean;
    socialNetworks?: SocialNetworkItem[];
  };
  onLogout: () => void;
}

function UserDetails({ user, onLogout }: UserDetailsProps) {
  const avatarSrc = user.profileImage?.thumbnailUrl || user.profileImage?.url || '/globe.svg';

  return (
    <div className="profile-content">
      <section className="profile-avatar-section">
        <Image
          src={avatarSrc}
          alt={`${user.username}'s avatar`}
          width={120}
          height={120}
          className="avatar-image"
        />
        <h2>{user.username}</h2>
      </section>

      {user.aboutMe && (
        <section className="profile-about">
          <label>About Me</label>
          <p>{user.aboutMe}</p>
        </section>
      )}

      <section className="profile-details">
        <div className="detail-item">
          <label>Email</label>
          <span>{user.email}</span>
        </div>
        <div className="detail-item">
          <label>Provider</label>
          <span>{user.provider}</span>
        </div>
        <div className="detail-item">
          <label>Status</label>
          <span className={user.confirmed ? 'status-confirmed' : 'status-pending'}>
            {user.confirmed ? 'Confirmed' : 'Pending Confirmation'}
          </span>
        </div>
      </section>

      {user.socialNetworks && user.socialNetworks.length > 0 && (
        <section className="profile-social-networks">
          <label>Social Networks</label>
          <SocialNetworkIcons networks={user.socialNetworks} />
        </section>
      )}

      <button onClick={onLogout} className="btn btn-danger">
        Logout
      </button>
    </div>
  );
}