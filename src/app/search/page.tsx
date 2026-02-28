"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useWatchlist } from "@/context/WatchlistContext";
import { 
  StarIcon, 
  MagnifyingGlassIcon,
  UserIcon,
  PlayIcon,
  Squares2X2Icon
} from "@heroicons/react/24/outline";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "movie" | "tv" | "person">("all");

  const { 
    isMovieWatched, 
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
      {/* Premium Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-8 relative z-10 max-w-[1800px]">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-500">
              <MagnifyingGlassIcon className="h-4 w-4" />
              <span className="text-[10px] font-black tracking-[0.3em] uppercase">Global Database</span>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter leading-none uppercase">
              {query ? `Results for "${query}"` : "Search"}
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-sm border border-white/5">
                {filteredResults.length} Matches Found
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 p-1.5 rounded-sm border border-white/5 bg-white/[0.02] backdrop-blur-2xl shadow-2xl">
            <FilterBtn active={filter === "all"} label="All Results" onClick={() => setFilter("all")} />
            <FilterBtn active={filter === "movie"} label="Movies" onClick={() => setFilter("movie")} />
            <FilterBtn active={filter === "tv"} label="Series" onClick={() => setFilter("tv")} />
            <FilterBtn active={filter === "person"} label="Personnel" onClick={() => setFilter("person")} />
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="h-8 w-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest animate-pulse">Syncing with database...</p>
          </div>
        ) : filteredResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {filteredResults.map((item) => {
              if (item.media_type === "person") {
                return <PersonResultCard key={item.id} person={item} />;
              }

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
                  <div className="relative aspect-[2/3] overflow-hidden transition-all duration-500 rounded-sm border border-white/10 bg-zinc-900 group-hover:border-blue-500/50 shadow-2xl">
                    
                    <div className="absolute inset-0 transition-transform duration-1000 ease-out group-hover:scale-110">
                      {item.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                          alt="" 
                          fill 
                          className={`object-cover transition-all duration-700 ${isWatched ? 'opacity-20 grayscale' : 'opacity-80 group-hover:opacity-100'}`}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-[10px] font-black text-zinc-700 uppercase tracking-widest">No Poster</div>
                      )}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-80 z-20 pointer-events-none" />

                    {/* Status badges */}
                    <div className="absolute bottom-3 left-3 z-30">
                      {isWatched ? (
                        <div className="px-2 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-500 text-[8px] font-black uppercase tracking-widest rounded-sm backdrop-blur-md">
                          Archive Completed
                        </div>
                      ) : hasProgress ? (
                        <div className="px-2 py-1 bg-orange-500 text-white text-[8px] font-black uppercase tracking-widest rounded-sm flex items-center gap-1 shadow-lg shadow-orange-900/20">
                          <PlayIcon className="h-2 w-2 fill-current" />
                          Progress Active
                        </div>
                      ) : null}
                    </div>

                    <div className="absolute bottom-3 right-3 px-2 py-1 rounded-sm bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1 z-30">
                      <StarIcon className="h-3.5 w-3.5 text-blue-500 fill-blue-500" />
                      <span className="text-[11px] font-black text-white">{item.vote_average > 0 ? item.vote_average.toFixed(1) : "N/A"}</span>
                    </div>
                  </div>

                  <div className="px-1 space-y-1">
                    <h2 className="text-[13px] font-bold text-zinc-100 truncate group-hover:text-blue-500 transition-colors tracking-tight uppercase">
                      {item.title || item.name}
                    </h2>
                    <p className="text-[9px] font-black text-blue-500 tracking-[0.2em] uppercase flex items-center gap-2">
                      {mediaType === 'tv' ? 'Series' : 'Feature'} <span className="text-zinc-600">•</span> <span className="text-zinc-400">{(item.release_date || item.first_air_date)?.split('-')[0] || "TBA"}</span>
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-32 text-center border border-dashed border-white/5 rounded-sm bg-white/[0.01] animate-in zoom-in-95 duration-700">
            <MagnifyingGlassIcon className="h-12 w-12 text-zinc-800 mx-auto mb-6" />
            <p className="text-zinc-500 text-[11px] font-black tracking-[0.3em] uppercase">No archives found for this query</p>
            <Link href="/" className="mt-8 inline-block text-blue-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Return to control center —</Link>
          </div>
        )}
      </div>
    </main>
  );
}

function PersonResultCard({ person }: { person: any }) {
  return (
    <Link 
      href={`/person/${person.id}`}
      className="group block space-y-4"
    >
      <div className="relative aspect-[2/3] overflow-hidden transition-all duration-500 rounded-sm border border-white/10 bg-zinc-900 group-hover:border-blue-500/50 shadow-2xl">
        <div className="absolute inset-0 transition-transform duration-1000 ease-out group-hover:scale-110">
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-80 z-20 pointer-events-none" />
        
        <div className="absolute bottom-3 left-3 z-30">
           <div className="px-2 py-1 bg-blue-600/20 border border-blue-500/40 text-blue-500 text-[8px] font-black uppercase tracking-widest rounded-sm backdrop-blur-md">
            Registry: Cast / Crew
          </div>
        </div>
      </div>

      <div className="px-1 space-y-1">
        <h2 className="text-[13px] font-bold text-zinc-100 truncate group-hover:text-blue-500 transition-colors tracking-tight uppercase">
          {person.name}
        </h2>
        <p className="text-[9px] font-black text-zinc-500 tracking-[0.2em] uppercase">
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
      className={`px-5 py-2.5 rounded-sm text-[10px] font-black transition-all duration-300 uppercase tracking-[0.2em] ${
        active 
        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-500" 
        : "text-zinc-500 hover:text-white hover:bg-white/5"
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