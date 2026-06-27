'use client';

import { useState } from "react";
import { usePathname } from "next/navigation";
import FloatingToolbar from "./FloatingToolbar";
import UserProfileDropdown from "./UserProfileDropdown";
import "./ToolbarGroup.css";

const NAV_VISIBLE_ROUTES = ['/', '/news', '/activities'];

export default function ToolbarGroup() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const pathname = usePathname();
  const showNavLinks = pathname ? NAV_VISIBLE_ROUTES.includes(pathname) : false;

  return (
    <div className="toolbar-group-container">
      <FloatingToolbar
        onProfileClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        showNavLinks={showNavLinks}
      />
      <UserProfileDropdown
        isOpen={isProfileMenuOpen}
        onClose={() => setIsProfileMenuOpen(false)}
      />
    </div>
  );
}
