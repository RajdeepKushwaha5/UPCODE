'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavLinks = ({ user }) => {

  const pathname = usePathname();

  return (
    <div className="max-md:hidden flex gap-2 theme-surface-elevated rounded-full p-1.5 border theme-border">
      <Link href="/learn"
        className={`py-2 px-6 font-medium transition-all duration-200 rounded-full ${
          (pathname === '/learn' || pathname.startsWith('/courses')) 
            ? 'bg-blue-600 text-white' 
            : 'theme-text hover:theme-surface-elevated'
        }`}>
        Learn
      </Link>
      <Link href="/problems-new"
        className={`py-2 px-6 font-medium transition-all duration-200 rounded-full ${
          pathname === '/problems-new' 
            ? 'bg-blue-600 text-white' 
            : 'theme-text hover:theme-surface-elevated'
        }`}>
        Problems
      </Link>
      <Link href="/contests"
        className={`py-2 px-6 font-medium transition-all duration-200 rounded-full ${
          pathname === '/contests' 
            ? 'bg-blue-600 text-white' 
            : 'theme-text hover:theme-surface-elevated'
        }`}>
        Contest
      </Link>
      <Link href="/interview"
        className={`py-2 px-6 font-medium transition-all duration-200 rounded-full ${
          pathname === '/interview' 
            ? 'bg-blue-600 text-white' 
            : 'theme-text hover:theme-surface-elevated'
        }`}>
        Interview
      </Link>
      <Link href="/news"
        className={`py-2 px-6 font-medium transition-all duration-200 rounded-full ${
          pathname === '/news' 
            ? 'bg-blue-600 text-white' 
            : 'theme-text hover:theme-surface-elevated'
        }`}>
        News
      </Link>
      <Link href="/premium"
        className={`py-2 px-6 font-semibold transition-all duration-200 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-500 hover:to-orange-600 ${
          pathname === '/premium' && 'ring-2 ring-blue-500'
        }`}>
        ⭐ Premium
      </Link>
    </div>
  );
};

export default NavLinks;
