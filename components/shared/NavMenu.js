'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { FaGraduationCap, FaPuzzlePiece, FaTrophy, FaBriefcase, FaNewspaper, FaStar } from 'react-icons/fa';

const links = [
  { href: '/learn', label: 'Learn', icon: <FaGraduationCap />, match: (p) => p === '/learn' || p.startsWith('/courses') },
  { href: '/problems-new', label: 'Problems', icon: <FaPuzzlePiece />, match: (p) => p === '/problems-new' },
  { href: '/contests', label: 'Contest', icon: <FaTrophy />, match: (p) => p === '/contests' },
  { href: '/interview', label: 'Interview', icon: <FaBriefcase />, match: (p) => p === '/interview' },
  { href: '/news', label: 'News', icon: <FaNewspaper />, match: (p) => p === '/news' },
];

const NavMenu = ({ user }) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <div className="md:hidden" ref={menuRef}>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 max-sm:w-8 max-sm:h-8 flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-105"
        style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-primary)' }}
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          style={{ color: 'var(--text-primary)' }}>
          {open ? (
            <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
          ) : (
            <><line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" /></>
          )}
        </svg>
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
      )}

      {/* Dropdown Menu */}
      <div
        className={`fixed z-50 top-4 right-4 w-[280px] rounded-2xl p-5 transform transition-all duration-300 ease-out ${open ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 -translate-y-2 pointer-events-none'}`}
        style={{
          backgroundColor: 'var(--surface-base)',
          border: '1px solid var(--border-primary)',
          boxShadow: 'var(--shadow-xl)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          className="ml-auto flex items-center justify-center w-8 h-8 rounded-lg mb-4 transition-colors duration-200"
          style={{ backgroundColor: 'var(--surface-raised)' }}
          aria-label="Close menu"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
            style={{ color: 'var(--text-secondary)' }}>
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Links */}
        <div className="space-y-1">
          {links.map(({ href, label, icon, match }) => {
            const active = match(pathname);
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 py-3 px-4 rounded-xl text-base font-semibold transition-all duration-200 hover:scale-[1.02]"
                style={{
                  backgroundColor: active ? 'var(--accent)' : 'transparent',
                  color: active ? '#ffffff' : 'var(--text-primary)',
                  boxShadow: active ? 'var(--shadow-md)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.backgroundColor = 'var(--surface-raised)';
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={() => setOpen(false)}
              >
                <span className="text-lg">{icon}</span>
                {label}
              </Link>
            );
          })}

          {/* Premium link - special styling */}
          <Link
            href="/premium"
            className="flex items-center gap-3 py-3 px-4 rounded-xl text-base font-bold transition-all duration-200 hover:scale-[1.03] mt-2"
            style={{
              background: pathname === '/premium'
                ? 'linear-gradient(135deg, #f59e0b, #ef4444)'
                : 'linear-gradient(135deg, #f59e0b, #f97316, #ec4899)',
              color: '#000000',
              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)',
            }}
            onClick={() => setOpen(false)}
          >
            <FaStar className="text-lg" />
            Premium
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavMenu;
