"use client";

import { useEffect, useState, useMemo } from "react"; // useMemo toegevoegd
import Hero from "@/components/Hero";
import MovieCard from "@/components/MovieCard";
import { useWatchlist } from "@/context/WatchlistContext";
import { useSession } from "next-auth/react";
import { FireIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const [trending, setTrending] = useState<any[]>([]);
  const [continueWatching, setContinueWatching] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";
  const { isMovieWatched } = useWatchlist();

  // 1. Fetch Trending data ALLEEN bij mount of login-status verandering
  useEffect(() => {
    const fetchTrending = async () => {
      // We zetten setLoading alleen de ALLEREERSTE keer op true
      // zodat de pagina niet knippert bij watchlist updates
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

      try {
        const res = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`);
        const data = await res.json();
        setTrending(data.results || []);
      } catch (error) {
        console.error("Error loading trending:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, [isLoggedIn]); // Verwijder isMovieWatched hier!

  // 2. Aparte effect voor Continue Watching (LocalStorage)
  useEffect(() => {
    const fetchContinueWatching = async () => {
      if (!isLoggedIn) {
        setContinueWatching([]);
        return;
      }

      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      const activeItems: { id: string; type: "movie" | "tv" }[] = [];
      const processedIds = new Set();

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key?.startsWith("progress_") && !key?.startsWith("watched_tv_")) continue;

        const type = key.includes("_movie_") ? "movie" : "tv";
        const id = key.split("_").pop();
        if (!id || processedIds.has(`${type}-${id}`)) continue;

        activeItems.push({ id, type });
        processedIds.add(`${type}-${id}`);
      }

      if (activeItems.length > 0) {
        const details = await Promise.all(
          activeItems.map(async (item) => {
            const itemRes = await fetch(`https://api.themoviedb.org/3/${item.type}/${item.id}?api_key=${apiKey}`);
            return await itemRes.json();
          })
        );
        // We filteren hier op watched status zonder de hele pagina te herladen
        setContinueWatching(details.filter(d => d.id && !isMovieWatched(d.id)));
      }
    };

    fetchContinueWatching();
  }, [isLoggedIn, isMovieWatched]); // Deze mag wel blijven, want Resume Mission is dynamisch

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c]">
        <div className="h-8 w-8 border-2 border-[#3b82f6]/20 border-t-[#3b82f6] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-20 bg-[#0a0a0c]">
      {trending.length > 0 && <Hero movies={trending} />}

      <div className="container mx-auto px-8 relative z-20 pt-12">
        {/* RESUME MISSION SECTION (onveranderd) */}
        {isLoggedIn && continueWatching.length > 0 && (
           <section className="mb-20">
             {/* ... je bestaande resume mission code ... */}
           </section>
        )}

        {/* TRENDING SECTION */}
        <header className="mb-10 flex items-end justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#3b82f6] mb-1">
              <FireIcon className="h-4 w-4" />
              <span className="text-[11px] font-bold tracking-tight uppercase">Trending</span>
            </div>
            <h2 className="text-3xl font-semibold text-white tracking-tight">Trending now</h2>
          </div>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {trending.map((item) => (
            <MovieCard 
              key={`${item.media_type}-${item.id}`} // Stabiele key
              id={item.id}
              title={item.title || item.name}
              posterPath={item.poster_path}
              voteAverage={item.vote_average}
              type={item.media_type === 'tv' ? 'tv' : 'movie'}
            />
          ))}
        </div>
      </div>
    </main>
  );
}