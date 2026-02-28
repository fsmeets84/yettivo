"use client";

import { useEffect, useState } from "react";
import { useWatchlist } from "@/context/WatchlistContext";
import Image from "next/image";
import Link from "next/link";
import { StarIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import { isSameDay } from "date-fns";

export default function ReleasingToday() {
  const { watchlist } = useWatchlist();
  const [todayReleases, setTodayReleases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodayData = async () => {
      // Alleen items checken die in de watchlist staan en niet gemarkeerd zijn als volledig 'watched'
      const activeWatchlist = watchlist.filter(item => item.inWatchlist && !item.isWatched);
      
      if (activeWatchlist.length === 0) {
        setLoading(false);
        return;
      }

      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      const foundToday: any[] = [];
      const today = new Date();

      try {
        // We voeren de checks parallel uit voor snelheid
        const promises = activeWatchlist.map(async (item) => {
          const res = await fetch(
            `https://api.themoviedb.org/3/${item.type}/${item.tmdbId}?api_key=${apiKey}`
          );
          const data = await res.json();

          let releaseDate: Date | null = null;
          let subTitle = "";

          if (item.type === "tv" && data.next_episode_to_air) {
            releaseDate = new Date(data.next_episode_to_air.air_date);
            subTitle = `S${data.next_episode_to_air.season_number} E${data.next_episode_to_air.episode_number}`;
          } else if (item.type === "movie" && data.release_date) {
            releaseDate = new Date(data.release_date);
            subTitle = "Movie Premiere";
          }

          if (releaseDate && isSameDay(releaseDate, today)) {
            foundToday.push({
              ...data,
              subTitle,
              type: item.type,
              tmdbId: item.tmdbId
            });
          }
        });

        await Promise.all(promises);
        setTodayReleases(foundToday);
      } catch (error) {
        console.error("Error fetching today's releases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayData();
  }, [watchlist]);

  if (loading || todayReleases.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {todayReleases.map((item) => (
        <Link 
          key={item.tmdbId} 
          href={`/${item.type}/${item.tmdbId}`}
          className="group relative flex items-center gap-4 p-4 bg-white/[0.03] border border-white/10 rounded-sm hover:border-[#3b82f6]/50 transition-all overflow-hidden"
        >
          {/* Subtle Background Art */}
          <div className="absolute inset-0 opacity-5 grayscale group-hover:opacity-10 transition-opacity">
             <Image 
              src={`https://image.tmdb.org/t/p/w500${item.backdrop_path || item.poster_path}`} 
              alt="" 
              fill 
              className="object-cover"
            />
          </div>

          <div className="relative w-16 h-24 flex-shrink-0 shadow-xl border border-white/10 rounded-sm overflow-hidden">
            <Image 
              src={`https://image.tmdb.org/t/p/w200${item.poster_path}`} 
              alt={item.name || item.title} 
              fill 
              className="object-cover"
            />
          </div>

          <div className="relative flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#3b82f6] bg-[#3b82f6]/10 px-1.5 py-0.5 rounded-sm">
                {item.subTitle}
              </span>
              <div className="flex items-center gap-1 text-[10px] font-bold text-white/60">
                <StarIcon className="h-3 w-3 text-[#3b82f6] fill-[#3b82f6]" />
                {item.vote_average.toFixed(1)}
              </div>
            </div>
            <h3 className="text-sm font-bold text-white truncate">
              {item.name || item.title}
            </h3>
            <div className="flex items-center gap-1.5 mt-1">
              <CalendarDaysIcon className="h-3 w-3 text-emerald-500" />
              <p className="text-[10px] text-emerald-500 uppercase font-bold tracking-tight">
                {item.type === 'tv' ? 'New Episode Today' : 'Releasing Today'}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}