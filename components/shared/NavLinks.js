'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavLinks = ({ user }) => {

  const pathname = usePathname();

  return (
    <div className="max-md:hidden flex gap-3 bg-light-2 rounded-full p-1">
      <Link href="/learn"
        className={`py-2 px-6 font-medium transition-all duration-300 hover:bg-purple-500/20 hover:text-purple-300 hover:scale-105 hover:shadow-lg rounded-full ${(pathname === '/learn' || pathname.startsWith('/courses')) && 'bg-dark-1 text-white rounded-full'}`}>
        Learn
      </Link>
      <Link href="/problems-new"
        className={`py-2 px-6 font-medium transition-all duration-300 hover:bg-purple-500/20 hover:text-purple-300 hover:scale-105 hover:shadow-lg rounded-full ${pathname === '/problems-new' && 'bg-dark-1 text-white rounded-full'}`}>
        Problems
      </Link>
      <Link href="/contests"
        className={`py-2 px-6 font-medium transition-all duration-300 hover:bg-purple-500/20 hover:text-purple-300 hover:scale-105 hover:shadow-lg rounded-full ${pathname === '/contests' && 'bg-dark-1 text-white rounded-full'}`}>
        Contest
      </Link>
      <Link href="/interview"
        className={`py-2 px-6 font-medium transition-all duration-300 hover:bg-purple-500/20 hover:text-purple-300 hover:scale-105 hover:shadow-lg rounded-full ${pathname === '/interview' && 'bg-dark-1 text-white rounded-full'}`}>
        Interview
      </Link>
      <Link href="/news"
        className={`py-2 px-6 font-medium transition-all duration-300 hover:bg-purple-500/20 hover:text-purple-300 hover:scale-105 hover:shadow-lg rounded-full ${pathname === '/news' && 'bg-dark-1 text-white rounded-full'}`}>
        News
      </Link>
      <Link href="/premium"
        className={`py-2 px-6 font-bold transition-all duration-300 hover:scale-110 hover:shadow-xl rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-black hover:from-yellow-500 hover:via-orange-600 hover:to-pink-600 ${pathname === '/premium' && 'ring-2 ring-white'}`}>
        ⭐ Premium
      </Link>
    </div>
  );
};

export default NavLinks;
