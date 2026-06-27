'use client';

import { useState } from "react";
import { useAuth } from "@/features/auth/context/auth-context";
import FloatingToolbar from "./FloatingToolbar";
import UserProfileDropdown from "./UserProfileDropdown";
import "./ToolbarGroup.css";

export default function ToolbarGroup() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <div className="toolbar-group-container">
      <FloatingToolbar onProfileClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} />
      <UserProfileDropdown
        isOpen={isProfileMenuOpen}
        onClose={() => setIsProfileMenuOpen(false)}
      />
    </div>
  );
}
