"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useWatchlist } from "@/context/WatchlistContext";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { CheckCircleIcon as CheckOutline } from "@heroicons/react/24/outline";

interface Episode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  still_path: string | null;
  air_date: string;
  season_number: number;
}

interface SeasonSectionProps {
  tvId: string;
  seasons: any[];
  showName: string;      // Needed for auto-archive
  posterPath: string | null; // Needed for auto-archive
  voteAverage: number;   // Needed for auto-archive
}

export default function SeasonSection({ tvId, seasons, showName, posterPath, voteAverage }: SeasonSectionProps) {
  const [selectedSeason, setSelectedSeason] = useState(seasons[0]?.season_number || 1);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  const { watchlist, toggleEpisodeWatched, addToWatchlist, isInWatchlist } = useWatchlist();

  // Find this show in the local archive to get watched episodes
  const archiveEntry = watchlist.find(item => item.tmdbId === Number(tvId));
  const watchedEpisodes = archiveEntry?.watchedEpisodes || [];

  useEffect(() => {
    async function loadEpisodes() {
      setLoading(true);
      try {
        const res = await fetch(`/api/tv/${tvId}/season/${selectedSeason}`);
        const data = await res.json();
        setEpisodes(data?.episodes || []);
      } catch (err) {
        console.error("Error loading episodes:", err);
      } finally {
        setLoading(false);
      }
    }
    loadEpisodes();
  }, [tvId, selectedSeason]);

  const handleEpisodeToggle = (seasonNum: number, epNum: number) => {
    // 1. If not in archive, add it first
    if (!isInWatchlist(Number(tvId))) {
      addToWatchlist({
        tmdbId: Number(tvId),
        title: showName,
        posterPath: posterPath,
        type: 'tv',
        voteAverage: voteAverage
      });
    }
    
    // 2. Toggle the episode status
    toggleEpisodeWatched(Number(tvId), seasonNum, epNum);
  };

  return (
    <div className="space-y-8 mt-12 animate-in fade-in duration-700">
      {/* Season Selector */}
      <div className="flex flex-col gap-4">
        <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Archive Index / Select Season</h2>
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {seasons.filter(s => s.season_number > 0).map((season) => (
            <button
              key={season.id}
              onClick={() => setSelectedSeason(season.season_number)}
              className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 whitespace-nowrap border ${
                selectedSeason === season.season_number
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-[0_0_25px_rgba(79,70,229,0.3)]"
                  : "glass-card text-zinc-400 border-white/5 hover:border-white/20"
              }`}
            >
              Season {season.season_number}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">
            Transmission Records — Season {selectedSeason}
          </h2>
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
            {episodes.length} Episodes Found
          </span>
        </div>
        
        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-white/5 animate-pulse rounded-2xl border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {episodes.map((episode) => {
              const isWatched = watchedEpisodes.includes(`${episode.season_number}-${episode.episode_number}`);
              
              return (
                <div 
                  key={episode.id} 
                  className={`glass-card overflow-hidden rounded-2xl flex flex-col md:flex-row gap-6 hover:bg-white/5 transition-all duration-500 group border-white/5 relative ${
                    isWatched ? "border-emerald-500/20" : "hover:border-indigo-500/30"
                  }`}
                >
                  {/* Episode Visual */}
                  <div className="relative w-full md:w-64 aspect-video bg-zinc-900 flex-shrink-0">
                    {episode.still_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                        alt={episode.name}
                        fill
                        className={`object-cover transition-all duration-700 ${isWatched ? 'opacity-40 grayscale-[0.5]' : 'group-hover:scale-105'}`}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] font-black text-zinc-800 uppercase">
                        No Data
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent md:hidden" />
                    <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded text-[9px] font-black text-white uppercase tracking-tighter">
                      EP {episode.episode_number}
                    </div>
                  </div>

                  {/* Episode Content */}
                  <div className="flex flex-1 flex-col justify-center p-4 md:p-0 pr-20">
                    <h3 className={`text-lg font-bold transition-colors duration-300 ${isWatched ? 'text-zinc-500 line-through decoration-emerald-500/50' : 'text-white group-hover:text-indigo-400'}`}>
                      {episode.name}
                    </h3>
                    <p className="text-sm text-zinc-500 mt-2 line-clamp-2 font-medium leading-relaxed italic">
                      {episode.overview || "No transmission data available for this episode record."}
                    </p>
                    <div className="mt-4 flex items-center gap-4">
                      <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">
                        Air date: {episode.air_date || "Unknown"}
                      </span>
                    </div>
                  </div>

                  {/* Check Action Button */}
                  <button 
                    onClick={() => handleEpisodeToggle(episode.season_number, episode.episode_number)}
                    className={`absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-2xl transition-all duration-300 ${
                      isWatched 
                        ? 'bg-emerald-500/10 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)] scale-110' 
                        : 'bg-white/5 text-zinc-600 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {isWatched ? (
                      <CheckCircleIcon className="h-7 w-7" />
                    ) : (
                      <CheckOutline className="h-7 w-7" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}