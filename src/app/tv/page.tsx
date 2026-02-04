"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWatchlist } from "@/context/WatchlistContext";
import { useSession } from "next-auth/react";
import MovieCard from "@/components/MovieCard";
import { 
  TvIcon, 
  ArrowPathIcon,
  PlayIcon
} from "@heroicons/react/24/outline";

export default function TvShowsPage() {
  const [series, setSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { status } = useSession();
  const isLoggedIn = status === "authenticated";
  const { watchlist, isMovieWatched } = useWatchlist();

  useEffect(() => {
    const fetchPopular = async () => {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US&page=1`
        );
        const data = await res.json();
        setSeries(data.results || []);
      } catch (error) {
        console.error("Error fetching TV data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, []);

  const continueWatching = useMemo(() => {
    if (!isLoggedIn) return [];
    
    return watchlist
      .filter(item => {
        const isTv = item.type === 'tv';
        const hasProgress = item.inProgress === true || (item.watchedEpisodes?.length ?? 0) > 0;
        const notFinished = !isMovieWatched(item.tmdbId);
        return isTv && hasProgress && notFinished;
      })
      .sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.addedAt || 0).getTime();
        const dateB = new Date(b.updatedAt || b.addedAt || 0).getTime();
        return dateB - dateA;
      });
  }, [watchlist, isLoggedIn, isMovieWatched]);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
      <div className="h-6 w-6 border-2 border-[#3b82f6]/20 border-t-[#3b82f6] rounded-full animate-spin" />
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0a0a0c] pt-32 pb-20 relative overflow-hidden">
      <div className="container mx-auto px-8 relative z-10">
        
        {/* Continue Watching Grid */}
        {isLoggedIn && continueWatching.length > 0 && (
          <section className="mb-20">
            <header className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-sm">
                  <ArrowPathIcon className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-orange-500">Currently watching</h2>
                  <p className="text-white font-bold text-xl tracking-tight">Continue Watching</p>
                </div>
              </div>
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
                {continueWatching.length} TV Shows
              </span>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {continueWatching.map((show) => (
                <Link 
                  key={`continue-tv-${show.tmdbId}`} 
                  href={`/tv/${show.tmdbId}`} 
                  className="group relative bg-zinc-900/50 border border-white/5 rounded-sm overflow-hidden hover:border-orange-500/40 transition-all duration-500"
                >
                  <div className="aspect-video relative overflow-hidden bg-zinc-800">
                    {show.posterPath ? (
                      <Image 
                        src={`https://image.tmdb.org/t/p/w500${show.posterPath}`} 
                        alt={show.title || "TV Show"} 
                        fill 
                        className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] uppercase font-black text-zinc-600">No Signal</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="p-3 bg-orange-500 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.5)]">
                        <PlayIcon className="h-6 w-6 text-white fill-current" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    {/* AANGEPAST: Geen .name fallback meer om TS error te voorkomen */}
                    <h3 className="text-white font-bold text-sm mb-1 truncate tracking-tight">
                      {show.title || "Classified Mission"}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                        {show.watchedEpisodes?.length || 0} Episodes Intercepted
                      </span>
                      <div className="h-1 w-12 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 w-1/3 animate-pulse" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Popular Series Archive */}
        <header className="mb-12 border-b border-white/5 pb-8">
          <div className="flex items-center gap-2 text-[#3b82f6] mb-2">
            <TvIcon className="h-4 w-4" />
            <span className="text-[10px] font-bold tracking-widest uppercase">Broadcast archive</span>
          </div>
          <h1 className="text-3xl font-semibold text-white tracking-tight leading-none">Popular series</h1>
          <p className="text-sm text-zinc-500 mt-2">Browse the most intercepted signals in the database</p>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {series.map((show) => (
            <MovieCard 
              key={`tv-popular-${show.id}`} 
              id={show.id} 
              title={show.name} 
              posterPath={show.poster_path} 
              voteAverage={show.vote_average} 
              type="tv" 
            />
          ))}
        </div>
      </div>
    </main>
  );
}