'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const NavMenu = ({ user }) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <img
        src="/menu.png"
        alt="menu"
        className={`w-10 h-10 max-sm:w-8 max-sm:h-8 object-contain cursor-pointer ${open && "hidden"
          }`}
        onClick={() => setOpen(true)}
      />
      <div className={`${!open && 'hidden'}`}>
        <div className={`flex flex-col absolute z-10 top-5 right-2 w-[300px] theme-bg backdrop-blur-lg border border theme-border p-4 rounded-2xl shadow-2xl transform transition-all duration-300 ease-out ${open ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <img
            src="/menu.png"
            alt="menu"
            className={`w-10 h-10 max-sm:w-8 max-sm:h-8 object-contain cursor-pointer ml-auto mb-6 hover:scale-110 transition-transform duration-200`}
            onClick={() => setOpen(false)}
          />
          <Link
            href="/learn"
            className={`py-3 px-6 font-semibold text-lg rounded-xl mb-2 transition-all duration-300 hover:bg-purple-500/20 hover:theme-text-secondary hover:scale-105 hover:shadow-lg transform ${(pathname === "/learn" || pathname.startsWith("/courses")) &&
              "bg-blue-600 text-white shadow-lg scale-105"
              }`}
            onClick={() => setOpen(false)}
          >
            ✨ Learn
          </Link>
          <Link
            href="/problems-new"
            className={`py-3 px-6 font-semibold text-lg rounded-xl mb-2 transition-all duration-300 hover:bg-purple-500/20 hover:theme-text-secondary hover:scale-105 hover:shadow-lg transform ${pathname === "/problems-new" && "bg-blue-600 text-white shadow-lg scale-105"
              }`}
            onClick={() => setOpen(false)}
          >
            🧩 Problems
          </Link>
          <Link
            href="/contests"
            className={`py-3 px-6 font-semibold text-lg rounded-xl mb-2 transition-all duration-300 hover:bg-purple-500/20 hover:theme-text-secondary hover:scale-105 hover:shadow-lg transform ${pathname === "/contests" && "bg-blue-600 text-white shadow-lg scale-105"
              }`}
            onClick={() => setOpen(false)}
          >
            🏆 Contest
          </Link>
          <Link
            href="/interview"
            className={`py-3 px-6 font-semibold text-lg rounded-xl mb-2 transition-all duration-300 hover:bg-purple-500/20 hover:theme-text-secondary hover:scale-105 hover:shadow-lg transform ${pathname === "/interview" && "bg-blue-600 text-white shadow-lg scale-105"
              }`}
            onClick={() => setOpen(false)}
          >
            💼 Interview
          </Link>
          <Link
            href="/news"
            className={`py-3 px-6 font-semibold text-lg rounded-xl mb-2 transition-all duration-300 hover:bg-purple-500/20 hover:theme-text-secondary hover:scale-105 hover:shadow-lg transform ${pathname === "/news" && "bg-blue-600 text-white shadow-lg scale-105"
              }`}
            onClick={() => setOpen(false)}
          >
            📰 News
          </Link>
          <Link
            href="/premium"
            className={`py-3 px-6 font-bold text-lg rounded-xl mb-2 transition-all duration-300 hover:scale-110 hover:shadow-2xl transform bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-black hover:from-yellow-500 hover:via-orange-600 hover:to-pink-600 shadow-lg ${pathname === "/premium" && "ring-2 ring-white scale-105"
              }`}
            onClick={() => setOpen(false)}
          >
            ⭐ Premium
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavMenu;
