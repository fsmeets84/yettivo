"use client";

import { useWatchlist } from "@/context/WatchlistContext";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  StarIcon, 
  BookmarkIcon, 
  EyeIcon, 
  ArrowLeftIcon, 
  PlayIcon,
  TrashIcon 
} from "@heroicons/react/24/outline";
import { EyeIcon as EyeSolid } from "@heroicons/react/24/solid";

export default function WatchlistPage() {
  const { watchlist, removeFromWatchlist, isMovieWatched, toggleWatched } = useWatchlist();
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (mounted && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router, mounted]);

  if (!mounted || !isLoggedIn) return <div className="min-h-screen bg-[#0a0a0c]" />;

  return (
    <main className="min-h-screen bg-transparent pt-32 pb-20 relative overflow-hidden">
      <div className="container mx-auto px-8 relative z-10">
        
        {/* Header Section */}
        <header className="mb-16 space-y-4 max-w-2xl">
          <div className="flex items-center gap-2 text-[#3b82f6]">
            <BookmarkIcon className="h-4 w-4" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Personal Collection</span>
          </div>
          <h1 className="text-5xl font-semibold text-white tracking-tighter leading-none">
            Watchlist
          </h1>
          <div className="flex items-center gap-4">
            <p className="text-[11px] font-bold text-zinc-500 tracking-widest uppercase py-1 px-3 border border-white/5 bg-white/[0.02] rounded-sm">
              Items: {watchlist.length}
            </p>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
          </div>
        </header>

        {watchlist.length === 0 ? (
          <div className="py-32 text-center border border-dashed border-white/5 rounded-sm bg-white/[0.01] backdrop-blur-sm">
            <BookmarkIcon className="h-10 w-10 text-zinc-800 mx-auto mb-6" />
            <p className="text-zinc-500 text-[11px] font-bold tracking-[0.2em] uppercase leading-relaxed text-center whitespace-pre-line">
              Your watchlist is empty {"\n"} Start adding some movies or shows
            </p>
            <Link 
              href="/" 
              className="mt-8 inline-flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest border border-white/10 px-6 py-3 hover:bg-white hover:text-black transition-all duration-300 rounded-sm"
            >
              <ArrowLeftIcon className="h-3 w-3" />
              Browse Media
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
            {watchlist.map((item) => {
              const watched = item.type === 'movie' ? isMovieWatched(item.tmdbId) : false;
              const hasProgress = item.type === 'tv' && item.watchedEpisodes && item.watchedEpisodes.length > 0;

              return (
                <div key={`${item.type}-${item.tmdbId}`} className="group space-y-4">
                  <div className="relative aspect-[2/3] overflow-hidden transition-all duration-500 rounded-sm border border-white/10 bg-zinc-900">
                    
                    {/* Poster Link */}
                    <Link href={`/${item.type}/${item.tmdbId}`} className="block w-full h-full relative z-10">
                      <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                        {item.posterPath ? (
                          <Image 
                            src={`https://image.tmdb.org/t/p/w500${item.posterPath}`} 
                            alt={item.title} 
                            fill 
                            className={`object-cover transition-all duration-500 ${watched ? 'opacity-30 grayscale' : 'opacity-80 group-hover:opacity-100'}`} 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-zinc-700 uppercase">No Image</div>
                        )}
                      </div>
                    </Link>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 z-20 pointer-events-none" />

                    {/* Progress Badge */}
                    <div className="absolute bottom-3 left-3 z-30">
                      {watched && (
                        <span className="px-2 py-1 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-tighter rounded-[1px]">Watched</span>
                      )}
                      {hasProgress && !watched && (
                        <span className="px-2 py-1 bg-[#3b82f6] text-white text-[8px] font-black uppercase tracking-tighter rounded-[1px] flex items-center gap-1">
                          <PlayIcon className="h-2 w-2" /> In Progress
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      <button
                        onClick={() => removeFromWatchlist(item.tmdbId, item.type)}
                        className="p-2 bg-black/60 backdrop-blur-md text-white/70 rounded-sm border border-white/10 hover:bg-red-500 hover:text-white transition-all shadow-xl"
                        title="Remove from list"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                      
                      {item.type === 'movie' && (
                        <button
                          onClick={() => toggleWatched(item.tmdbId)}
                          className={`p-2 rounded-sm backdrop-blur-md border transition-all ${
                            watched 
                              ? "bg-emerald-500 border-emerald-400 text-white" 
                              : "bg-black/60 border-white/10 text-white hover:bg-emerald-500"
                          }`}
                        >
                          {watched ? <EyeSolid className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                        </button>
                      )}
                    </div>
                    
                    {/* Rating Tag */}
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-sm bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1 z-30">
                      <StarIcon className="h-3 w-3 text-[#3b82f6] fill-[#3b82f6]" />
                      <span className="text-[10px] font-bold text-white">{item.voteAverage?.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="px-1">
                    <h2 className="text-sm font-semibold text-zinc-100 truncate tracking-tight group-hover:text-[#3b82f6] transition-colors">
                      {item.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black text-[#3b82f6] tracking-widest uppercase">
                        {item.type === 'tv' ? 'Series' : 'Movie'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}