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
  ArrowPathIcon,
  PlayIcon,
  UserIcon,
  UserCircleIcon
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
  const [filter, setFilter] = useState<"all" | "movie" | "tv" | "person">("all");

  const { 
    isInWatchlist, 
    addToWatchlist, 
    removeFromWatchlist, 
    isMovieWatched, 
    toggleWatched,
    watchlist 
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
        // We filteren nu niet meer op media_type, zodat personen ook doorkomen
        setResults(data.results || []);
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
    <main className="min-h-screen bg-[#0a0a0c] pt-32 pb-20 relative overflow-hidden">
      <div className="container mx-auto px-8 relative z-10">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#3b82f6] mb-1">
              <MagnifyingGlassIcon className="h-4 w-4" />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase">Global Search</span>
            </div>
            <h1 className="text-4xl font-semibold text-white tracking-tight leading-none uppercase italic">
              {query ? `Results for "${query}"` : "Search"}
            </h1>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              Found {filteredResults.length} matches in the library
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1.5 rounded-sm border border-white/5 bg-white/5 backdrop-blur-md">
            <FilterBtn active={filter === "all"} label="All" onClick={() => setFilter("all")} />
            <FilterBtn active={filter === "movie"} label="Movies" onClick={() => setFilter("movie")} />
            <FilterBtn active={filter === "tv"} label="Series" onClick={() => setFilter("tv")} />
            <FilterBtn active={filter === "person"} label="People" onClick={() => setFilter("person")} />
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="h-8 w-8 border-2 border-[#3b82f6]/20 border-t-[#3b82f6] rounded-full animate-spin" />
          </div>
        ) : filteredResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {filteredResults.map((item) => {
              // Specifieke rendering voor personen
              if (item.media_type === "person") {
                return <PersonResultCard key={item.id} person={item} />;
              }

              const isAdded = isInWatchlist(item.id);
              const isWatched = isMovieWatched(item.id);
              const mediaType: 'movie' | 'tv' = item.media_type === 'tv' ? 'tv' : 'movie';

              const itemInDb = watchlist.find(i => String(i.tmdbId) === String(item.id));
              const hasProgress = (itemInDb?.watchedEpisodes?.length ?? 0) > 0;

              return (
                <Link 
                  key={item.id} 
                  href={`/${mediaType}/${item.id}`}
                  className="group block space-y-4"
                >
                  <div className="relative aspect-[2/3] overflow-hidden transition-all duration-500 rounded-sm border border-white/10 bg-zinc-900 group-hover:border-[#3b82f6]/50 shadow-xl">
                    
                    <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
                      {item.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                          alt="" 
                          fill 
                          className={`object-cover transition-all duration-500 ${isWatched ? 'opacity-20 grayscale' : 'opacity-80 group-hover:opacity-100'}`}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-[10px] font-black text-zinc-700 uppercase">No Image</div>
                      )}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 z-20 pointer-events-none" />

                    {/* Status badges */}
                    <div className="absolute bottom-3 left-3 z-30">
                      {isWatched ? (
                        <div className="px-2 py-1 bg-[#10b981]/20 border border-[#10b981]/40 text-[#10b981] text-[8px] font-black uppercase tracking-tighter rounded-[1px] backdrop-blur-md">
                          Completed
                        </div>
                      ) : hasProgress ? (
                        <div className="px-2 py-1 bg-orange-500 text-white text-[8px] font-black uppercase tracking-tighter rounded-[1px] flex items-center gap-1 shadow-lg">
                          <PlayIcon className="h-2 w-2 fill-current" />
                          In Progress
                        </div>
                      ) : null}
                    </div>

                    <div className="absolute bottom-3 right-3 px-2 py-1 rounded-sm bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1 z-30">
                      <StarIcon className="h-3 w-3 text-[#3b82f6] fill-[#3b82f6]" />
                      <span className="text-[10px] font-black text-white">{item.vote_average?.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="px-1">
                    <h2 className="text-sm font-semibold text-zinc-100 truncate group-hover:text-[#3b82f6] transition-colors tracking-tight">
                      {item.title || item.name}
                    </h2>
                    <p className="text-[10px] font-black text-[#3b82f6] tracking-widest uppercase mt-1">
                      {mediaType === 'tv' ? 'Series' : 'Movie'} • {(item.release_date || item.first_air_date)?.split('-')[0]}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-24 text-center border border-dashed border-white/10 rounded-sm bg-white/[0.01]">
            <MagnifyingGlassIcon className="h-10 w-10 text-zinc-800 mx-auto mb-4" />
            <p className="text-zinc-500 text-[10px] font-black tracking-widest uppercase">No results found for your search</p>
          </div>
        )}
      </div>
    </main>
  );
}

// Sub-component voor personen
function PersonResultCard({ person }: { person: any }) {
  return (
    <Link 
      href={`/person/${person.id}`}
      className="group block space-y-4"
    >
      <div className="relative aspect-[2/3] overflow-hidden transition-all duration-500 rounded-sm border border-white/10 bg-zinc-900 group-hover:border-[#3b82f6]/50 shadow-xl">
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
          {person.profile_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
              alt={person.name} 
              fill 
              className="object-cover opacity-80 group-hover:opacity-100"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-900">
              <UserIcon className="h-12 w-12 text-zinc-800" />
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 z-20 pointer-events-none" />
        
        <div className="absolute bottom-3 left-3 z-30">
           <div className="px-2 py-1 bg-[#3b82f6]/20 border border-[#3b82f6]/40 text-[#3b82f6] text-[8px] font-black uppercase tracking-tighter rounded-[1px] backdrop-blur-md">
            Cast / Crew
          </div>
        </div>
      </div>

      <div className="px-1">
        <h2 className="text-sm font-semibold text-zinc-100 truncate group-hover:text-[#3b82f6] transition-colors tracking-tight">
          {person.name}
        </h2>
        <p className="text-[10px] font-black text-zinc-500 tracking-widest uppercase mt-1">
          {person.known_for_department || 'Personnel'}
        </p>
      </div>
    </Link>
  );
}

function FilterBtn({ active, label, onClick }: { active: boolean, label: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-sm text-[10px] font-black transition-all duration-300 uppercase tracking-widest ${
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