'use client';

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/features/auth/context/auth-context";
import "./UserProfileDropdown.css";

interface UserProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfileDropdown({ isOpen, onClose }: UserProfileDropdownProps) {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isOpen) return null;

  const authenticatedMenuItems = [
    { label: "My Profile", href: "/user/profile" },
    { label: "My Models", href: "/user/models" },
    { label: "My Activities", href: "/user/activities" },
  ];

  const guestMenuItems = [
    { label: "Register", href: "/auth/register" },
    { label: "Login", href: "/auth/login" },
  ];

  const menuItems = isAuthenticated && user ? authenticatedMenuItems : guestMenuItems;
  const avatarSrc = isAuthenticated && user
    ? user.profileImage?.thumbnailUrl || user.profileImage?.url || '/globe.svg'
    : '/globe.svg';
  const displayName = isAuthenticated && user ? user.username : 'Guest';

  return (
    <div className="user-profile-dropdown__overlay" onClick={onClose}>
      <div
        className="user-profile-dropdown__menu"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="user-profile-dropdown__header">
          <Image
            src={avatarSrc}
            alt={isAuthenticated && user ? `${user.username}'s avatar` : 'Guest avatar'}
            width={48}
            height={48}
            className="user-profile-dropdown__avatar object-cover"
          />
          <div className="user-profile-dropdown__info">
            <p className="user-profile-dropdown__username">{displayName}</p>
            {isAuthenticated && user?.email && (
              <p className="user-profile-dropdown__email">{user.email}</p>
            )}
          </div>
        </div>

        {/* Divider */}
        <hr className="user-profile-dropdown__divider" />

        {/* Menu Items */}
        <nav className="user-profile-dropdown__menu-items">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="user-profile-dropdown__menu-item"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {isAuthenticated && user && (
          <>
            {/* Divider */}
            <hr className="user-profile-dropdown__divider" />

            {/* Logout Button */}
            <button
              onClick={logout}
              className="user-profile-dropdown__menu-item user-profile-dropdown__logout-btn"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
