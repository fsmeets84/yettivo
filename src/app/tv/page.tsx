"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import MovieCard from "@/components/MovieCard";
import FilterBar from "@/components/FilterBar";
import { 
  RectangleStackIcon
} from "@heroicons/react/24/outline";

export default function TvShowsPage() {
  const [series, setSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ genre: "", year: "", sort: "popularity.desc" });

  const { status } = useSession();

  useEffect(() => {
    const fetchSeries = async () => {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      try {
        setLoading(true);
        const genreParam = filters.genre ? `&with_genres=${filters.genre}` : "";
        const yearParam = filters.year ? `&first_air_date_year=${filters.year}` : "";
        const sortParam = `&sort_by=${filters.sort}`;
        
        const res = await fetch(
          `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=en-US${genreParam}${yearParam}${sortParam}&page=1&include_null_first_air_dates=false`
        );
        const data = await res.json();
        setSeries(data.results || []);
      } catch (error) {
        console.error("Error fetching TV data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSeries();
  }, [filters]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0c] pt-32 pb-20 relative overflow-hidden">
      {/* Subtiele achtergrond gloed zoals bij de andere overzichten */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-8 relative z-10 max-w-[1800px]">
        
        {/* Series Library Header */}
        <header className="mb-12 border-b border-white/5 pb-8 animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="flex items-center gap-2 text-[#3b82f6] mb-2">
            <RectangleStackIcon className="h-4 w-4" />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">Broadcast</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter leading-none uppercase">
            Series Library
          </h1>
          <p className="text-sm text-zinc-500 mt-4 max-w-xl font-medium leading-relaxed">
            Browse through the most trending television series with custom filters and archive them to your personal collection.
          </p>
        </header>

        <FilterBar type="tv" onFilterChange={handleFilterChange} />

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-white/[0.03] border border-white/10 rounded-sm animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {series.map((show) => (
              <MovieCard 
                key={`tv-discover-${show.id}`} 
                id={show.id} 
                title={show.name} 
                posterPath={show.poster_path} 
                voteAverage={show.vote_average} 
                type="tv" 
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}