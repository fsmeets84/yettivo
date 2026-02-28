"use client";

import { useEffect, useState, useCallback } from "react";
import { useWatchlist } from "@/context/WatchlistContext";
import MovieCard from "./MovieCard";
import { SparklesIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

export default function CompatibleSignals() {
  const { watchlist, isInWatchlist } = useWatchlist();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sourceTitle, setSourceTitle] = useState("");

  const fetchRecommendations = useCallback(async (isManualRefresh = false) => {
    // Alleen aanbevelingen zoeken als er iets in de watchlist staat
    const activeWatchlist = watchlist.filter(item => item.inWatchlist);
    if (activeWatchlist.length === 0) {
      setLoading(false);
      return;
    }

    if (isManualRefresh) setIsRefreshing(true);
    else setLoading(true);

    // Kies een willekeurig item uit de watchlist als bron
    const randomItem = activeWatchlist[Math.floor(Math.random() * activeWatchlist.length)];
    setSourceTitle(randomItem.title);

    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/${randomItem.type}/${randomItem.tmdbId}/recommendations?api_key=${apiKey}&language=en-US&page=1`
      );
      const data = await res.json();
      
      const filtered = (data.results || [])
        .filter((rec: any) => !isInWatchlist(rec.id))
        .slice(0, 6); 

      setRecommendations(filtered);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [watchlist, isInWatchlist]);

  useEffect(() => {
    fetchRecommendations();
  }, [watchlist.length, fetchRecommendations]); 

  if (loading && !isRefreshing) return (
    <div className="p-20 flex justify-center items-center">
      <ArrowPathIcon className="h-6 w-6 text-[#3b82f6] animate-spin" />
    </div>
  );

  if (recommendations.length === 0 && !loading) return null;

  return (
    <section className="p-10">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-purple-500 mb-2">
            <SparklesIcon className="h-4 w-4" />
            <span className="text-[10px] font-black tracking-widest uppercase">Recommended for you</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight uppercase">
            For You
          </h2>
          <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
            Because you watched <span className="text-purple-400/80">{sourceTitle}</span>
          </p>
        </div>

        <button 
          onClick={() => fetchRecommendations(true)}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-sm text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50 group"
        >
          <ArrowPathIcon className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
          {isRefreshing ? "Updating..." : "Refresh Suggestions"}
        </button>
      </header>

      <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 transition-opacity duration-500 ${isRefreshing ? "opacity-30" : "opacity-100"}`}>
        {recommendations.map((item) => (
          <MovieCard 
            key={`rec-${item.id}`}
            id={item.id}
            title={item.title || item.name}
            posterPath={item.poster_path}
            voteAverage={item.vote_average}
            type={item.media_type === 'tv' || item.first_air_date ? 'tv' : 'movie'}
          />
        ))}
      </div>
    </section>
  );
}