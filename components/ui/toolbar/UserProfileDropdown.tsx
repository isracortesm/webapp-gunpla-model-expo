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
  const { user, logout } = useAuth();

  if (!isOpen || !user) return null;

  const menuItems = [
    { label: "My Profile", href: "/user/profile" },
    { label: "My Models", href: "/user/models" },
    { label: "My Activities", href: "user/activities" },
  ];

  return (
    <div className="user-profile-dropdown__overlay" onClick={onClose}>
      <div 
        className="user-profile-dropdown__menu" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with user info */}
        <div className="user-profile-dropdown__header">
          <Image
            src={user.profileImage?.thumbnailUrl || user.profileImage?.url || '/globe.svg'}
            alt={`${user.username}'s avatar`}
            width={48}
            height={48}
            className="user-profile-dropdown__avatar object-cover"
          />
          <div className="user-profile-dropdown__info">
            <p className="user-profile-dropdown__username">{user.username}</p>
            {user.email && (
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

        {/* Divider */}
        <hr className="user-profile-dropdown__divider" />

        {/* Logout Button */}
        <button 
          onClick={logout}
          className="user-profile-dropdown__menu-item user-profile-dropdown__logout-btn"
        >
          Logout
        </button>
      </div>
    </div>
  );
}