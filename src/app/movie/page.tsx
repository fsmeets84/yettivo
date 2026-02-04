"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWatchlist } from "@/context/WatchlistContext";
import { useSession } from "next-auth/react";
import MovieCard from "@/components/MovieCard";
import { 
  FilmIcon, 
  ArrowPathIcon,
  PlayIcon
} from "@heroicons/react/24/outline";

export default function MoviesPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { status } = useSession();
  const isLoggedIn = status === "authenticated";
  const { watchlist, isMovieWatched } = useWatchlist();

  useEffect(() => {
    const fetchPopular = async () => {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
        );
        const data = await res.json();
        setMovies(data.results || []);
      } catch (error) {
        console.error("Error fetching Movie data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, []);

  // Filter films die "in progress" zijn en verwijder dubbele ID's
  const continueWatching = useMemo(() => {
    if (!isLoggedIn) return [];
    
    const filtered = watchlist
      .filter(item => 
        item.type === 'movie' && 
        item.inProgress === true && 
        !isMovieWatched(item.tmdbId)
      )
      .sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.addedAt || 0).getTime();
        const dateB = new Date(b.updatedAt || b.addedAt || 0).getTime();
        return dateB - dateA;
      });

    // Deduplicatie check
    const uniqueMap = new Map();
    filtered.forEach(item => {
      if (!uniqueMap.has(item.tmdbId)) {
        uniqueMap.set(item.tmdbId, item);
      }
    });

    return Array.from(uniqueMap.values());
  }, [watchlist, isLoggedIn, isMovieWatched]);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
      <div className="h-6 w-6 border-2 border-[#3b82f6]/20 border-t-[#3b82f6] rounded-full animate-spin" />
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0a0a0c] pt-32 pb-20 relative overflow-hidden">
      <div className="container mx-auto px-8 relative z-10">
        
        {/* Continue Watching Grid (Gelijk aan TV Page) */}
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
                {continueWatching.length} movies
              </span>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {continueWatching.map((movie) => (
                <Link 
                  key={`continue-movie-${movie.tmdbId}`} 
                  href={`/movie/${movie.tmdbId}`} 
                  className="group relative bg-zinc-900/50 border border-white/5 rounded-sm overflow-hidden hover:border-orange-500/40 transition-all duration-500"
                >
                  <div className="aspect-video relative overflow-hidden bg-zinc-800">
                    <Image 
                      src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`} 
                      alt={movie.title} 
                      fill 
                      className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="p-3 bg-orange-500 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.5)]">
                        <PlayIcon className="h-6 w-6 text-white fill-current" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-white font-bold text-sm mb-1 truncate tracking-tight">{movie.title || "Unknown Title"}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                        Resume Playback
                      </span>
                      <div className="h-1 w-12 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 w-1/2 animate-pulse" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Popular Movie Archive */}
        <header className="mb-12 border-b border-white/5 pb-8">
          <div className="flex items-center gap-2 text-[#3b82f6] mb-2">
            <FilmIcon className="h-4 w-4" />
            <span className="text-[10px] font-bold tracking-widest uppercase">Movie archive</span>
          </div>
          <h1 className="text-3xl font-semibold text-white tracking-tight leading-none">Popular movies</h1>
          <p className="text-sm text-zinc-500 mt-2">Explore the most indexed titles across the cinema database</p>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <MovieCard 
              key={`movie-popular-${movie.id}`} 
              id={movie.id} 
              title={movie.title} 
              posterPath={movie.poster_path} 
              voteAverage={movie.vote_average} 
              type="movie" 
            />
          ))}
        </div>
      </div>
    </main>
  );
}