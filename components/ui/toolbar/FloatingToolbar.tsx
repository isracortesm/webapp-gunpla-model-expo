import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/features/auth/context/auth-context";
import UserProfileDropdown from "./UserProfileDropdown";
import "./FloatingToolbar.css";

interface FloatingToolbarProps {
  onProfileClick?: () => void;
  showNavLinks?: boolean;
  pathname?: string | null;
  dropdownOpen?: boolean;
  onCloseDropdown?: () => void;
}

const NAV_ITEMS = [
  { href: '/', label: 'Inicio' },
  { href: '/news', label: 'Noticias' },
  { href: '/activities', label: 'Actividades' },
];

export default function FloatingToolbar({ onProfileClick, showNavLinks = false, pathname, dropdownOpen, onCloseDropdown }: FloatingToolbarProps) {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="floating-toolbar">
      <button
        onClick={onProfileClick}
        aria-label="Profile"
        className="floating-toolbar__profile-link"
      >
        <Image
          src={isAuthenticated && user ? user.profileImage?.thumbnailUrl || user.profileImage?.url || '/profile_thumb.jpg' : '/profile_thumb.jpg'}
          alt={isAuthenticated && user ? `${user.username}'s avatar` : 'Profile avatar'}
          width={32}
          height={32}
          className={`object-cover rounded-full ${!isAuthenticated ? 'opacity-50' : ''}`}
        />
      </button>

      {showNavLinks && (
        <div className="flex items-center gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`floating-toolbar__nav-btn ${isActive ? 'floating-toolbar__nav-btn--active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}

      {dropdownOpen && onCloseDropdown && (
        <UserProfileDropdown
          isOpen={true}
          onClose={onCloseDropdown}
        />
      )}
    </div>
  );
}
