"use client";

import { useWatchlist } from "@/context/WatchlistContext";
import { useSession } from "next-auth/react";
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
  TrashIcon,
  QueueListIcon
} from "@heroicons/react/24/outline";
import { EyeIcon as EyeSolid } from "@heroicons/react/24/solid";

export default function WatchlistPage() {
  const { watchlist, removeFromWatchlist, isMovieWatched, toggleWatched } = useWatchlist();
  const { status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const isLoggedIn = status === "authenticated";

  useEffect(() => {
    setMounted(true);
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (!mounted || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c]">
        <div className="h-6 w-6 border-2 border-[#3b82f6]/20 border-t-[#3b82f6] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) return null;

  return (
    <main className="min-h-screen bg-[#0a0a0c] pt-32 pb-20 relative overflow-hidden">
      {/* Achtergrond Gloed (Blauw voor Watchlist) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[#3b82f6]/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-8 relative z-10">
        
        {/* Header Section */}
        <header className="mb-16 space-y-4 max-w-2xl animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="flex items-center gap-2 text-[#3b82f6]">
            <QueueListIcon className="h-4 w-4" />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">Archive System</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
            Watchlist
          </h1>
          <div className="flex items-center gap-4">
            <p className="text-[10px] font-black text-[#3b82f6] tracking-widest uppercase py-1 px-3 border border-[#3b82f6]/20 bg-[#3b82f6]/5 rounded-sm">
              {watchlist.length} {watchlist.length === 1 ? 'Stored Item' : 'Stored Items'}
            </p>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
          </div>
        </header>

        {watchlist.length === 0 ? (
          <div className="py-32 text-center border border-dashed border-white/5 rounded-sm bg-white/[0.01] backdrop-blur-sm animate-in fade-in zoom-in-95 duration-700">
            <BookmarkIcon className="h-10 w-10 text-zinc-800 mx-auto mb-6" />
            <p className="text-zinc-500 text-[11px] font-bold tracking-[0.2em] uppercase leading-relaxed text-center whitespace-pre-line">
              Your watchlist is empty {"\n"} Start adding some movies or shows
            </p>
            <Link 
              href="/" 
              className="mt-8 inline-flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest border border-white/10 px-6 py-3 hover:bg-[#3b82f6] hover:border-[#3b82f6] transition-all duration-300 rounded-sm group shadow-lg shadow-blue-900/20"
            >
              <ArrowLeftIcon className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
              Browse Movies & Shows
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {watchlist.map((item) => {
              const watched = isMovieWatched(item.tmdbId);
              const hasProgress = item.type === 'tv' && (item.watchedEpisodes?.length ?? 0) > 0;
              const currentPoster = item.posterPath || (item as any).poster_path;

              return (
                <div key={`${item.type}-${item.tmdbId}`} className="group space-y-4">
                  <div className="relative aspect-[2/3] overflow-hidden transition-all duration-500 rounded-sm border border-white/10 bg-zinc-900 group-hover:border-[#3b82f6]/50 shadow-2xl">
                    
                    <Link href={`/${item.type}/${item.tmdbId}`} className="block w-full h-full relative z-10">
                      <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                        {currentPoster ? (
                          <Image 
                            src={`https://image.tmdb.org/t/p/w500${currentPoster}`} 
                            alt={item.title} 
                            fill 
                            priority={false}
                            className={`object-cover transition-all duration-500 ${watched ? 'opacity-20 grayscale' : 'opacity-90 group-hover:opacity-100'}`} 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-zinc-700 uppercase">No Image</div>
                        )}
                      </div>
                    </Link>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 z-20 pointer-events-none" />

                    {/* Status Badge */}
                    <div className="absolute bottom-3 left-3 z-30">
                      {watched ? (
                        <span className="px-2 py-1 bg-[#10b981]/20 border border-[#10b981]/40 text-[#10b981] text-[8px] font-black uppercase tracking-tighter rounded-[1px] backdrop-blur-md">Completed</span>
                      ) : hasProgress ? (
                        <span className="px-2 py-1 bg-orange-500 text-white text-[8px] font-black uppercase tracking-tighter rounded-[1px] flex items-center gap-1 shadow-lg">
                          <PlayIcon className="h-2 w-2 fill-current" /> In Progress
                        </span>
                      ) : null}
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      <button
                        onClick={() => removeFromWatchlist(item.tmdbId, item.type)}
                        className="p-2 bg-black/60 backdrop-blur-md text-white/70 rounded-sm border border-white/10 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-xl"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                      
                      {item.type === 'movie' && (
                        <button
                          onClick={() => toggleWatched(item.tmdbId)}
                          className={`p-2 rounded-sm backdrop-blur-md border transition-all ${
                            watched 
                              ? "bg-[#10b981] border-[#10b981] text-white" 
                              : "bg-black/60 border-white/10 text-white hover:bg-[#3b82f6] hover:border-[#3b82f6]"
                          }`}
                        >
                          {watched ? <EyeSolid className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                        </button>
                      )}
                    </div>
                    
                    {/* Rating Tag */}
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-sm bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1 z-30">
                      <StarIcon className="h-3.5 w-3.5 text-[#3b82f6] fill-[#3b82f6]" />
                      <span className="text-[11px] font-black text-white">{item.voteAverage > 0 ? item.voteAverage.toFixed(1) : "N/A"}</span>
                    </div>
                  </div>

                  <div className="px-1">
                    <h2 className="text-[13px] font-bold text-white truncate tracking-tight group-hover:text-[#3b82f6] transition-colors leading-tight">
                      {item.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-black text-[#3b82f6]/60 tracking-[0.2em] uppercase">
                        {item.type === 'tv' ? 'Series' : 'Archive Entry'}
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