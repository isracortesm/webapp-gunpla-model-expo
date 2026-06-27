import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/features/auth/context/auth-context";
import "./FloatingToolbar.css";

interface FloatingToolbarProps {
  onProfileClick?: () => void;
  showNavLinks?: boolean;
}

export default function FloatingToolbar({ onProfileClick, showNavLinks = false }: FloatingToolbarProps) {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="floating-toolbar">
      <button
        onClick={onProfileClick}
        aria-label="Profile"
        className="floating-toolbar__profile-link object-cover rounded-full ring-1 ring-zinc-600/50 transition-transform hover:scale-110 cursor-pointer bg-transparent border-none p-0"
      >
        <Image
          src={isAuthenticated && user ? user.profileImage?.thumbnailUrl || user.profileImage?.url || '/globe.svg' : '/globe.svg'}
          alt={isAuthenticated && user ? `${user.username}'s avatar` : 'Profile avatar'}
          width={28}
          height={28}
          className={`object-cover rounded-full ${!isAuthenticated ? 'opacity-50' : ''}`}
        />
      </button>

      {showNavLinks && (
        <div className="flex items-center gap-2">
          <Link href="/news" className="floating-toolbar__nav-btn--secondary">
            News
          </Link>
          <Link href="/activities" className="floating-toolbar__nav-btn--primary">
            Activities
          </Link>
        </div>
      )}
    </div>
  );
}
