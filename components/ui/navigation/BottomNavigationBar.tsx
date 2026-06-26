'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './BottomNavigationBar.css';

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/news', label: 'News' },
  { href: '/activities', label: 'Activities' },
];

export default function BottomNavigationBar() {
  const pathname = usePathname();

  return (
    <nav className="bottom-navigation-bar" aria-label="Main navigation">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`bottom-navigation-bar__item ${isActive ? 'bottom-navigation-bar__item--active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
