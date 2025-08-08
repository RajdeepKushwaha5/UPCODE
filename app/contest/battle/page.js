"use client";
import { Suspense } from 'react';
import ContestBattleArena from '@/components/contests/ContestBattleArena';
import { FaSpinner } from 'react-icons/fa';

const ContestBattlePage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-6xl text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Loading battle arena...</p>
        </div>
      </div>
    }>
      <ContestBattleArena />
    </Suspense>
  );
};

export default ContestBattlePage;
