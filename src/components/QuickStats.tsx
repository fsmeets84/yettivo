"use client";

import { useWatchlist } from "@/context/WatchlistContext";
import { 
  ArchiveBoxIcon, 
  FilmIcon, 
  TvIcon, 
  ChartBarIcon 
} from "@heroicons/react/24/outline";

export default function QuickStats() {
  const { watchlist } = useWatchlist();

  const totalItems = watchlist.length;
  const movieCount = watchlist.filter(item => item.type === 'movie').length;
  const tvCount = watchlist.filter(item => item.type === 'tv').length;
  
  // Bereken gemiddelde score van je archief
  const avgRating = totalItems > 0 
    ? (watchlist.reduce((acc, item) => acc + item.voteAverage, 0) / totalItems).toFixed(1)
    : "0.0";

  const stats = [
    { label: "Total Records", value: totalItems, icon: ArchiveBoxIcon, color: "text-white" },
    { label: "Movies", value: movieCount, icon: FilmIcon, color: "text-purple-500" },
    { label: "TV Series", value: tvCount, icon: TvIcon, color: "text-indigo-500" },
    { label: "Avg. Quality", value: `${avgRating}`, icon: ChartBarIcon, color: "text-emerald-500" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="glass-card p-6 rounded-[2rem] border-white/5 flex flex-col items-center text-center group hover:border-white/10 transition-colors"
        >
          <stat.icon className={`w-5 h-5 mb-3 ${stat.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
          <span className="text-2xl font-black text-white tracking-tighter mb-1">
            {stat.value}
          </span>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}