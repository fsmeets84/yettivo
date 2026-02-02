"use client";

import { useWatchlist } from "@/context/WatchlistContext";
import { PlusIcon, CheckIcon } from "@heroicons/react/24/outline";

interface WatchlistItem {
  tmdbId: number;
  title: string;
  posterPath: string | null;
  type: 'movie' | 'tv';
  voteAverage: number;
}

export default function AddToWatchlistButton({ item }: { item: WatchlistItem }) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const added = isInWatchlist(item.tmdbId);

  const handleToggle = () => {
    if (added) {
      // FIX: Voeg item.type toe als tweede argument om de TypeScript error op te lossen
      removeFromWatchlist(item.tmdbId, item.type);
    } else {
      addToWatchlist(item);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`group relative flex items-center gap-3 px-8 py-4 rounded-2xl transition-all duration-500 border ${
        added 
          ? "bg-purple-500/20 border-purple-500/40 text-purple-400" 
          : "glass-card border-white/10 text-white hover:border-purple-500/50"
      }`}
    >
      <div className="relative flex items-center justify-center w-5 h-5">
        {added ? (
          <CheckIcon className="w-5 h-5 animate-in zoom-in duration-300" />
        ) : (
          <PlusIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        )}
      </div>
      
      <div className="flex flex-col items-start">
        <span className="text-[10px] font-black text-purple-500 uppercase tracking-[0.2em] leading-none mb-1">
          {added ? "Stored" : "Archive"}
        </span>
        <span className="text-sm font-bold uppercase tracking-widest">
          {added ? "In Watchlist" : "Add to list"}
        </span>
      </div>
    </button>
  );
}