"use client";

import { useEffect, useState } from "react";
import MovieCard from "@/components/MovieCard";
import FilterBar from "@/components/FilterBar";
import { 
  TicketIcon
} from "@heroicons/react/24/outline";

export default function MoviesPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ genre: "", year: "", sort: "popularity.desc" });

  useEffect(() => {
    const fetchMovies = async () => {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      try {
        setLoading(true);
        const genreParam = filters.genre ? `&with_genres=${filters.genre}` : "";
        const yearParam = filters.year ? `&primary_release_year=${filters.year}` : "";
        const sortParam = `&sort_by=${filters.sort}`;
        
        const res = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US${genreParam}${yearParam}${sortParam}&page=1&include_adult=false`
        );
        const data = await res.json();
        setMovies(data.results || []);
      } catch (error) {
        console.error("Error fetching Movie data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [filters]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0c] pt-32 pb-20 relative overflow-hidden">
      {/* Subtiele achtergrond gloed conform de rest van het platform */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-8 relative z-10 max-w-[1800px]">
        
        {/* Movie Library Header */}
        <header className="mb-12 border-b border-white/5 pb-8 animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="flex items-center gap-2 text-[#3b82f6] mb-2">
            <TicketIcon className="h-4 w-4" />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">Archive</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter leading-none uppercase">
            Movie Library
          </h1>
          <p className="text-sm text-zinc-500 mt-4 max-w-xl font-medium leading-relaxed">
            Explore the complete cinema database with advanced filtering, sorting capabilities, and curate your personal archive.
          </p>
        </header>

        <FilterBar type="movie" onFilterChange={handleFilterChange} />

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-white/[0.03] border border-white/10 rounded-sm animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {movies.map((movie) => (
              <MovieCard 
                key={`movie-discover-${movie.id}`} 
                id={movie.id} 
                title={movie.title} 
                posterPath={movie.poster_path} 
                voteAverage={movie.vote_average} 
                type="movie" 
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}