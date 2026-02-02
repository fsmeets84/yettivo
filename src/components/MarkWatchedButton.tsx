"use client";

import { useSession } from "next-auth/react";
import { EyeIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckSolid } from "@heroicons/react/24/solid";

interface MarkWatchedProps {
  onMark: () => void; 
  isWatched: boolean;
}

export default function MarkWatchedButton({ onMark, isWatched }: MarkWatchedProps) {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  if (!isLoggedIn) return null;

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        onMark();
      }}
      className={`flex items-center justify-center gap-3 px-8 py-4 rounded-sm border text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 min-w-[180px] ${
        isWatched 
          ? "bg-[#10b981]/10 border-[#10b981]/40 text-[#10b981]" 
          : "bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-white/30"
      }`}
    >
      {isWatched ? (
        <>
          <CheckSolid className="h-4 w-4" />
          <span>Watched</span>
        </>
      ) : (
        <>
          <EyeIcon className="h-4 w-4" />
          <span>Mark as Watched</span>
        </>
      )}
    </button>
  );
}