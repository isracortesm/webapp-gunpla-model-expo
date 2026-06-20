'use client';

import { useState } from "react";
import { useAuth } from "@/features/auth/context/auth-context";
import FloatingToolbar from "./FloatingToolbar";
import UserProfileDropdown from "./UserProfileDropdown";
import "./ToolbarGroup.css";

export default function ToolbarGroup() {
  const { user, isAuthenticated } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <div className="toolbar-group-container">
      <FloatingToolbar onProfileClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} />
      {isAuthenticated && user && (
        <UserProfileDropdown
          isOpen={isProfileMenuOpen}
          onClose={() => setIsProfileMenuOpen(false)}
        />
      )}
    </div>
  );
}
