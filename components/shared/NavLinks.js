'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavLinks = ({ user }) => {
  const pathname = usePathname();

  const links = [
    { href: '/learn', label: 'Learn', match: (p) => p === '/learn' || p.startsWith('/courses') },
    { href: '/problems-new', label: 'Problems', match: (p) => p === '/problems-new' },
    { href: '/contests', label: 'Contest', match: (p) => p === '/contests' },
    { href: '/interview', label: 'Interview', match: (p) => p === '/interview' },
    { href: '/news', label: 'News', match: (p) => p === '/news' },
  ];

  return (
    <div
      className="max-md:hidden flex gap-1 rounded-full p-1"
      style={{
        backgroundColor: 'var(--surface-raised)',
        border: '1px solid var(--border-primary)',
      }}
    >
      {links.map(({ href, label, match }) => {
        const active = match(pathname);
        return (
          <Link
            key={href}
            href={href}
            className={`py-2 px-5 text-sm font-medium transition-all duration-200 rounded-full ${
              active
                ? 'text-white shadow-sm'
                : 'hover:opacity-80'
            }`}
            style={
              active
                ? { background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' }
                : { color: 'var(--text-secondary)' }
            }
          >
            {label}
          </Link>
        );
      })}
      <Link
        href="/premium"
        className={`py-2 px-5 text-sm font-semibold transition-all duration-200 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-gray-900 hover:from-amber-500 hover:to-orange-600 hover:shadow-md ${
          pathname === '/premium' ? 'ring-2 ring-amber-400/50' : ''
        }`}
      >
        Premium
      </Link>
    </div>
  );
};

export default NavLinks;
