"use client";

import { PlayIcon } from "@heroicons/react/24/solid";

interface PlayTrailerButtonProps {
  onClick: () => void;
}

export default function PlayTrailerButton({ onClick }: PlayTrailerButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className="flex items-center justify-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-sm text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all min-w-[160px]"
    >
      <PlayIcon className="h-4 w-4 text-[#3b82f6] fill-[#3b82f6]" />
      <span>Trailer</span>
    </button>
  );
}