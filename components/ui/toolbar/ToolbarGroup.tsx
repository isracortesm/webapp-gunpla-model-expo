'use client';

import { useState } from "react";
import { usePathname } from "next/navigation";
import FloatingToolbar from "./FloatingToolbar";
import "./ToolbarGroup.css";

const NAV_VISIBLE_ROUTES = ['/', '/news', '/activities'];

export default function ToolbarGroup() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isVisibleRoute = pathname ? NAV_VISIBLE_ROUTES.includes(pathname) : false;
  const showNavLinks = isVisibleRoute;

  if (!isVisibleRoute) return null;

  return (
    <div className="toolbar-group-container">
      <FloatingToolbar
        onProfileClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        showNavLinks={showNavLinks}
        pathname={pathname}
        dropdownOpen={isProfileMenuOpen}
        onCloseDropdown={() => setIsProfileMenuOpen(false)}
      />
    </div>
  );
}
