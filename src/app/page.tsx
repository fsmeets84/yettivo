"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import MovieCard from "@/components/MovieCard";
import ReleasingToday from "@/components/ReleasingToday";
import CompatibleSignals from "@/components/CompatibleSignals"; 
import { useWatchlist } from "@/context/WatchlistContext";
import { useSession } from "next-auth/react";
import { FireIcon, PlayIcon, BellAlertIcon } from "@heroicons/react/24/outline";

export default function HomePage() {
  const [trending, setTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";
  
  // Gebruik de nieuwe gecachte lijst direct uit de context
  const { inProgressItems } = useWatchlist();

  useEffect(() => {
    const fetchTrending = async () => {
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
  }, []);

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

      <div className="container mx-auto px-8 relative z-20 -mt-10 space-y-10">
        
        {/* RELEASING TODAY SECTION */}
        {isLoggedIn && (
          <section className="bg-white/[0.02] border border-white/5 p-10 rounded-sm backdrop-blur-md shadow-2xl">
            <header className="mb-10">
              <div className="flex items-center gap-2 text-[#3b82f6] mb-2">
                <BellAlertIcon className="h-4 w-4" />
                <span className="text-[10px] font-black tracking-widest uppercase">New Releases</span>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight uppercase">
                Airing Today
              </h2>
            </header>
            <ReleasingToday />
          </section>
        )}

        {/* CONTINUE WATCHING SECTION (Nu razendsnel via Context cache) */}
        {isLoggedIn && inProgressItems.length > 0 && (
           <section className="bg-white/[0.02] border border-white/5 p-10 rounded-sm backdrop-blur-md shadow-2xl">
              <header className="mb-10">
                <div className="flex items-center gap-2 text-emerald-500 mb-2">
                  <PlayIcon className="h-4 w-4" />
                  <span className="text-[10px] font-black tracking-widest uppercase">Resume</span>
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight uppercase">
                  Continue Watching
                </h2>
              </header>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {inProgressItems.map((item) => (
                  <MovieCard 
                    key={`continue-${item.tmdbId}`}
                    id={item.tmdbId}
                    title={item.title}
                    posterPath={item.posterPath}
                    voteAverage={item.voteAverage}
                    type={item.type}
                  />
                ))}
              </div>
           </section>
        )}

        {/* RECOMMENDATIONS SECTION */}
        {isLoggedIn && (
          <section className="bg-white/[0.02] border border-white/5 rounded-sm backdrop-blur-md shadow-2xl overflow-hidden">
            <CompatibleSignals />
          </section>
        )}

        {/* TRENDING SECTION */}
        <section className="p-10">
          <header className="mb-10">
            <div className="flex items-center gap-2 text-[#3b82f6] mb-2">
              <FireIcon className="h-4 w-4" />
              <span className="text-[10px] font-black tracking-widest uppercase">Popular</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight uppercase">
              Trending Now
            </h2>
          </header>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {trending.map((item) => (
              <MovieCard 
                key={`${item.media_type}-${item.id}`}
                id={item.id}
                title={item.title || item.name}
                posterPath={item.poster_path}
                voteAverage={item.vote_average}
                type={item.media_type === 'tv' ? 'tv' : 'movie'}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}