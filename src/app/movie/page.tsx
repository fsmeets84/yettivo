"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWatchlist } from "@/context/WatchlistContext";
import { useSession } from "next-auth/react"; // Gebruik NextAuth
import MovieCard from "@/components/MovieCard"; // Importeer centrale component
import { 
  FilmIcon, 
  ArrowPathIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";

export default function MoviesPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [continueWatching, setContinueWatching] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { status } = useSession();
  const isLoggedIn = status === "authenticated";
  const { isMovieWatched } = useWatchlist();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

      try {
        // 1. Fetch Populaire Films
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
        );
        const data = await res.json();
        setMovies(data.results || []);

        // 2. Scan LocalStorage alleen als ingelogd
        if (isLoggedIn) {
          const activeMovieIds: string[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith("progress_movie_")) {
              const statusVal = JSON.parse(localStorage.getItem(key) || "false");
              if (statusVal === true) {
                activeMovieIds.push(key.replace("progress_movie_", ""));
              }
            }
          }

          if (activeMovieIds.length > 0) {
            const movieDetails = await Promise.all(
              activeMovieIds.map(async (id) => {
                const movieRes = await fetch(
                  `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`
                );
                return movieRes.json();
              })
            );
            setContinueWatching(movieDetails.filter(m => m.id && !isMovieWatched(m.id)));
          }
        } else {
          setContinueWatching([]);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn, isMovieWatched]);

  if (loading) return (
    <div className="min-h-screen bg-transparent flex items-center justify-center">
      <div className="h-6 w-6 border-2 border-[#3b82f6]/20 border-t-[#3b82f6] rounded-full animate-spin" />
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0a0a0c] pt-32 pb-20 relative overflow-hidden">
      <div className="container mx-auto px-8 relative z-10">
        
        {/* CONTINUE WATCHING HUB */}
        {isLoggedIn && continueWatching.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-3 text-orange-500 mb-8">
              <ArrowPathIcon className="h-4 w-4 animate-spin-slow" />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase">Resume playback</span>
            </div>
            
            <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
              {continueWatching.map((movie) => (
                <Link 
                  key={`continue-${movie.id}`} 
                  href={`/movie/${movie.id}`}
                  className="flex-shrink-0 group w-[320px]"
                >
                  <div className="relative aspect-video rounded-[2px] overflow-hidden border border-white/5 bg-zinc-900 transition-all duration-500 group-hover:border-orange-500/50 group-hover:shadow-[0_0_40px_rgba(249,115,22,0.15)]">
                    <Image 
                      src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path}`} 
                      alt={movie.title}
                      fill
                      className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest block mb-1">In Progress</span>
                      <h3 className="text-sm font-bold text-white tracking-tight truncate">{movie.title}</h3>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500">
                        <ChevronRightIcon className="h-6 w-6 text-white ml-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <header className="mb-12">
          <div className="flex items-center gap-2 text-[#3b82f6] mb-2">
            <FilmIcon className="h-4 w-4" />
            <span className="text-[10px] font-bold tracking-widest uppercase">Movie archive</span>
          </div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">Popular movies</h1>
          <p className="text-sm text-zinc-500 font-medium mt-1">Explore the most indexed titles across the cinema database</p>
        </header>

        {/* GRID MET MOVIECARD */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <MovieCard 
              key={movie.id}
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