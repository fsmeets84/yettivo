"use client";

import { useState } from "react";
import { useSession } from "next-auth/react"; // Gebruik NextAuth i.p.v. je oude AuthContext
import { useWatchlist } from "@/context/WatchlistContext";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid } from "@heroicons/react/24/solid";

interface WatchlistButtonProps {
  id: number; // In je DetailPage geef je 'id' mee
  title: string;
  posterPath: string | null;
  voteAverage: number;
  type: "movie" | "tv";
}

export default function WatchlistButton({
  id,
  title,
  posterPath,
  voteAverage,
  type,
}: WatchlistButtonProps) {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";
  
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const [isUpdating, setIsUpdating] = useState(false);

  const active = isInWatchlist(id);

  // Alleen tonen als de gebruiker is ingelogd (zoals gevraagd)
  if (!isLoggedIn) return null;

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsUpdating(true);
    try {
      if (active) {
        await removeFromWatchlist(id, type);
      } else {
        await addToWatchlist({
          tmdbId: id,
          type,
          title,
          posterPath,
          voteAverage,
        });
      }
    } catch (error) {
      console.error("Failed to update watchlist:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isUpdating}
      className={`flex items-center justify-center gap-3 px-8 py-4 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 min-w-[180px] ${
        active 
          ? "bg-white/5 border border-white/10 text-[#3b82f6] hover:text-white" 
          : "bg-[#3b82f6] text-white shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:scale-105"
      } disabled:opacity-50`}
    >
      {isUpdating ? (
        <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      ) : active ? (
        <>
          <BookmarkSolid className="h-4 w-4" />
          <span>Watchlist</span>
        </>
      ) : (
        <>
          <BookmarkIcon className="h-4 w-4" />
          <span>Watchlist</span>
        </>
      )}
    </button>
  );
}