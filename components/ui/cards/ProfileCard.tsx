import React from 'react';
import Image from 'next/image';
import type { UserEntity } from '@/domain/entities/auth/entity';
import SocialNetworkIcons from '@/shared/components/ui/social-networks/SocialNetworkIcons';
import './ProfileCard.css';

interface ProfileCardProps {
  user: UserEntity;
}

export default function ProfileCard({ user }: ProfileCardProps) {
  const avatarSrc = user.profileImage?.thumbnailUrl || user.profileImage?.url || '/globe.svg';

  return (
    <div className="card-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar-wrapper">
            <Image
              src={avatarSrc}
              alt={`${user.username}'s avatar`}
              width={120}
              height={120}
              className="avatar-image"
            />
          </div>
          <h2 className="profile-name">{user.username}</h2>
        </div>

        <div className="profile-info">
          <div className="info-item">
            <label>Email</label>
            <span>{user.email}</span>
          </div>
          
          {user.aboutMe && (
            <div className="info-item about-me">
              <label>About Me</label>
              <p>{user.aboutMe}</p>
              
            </div>
          )}

          {user.socialNetworks && user.socialNetworks.length > 0 && (
            <div className="info-item social-networks">
              <label>Social Networks</label>
              <SocialNetworkIcons networks={user.socialNetworks} />
            </div>
          )}
        </div>

        <div className="profile-actions">
          <button className="btn btn-primary" onClick={() => {}}>
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}