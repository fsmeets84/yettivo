"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useWatchlist } from "@/context/WatchlistContext";
import { 
  StarIcon, 
  MagnifyingGlassIcon,
  BookmarkIcon,
  EyeIcon,
  ArrowPathIcon 
} from "@heroicons/react/24/outline";
import { 
  BookmarkIcon as BookmarkSolid, 
  EyeIcon as EyeSolid,
} from "@heroicons/react/24/solid";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "movie" | "tv">("all");

  const { 
    isInWatchlist, 
    addToWatchlist, 
    removeFromWatchlist, 
    isMovieWatched, 
    toggleWatched,
    watchlist // Nodig om progressie te checken
  } = useWatchlist();

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      
      setLoading(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        const res = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=en-US`
        );
        const data = await res.json();
        setResults(data.results?.filter((r: any) => r.media_type !== "person") || []);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const filteredResults = results.filter(item => 
    filter === "all" ? true : item.media_type === filter
  );

  return (
    <main className="min-h-screen bg-transparent pt-32 pb-20 relative overflow-hidden">
      <div className="container mx-auto px-8 relative z-10">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#3b82f6] mb-1">
              <MagnifyingGlassIcon className="h-4 w-4" />
              <span className="text-[10px] font-bold tracking-wider uppercase">Archive Search</span>
            </div>
            <h1 className="text-4xl font-semibold text-white tracking-tight leading-none">
              {query ? `Results for "${query}"` : "Start searching"}
            </h1>
            <p className="text-sm text-zinc-500 font-medium uppercase tracking-widest">
              Found {filteredResults.length} matches in the global database
            </p>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-[2px] glass-card border border-white/5 bg-white/5 backdrop-blur-md">
            <FilterBtn active={filter === "all"} label="All" onClick={() => setFilter("all")} />
            <FilterBtn active={filter === "movie"} label="Movies" onClick={() => setFilter("movie")} />
            <FilterBtn active={filter === "tv"} label="Series" onClick={() => setFilter("tv")} />
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="h-8 w-8 border-2 border-[#3b82f6]/20 border-t-[#3b82f6] rounded-full animate-spin" />
          </div>
        ) : filteredResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredResults.map((item) => {
              const isAdded = isInWatchlist(item.id);
              const isWatched = isMovieWatched(item.id);
              // Bepaal het type voor de functies
              const mediaType: 'movie' | 'tv' = item.media_type === 'tv' ? 'tv' : 'movie';

              const handleWatchlistClick = (e: React.MouseEvent) => {
                e.preventDefault();
                // FIX: Voeg mediaType toe aan removeFromWatchlist
                isAdded 
                  ? removeFromWatchlist(item.id, mediaType) 
                  : addToWatchlist({
                      tmdbId: item.id,
                      title: item.title || item.name,
                      posterPath: item.poster_path,
                      type: mediaType,
                      voteAverage: item.vote_average
                    });
              };

              const handleWatchedClick = (e: React.MouseEvent) => {
                e.preventDefault();
                // FIX: toggleWatched verwacht id en optioneel movieData
                toggleWatched(item.id, {
                  title: item.title || item.name,
                  posterPath: item.poster_path,
                  type: mediaType,
                  voteAverage: item.vote_average
                });
              };

              // Progressie checken via de context watchlist ipv localStorage
              const itemInDb = watchlist.find(i => String(i.tmdbId) === String(item.id));
              const hasProgress = (itemInDb?.watchedEpisodes?.length ?? 0) > 0;

              return (
                <Link 
                  key={item.id} 
                  href={`/${mediaType}/${item.id}`}
                  className="group block space-y-4"
                >
                  <div className="relative aspect-[2/3] glass-card overflow-hidden transition-all duration-500 group-hover:border-[#3b82f6]/40 group-hover:shadow-[0_0_40px_rgba(37,99,235,0.25)] rounded-[2px] border border-white/5">
                    
                    <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
                      {item.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                          alt={item.title || item.name} 
                          fill 
                          className={`object-cover transition-all duration-500 ${isWatched ? 'opacity-40 grayscale-[0.5]' : 'opacity-90'}`}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-900/50 text-[10px] font-bold text-zinc-600 italic uppercase">No Poster</div>
                      )}
                    </div>

                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-black/90 via-black/20 to-transparent z-20 pointer-events-none" />

                    {/* Status badges */}
                    <div className="absolute bottom-3 left-3 z-30">
                      {isWatched ? (
                        <div className="px-2 py-1 bg-[#10b981] text-white text-[8px] font-black uppercase tracking-tighter shadow-lg rounded-[1px]">
                          Completed
                        </div>
                      ) : hasProgress ? (
                        <div className="px-2 py-1 bg-orange-500 text-white text-[8px] font-black uppercase tracking-tighter shadow-lg rounded-[1px] flex items-center gap-1">
                          <ArrowPathIcon className="h-2 w-2 animate-spin-slow" />
                          In Progress
                        </div>
                      ) : null}
                    </div>

                    <div className="absolute inset-0 z-30 pointer-events-none">
                      <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-auto">
                        <button
                          onClick={handleWatchlistClick}
                          className={`p-2 rounded-[2px] backdrop-blur-md border transition-all duration-300 ${
                            isAdded 
                              ? "bg-[#3b82f6] border-[#3b82f6] text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-110" 
                              : "bg-black/60 border-white/20 text-white hover:bg-[#3b82f6]"
                          }`}
                        >
                          {isAdded ? <BookmarkSolid className="h-4 w-4" /> : <BookmarkIcon className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={handleWatchedClick}
                          className={`p-2 rounded-[2px] backdrop-blur-md border transition-all duration-300 ${
                            isWatched 
                              ? "bg-[#10b981] border-[#10b981] text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-110" 
                              : "bg-black/60 border-white/20 text-white hover:bg-[#10b981]"
                          }`}
                        >
                          {isWatched ? <EyeSolid className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="absolute bottom-3 right-3 px-2 py-1 rounded-[2px] bg-black/80 backdrop-blur-md border border-white/10 flex items-center gap-1 z-40">
                      <StarIcon className="h-3 w-3 text-[#3b82f6] fill-[#3b82f6]" />
                      <span className="text-[10px] font-bold text-white">{item.vote_average?.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="px-1">
                    <h2 className="text-sm font-bold text-zinc-100 truncate group-hover:text-[#3b82f6] transition-colors tracking-tight">
                      {item.title || item.name}
                    </h2>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
                      {mediaType === 'tv' ? 'Series' : 'Movie'} • {(item.release_date || item.first_air_date)?.split('-')[0]}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-24 text-center border border-dashed border-white/10 rounded-[2px] bg-white/[0.01]">
            <MagnifyingGlassIcon className="h-10 w-10 text-zinc-800 mx-auto mb-4" />
            <p className="text-zinc-500 text-sm font-bold tracking-tight uppercase">No records match your query</p>
          </div>
        )}
      </div>
    </main>
  );
}

function FilterBtn({ active, label, onClick }: { active: boolean, label: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-[2px] text-[11px] font-bold transition-all duration-300 uppercase tracking-tighter ${
        active 
        ? "bg-[#3b82f6] text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]" 
        : "text-zinc-500 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0c]" />}>
      <SearchContent />
    </Suspense>
  );
}