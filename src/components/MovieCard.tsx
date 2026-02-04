"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWatchlist } from "@/context/WatchlistContext";
import { useSession } from "next-auth/react";
import ConfirmModal from "./ConfirmModal";
import { useState } from "react";
import { 
  EyeIcon,
  StarIcon,
  BookmarkIcon as BookmarkOutline
} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid, EyeIcon as EyeSolid } from "@heroicons/react/24/solid";

const MovieCard = memo(function MovieCard({ id, title, posterPath, voteAverage, type }: any) {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  const { 
    removeFromWatchlist, 
    addToWatchlist, 
    isInWatchlist, 
    isMovieWatched, 
    toggleWatched, 
    toggleAllEpisodesWatched,
    watchlist // We halen de watchlist array binnen om re-renders te forceren
  } = useWatchlist();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Deze waarden zijn nu direct afhankelijk van de 'watchlist' state in de context
  const inWatchlist = isInWatchlist(id);
  const isWatched = isMovieWatched(id);

  const handleToggleWatchlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWatchlist) {
      await removeFromWatchlist(id, type);
    } else {
      await addToWatchlist({ 
        tmdbId: Number(id), 
        title, 
        posterPath, 
        voteAverage, 
        type 
      });
    }
  };

  const handleToggleWatched = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (type === 'movie') {
      await toggleWatched(id, { title, posterPath, voteAverage });
    } else {
      setIsModalOpen(true);
    }
  };

  const handleConfirmAllWatched = async () => {
    setIsModalOpen(false);
    await toggleAllEpisodesWatched(id, { 
      title, 
      posterPath, 
      voteAverage,
      forceUnwatch: isWatched 
    } as any);
  };

  return (
    <>
      <div className="group space-y-3 relative outline-none">
        <div className={`relative aspect-[2/3] overflow-hidden rounded-sm border transition-all duration-300 ${
          isLoggedIn && inWatchlist ? 'border-[#3b82f6]/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'border-white/10'
        } bg-[#141414]`}>
          
          <Link href={`/${type}/${id}`} className="block w-full h-full relative z-0">
            {posterPath ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${posterPath}`}
                alt={title || ""}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                className={`object-cover transition-all duration-500 ${isLoggedIn && isWatched ? 'opacity-30 grayscale' : 'opacity-90 group-hover:opacity-100'}`}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-600 text-[10px] font-bold uppercase tracking-widest bg-zinc-900">No Image</div>
            )}
          </Link>

          {isLoggedIn && (
            <div className="absolute top-2 left-2 flex gap-1.5 z-50">
              <button
                type="button"
                onClick={handleToggleWatchlist}
                className={`p-1.5 rounded-sm border backdrop-blur-md transition-all duration-300 pointer-events-auto ${
                  inWatchlist 
                    ? 'bg-[#3b82f6] border-[#3b82f6] text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]' 
                    : 'bg-black/40 border-white/10 text-white/70 hover:text-white hover:border-white/30'
                }`}
              >
                {inWatchlist ? <BookmarkSolid className="h-3.5 w-3.5" /> : <BookmarkOutline className="h-3.5 w-3.5 stroke-[2px]" />}
              </button>

              <button
                type="button"
                onClick={handleToggleWatched}
                className={`p-1.5 rounded-sm border backdrop-blur-md transition-all duration-300 pointer-events-auto ${
                  isWatched 
                    ? 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                    : 'bg-black/40 border-white/10 text-white/70 hover:text-white hover:border-white/30'
                }`}
              >
                {isWatched ? <EyeSolid className="h-3.5 w-3.5" /> : <EyeIcon className="h-3.5 w-3.5 stroke-[2px]" />}
              </button>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 pointer-events-none flex justify-end">
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-sm border border-white/5">
              <StarIcon className="h-3 w-3 text-[#3b82f6] fill-[#3b82f6]" />
              <span className="text-[11px] font-black text-white">{voteAverage > 0 ? voteAverage.toFixed(1) : "N/A"}</span>
            </div>
          </div>
        </div>

        <div className="space-y-1 px-0.5">
          <h3 className={`text-sm font-bold truncate transition-colors tracking-tight ${isLoggedIn && inWatchlist ? 'text-[#3b82f6]' : 'text-zinc-200 group-hover:text-white'}`}>
            {title}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.15em]">
              {type === 'movie' ? 'Movie' : 'TV Series'}
            </span>
            {isLoggedIn && inWatchlist && <span className="h-1 w-1 rounded-full bg-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
          </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={isModalOpen}
        title={isWatched ? "Remove completion" : "Mark as Completed"}
        message={isWatched 
          ? `Do you want to remove the completed status for "${title}"?`
          : `Do you want to mark all episodes of "${title}" as completed?`}
        onConfirm={handleConfirmAllWatched}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  );
});

export default MovieCard;