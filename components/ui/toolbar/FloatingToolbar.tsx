import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/features/auth/context/auth-context";
import "./FloatingToolbar.css";

interface FloatingToolbarProps {
  onProfileClick?: () => void;
  showNavLinks?: boolean;
  pathname?: string | null;
}

const NAV_ITEMS = [
  { href: '/', label: 'Inicio' },
  { href: '/news', label: 'Noticias' },
  { href: '/activities', label: 'Actividades' },
];

export default function FloatingToolbar({ onProfileClick, showNavLinks = false, pathname }: FloatingToolbarProps) {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="floating-toolbar">
      <button
        onClick={onProfileClick}
        aria-label="Profile"
        className="floating-toolbar__profile-link object-cover rounded-full ring-1 ring-zinc-600/50 transition-transform hover:scale-110 cursor-pointer bg-transparent border-none p-0"
      >
        <Image
          src={isAuthenticated && user ? user.profileImage?.thumbnailUrl || user.profileImage?.url || '/profile_holder.png' : '/profile_holder.png'}
          alt={isAuthenticated && user ? `${user.username}'s avatar` : 'Profile avatar'}
          width={28}
          height={28}
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
    </div>
  );
}
