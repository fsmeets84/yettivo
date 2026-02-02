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
  ChevronRightIcon
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
    return watchlist.filter(item => 
      item.type === 'tv' && 
      (item.watchedEpisodes?.length ?? 0) > 0 && 
      !isMovieWatched(item.tmdbId)
    );
  }, [watchlist, isLoggedIn, isMovieWatched]);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
      <div className="h-6 w-6 border-2 border-[#3b82f6]/20 border-t-[#3b82f6] rounded-full animate-spin" />
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0a0a0c] pt-32 pb-20 relative overflow-hidden">
      <div className="container mx-auto px-8 relative z-10">
        {isLoggedIn && continueWatching.length > 0 && (
          <section className="mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-3 text-orange-500 mb-8">
              <ArrowPathIcon className="h-4 w-4 animate-spin-slow" />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase">Resume mission</span>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
              {continueWatching.map((show) => (
                <Link key={`resume-tv-${show.tmdbId}`} href={`/tv/${show.tmdbId}`} className="flex-shrink-0 group w-[320px]">
                  <div className="relative aspect-video rounded-[2px] overflow-hidden border border-white/5 bg-zinc-900 transition-all duration-500 group-hover:border-orange-500/50 group-hover:shadow-[0_0_40px_rgba(249,115,22,0.15)]">
                    <Image src={`https://image.tmdb.org/t/p/w500${show.posterPath}`} alt={show.title} fill className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest block mb-1">
                        {show.watchedEpisodes?.length} Episodes logged
                      </span>
                      <h3 className="text-sm font-bold text-white tracking-tight truncate">{show.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <header className="mb-12">
          <div className="flex items-center gap-2 text-[#3b82f6] mb-2">
            <TvIcon className="h-4 w-4" />
            <span className="text-[10px] font-bold tracking-widest uppercase">Broadcast archive</span>
          </div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">Popular series</h1>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {series.map((show) => (
            <MovieCard key={`tv-popular-${show.id}`} id={show.id} title={show.name} posterPath={show.poster_path} voteAverage={show.vote_average} type="tv" />
          ))}
        </div>
      </div>
    </main>
  );
}