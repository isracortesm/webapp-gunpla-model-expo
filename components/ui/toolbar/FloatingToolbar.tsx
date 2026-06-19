import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/features/auth/context/auth-context";
import UserProfileDropdown from "./UserProfileDropdown";
import "./FloatingToolbar.css";

export default function FloatingToolbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  return (
    <div className="floating-toolbar">
      <div className="flex items-center gap-3">
        {/* Profile Image Icon - Always show, but only navigate when logged in */}
        {isAuthenticated && user ? (
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            aria-label="Profile"
            className="floating-toolbar__profile-link object-cover rounded-full ring-1 ring-zinc-600/50 transition-transform hover:scale-110 cursor-pointer bg-transparent border-none p-0"
          >
            <Image
              src={user.profileImage?.thumbnailUrl || user.profileImage?.url || '/globe.svg'}
              alt={`${user.username}'s avatar`}
              width={28}
              height={28}
              className="object-cover rounded-full"
            />
          </button>
        ) : (
          <div aria-label="Profile placeholder">
            <Image
              src="/globe.svg"
              alt="Profile avatar"
              width={28}
              height={28}
              className="floating-toolbar__profile-link object-cover opacity-50 cursor-not-allowed"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Register Button - Only show when logged out */}
        {!isAuthenticated ? (
          <>
            <Link href="/auth/register" className="floating-toolbar__register-btn">
              Register
            </Link>

            {/* Login Button */}
            <Link href="/auth/login" className="floating-toolbar__login-btn">
              Login
            </Link>
          </>
        ) : (
          /* Logout Button - Only show when logged in */
          <button
            onClick={logout}
            className="floating-toolbar__logout-btn"
            aria-label="Logout"
          >
            Logout
          </button>
        )}
      </div>

      {/* Profile Dropdown Menu */}
      {isAuthenticated && user && (
        <UserProfileDropdown
          isOpen={isProfileMenuOpen}
          onClose={() => setIsProfileMenuOpen(false)}
        />
      )}
    </div>
  );
}
