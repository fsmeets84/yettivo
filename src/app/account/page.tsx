"use client";

import { useWatchlist } from "@/context/WatchlistContext";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  UserIcon, 
  ArchiveBoxIcon, 
  FilmIcon, 
  TvIcon, 
  StarIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";

export default function AccountPage() {
  const { watchlist } = useWatchlist();
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (mounted && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router, mounted]);

  if (!mounted || !isLoggedIn) return <div className="min-h-screen bg-[#0a0a0c]" />;

  // Statistieken berekenen
  const totalItems = watchlist.length;
  const movieCount = watchlist.filter(item => item.type === 'movie').length;
  const tvCount = watchlist.filter(item => item.type === 'tv').length;
  const avgRating = totalItems > 0 
    ? (watchlist.reduce((acc, item) => acc + (item.voteAverage || 0), 0) / totalItems).toFixed(1)
    : "0.0";

  // Sorteren op meest recent toegevoegd (van nieuw naar oud)
  const sortedWatchlist = [...watchlist].sort((a, b) => 
    new Date(b.addedAt || (b as any).createdAt).getTime() - 
    new Date(a.addedAt || (a as any).createdAt).getTime()
  );

  const recentAdditions = sortedWatchlist.slice(0, 5);
  
  // Series met voortgang (laatste 3 actieve series)
  const seriesWithProgress = sortedWatchlist
    .filter(i => i.type === 'tv')
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-transparent text-zinc-300 pt-32 pb-12 relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-600/[0.08] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-600/[0.08] blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-8 max-w-6xl relative z-10 space-y-12">
        
        {/* Profile Header */}
        <header className="flex items-center justify-between border-b border-white/10 pb-10">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 rounded-sm bg-[#3b82f6]/10 backdrop-blur-2xl border border-[#3b82f6]/20 flex items-center justify-center shadow-2xl">
              <UserIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                {user?.username || "User"}
              </h1>
              <p className="text-[11px] font-bold text-zinc-500 mt-1 uppercase tracking-[0.2em]">
                Signed in as — <span className="text-[#3b82f6]">{user?.email}</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-bold text-zinc-500 mb-1 uppercase tracking-widest">Total Saved</p>
            <p className="text-4xl font-black text-white leading-none tracking-tighter">{totalItems}</p>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard label="Watchlist" value={totalItems} icon={<ArchiveBoxIcon className="h-4 w-4" />} />
          <StatCard label="Movies" value={movieCount} icon={<FilmIcon className="h-4 w-4" />} />
          <StatCard label="TV Shows" value={tvCount} icon={<TvIcon className="h-4 w-4" />} />
          <StatCard label="Avg Score" value={avgRating} icon={<StarIcon className="h-4 w-4" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
          <div className="lg:col-span-8 space-y-12">
            
            {/* Recent Activity */}
            <section className="space-y-6">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-[11px] font-bold text-white tracking-widest uppercase">Recently Added</h2>
                <Link href="/watchlist" className="text-[11px] font-bold text-zinc-400 hover:text-[#3b82f6] transition-colors flex items-center gap-1 uppercase tracking-widest">
                  View full list <ChevronRightIcon className="h-2.5 w-2.5" />
                </Link>
              </div>
              
              <div className="grid grid-cols-5 gap-4">
                {recentAdditions.length > 0 ? recentAdditions.map((item) => (
                  <Link 
                    key={`${item.type}-${item.tmdbId}`} 
                    href={`/${item.type}/${item.tmdbId}`} 
                    className="group relative aspect-[2/3] rounded-sm overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-md transition-all hover:border-[#3b82f6]/50 shadow-xl"
                  >
                    <Image 
                      src={`https://image.tmdb.org/t/p/w300${item.posterPath}`} 
                      alt={item.title} 
                      fill 
                      className="object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                      <p className="text-[9px] font-bold text-white uppercase truncate">{item.title}</p>
                    </div>
                  </Link>
                )) : (
                   <div className="col-span-5 h-44 border border-dashed border-white/10 rounded-sm flex items-center justify-center text-zinc-500 text-[11px] font-bold bg-white/[0.01] uppercase tracking-widest">List is empty</div>
                )}
              </div>
            </section>

            {/* Active Series Progress */}
            <section className="space-y-6">
              <h2 className="text-[11px] font-bold text-white tracking-widest uppercase px-1">Active series progress</h2>
              <div className="grid gap-3">
                {seriesWithProgress.length > 0 ? seriesWithProgress.map(series => {
                  // Bereken voortgang (fictief voorbeeld: aantal watched episodes)
                  const episodesCount = series.watchedEpisodes?.length || 0;
                  const progressWidth = Math.min((episodesCount / 10) * 100, 100); // 10 episodes als placeholder voor 100%

                  return (
                    <Link 
                      key={series.tmdbId} 
                      href={`/tv/${series.tmdbId}`}
                      className="p-4 rounded-sm bg-white/[0.03] border border-white/10 backdrop-blur-xl flex items-center gap-6 hover:bg-white/[0.06] transition-all border-l-2 border-l-[#3b82f6] group"
                    >
                      <div className="h-12 w-8 relative rounded-sm overflow-hidden flex-shrink-0">
                        <Image src={`https://image.tmdb.org/t/p/w92${series.posterPath}`} alt="" fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between items-end mb-2">
                           <p className="text-xs font-bold text-white group-hover:text-[#3b82f6] transition-colors">{series.title}</p>
                           <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">
                             {episodesCount} Episodes watched
                           </span>
                         </div>
                         <div className="h-1 w-full bg-white/5 rounded-none overflow-hidden">
                            <div 
                              className="h-full bg-[#3b82f6] transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.4)]" 
                              style={{ width: `${progressWidth || 5}%` }} 
                            />
                         </div>
                      </div>
                    </Link>
                  );
                }) : (
                  <div className="p-8 border border-dashed border-white/10 rounded-sm text-center bg-white/[0.01]">
                    <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">No active series found.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="p-8 rounded-sm bg-white/[0.04] backdrop-blur-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#3b82f6]/10 blur-[60px] rounded-full" />
              
              <h2 className="text-[11px] font-bold text-white mb-10 tracking-widest uppercase relative z-10">Data distribution</h2>
              <div className="space-y-10 relative z-10">
                <DistributionBar label="Movies" count={movieCount} total={totalItems} />
                <DistributionBar label="TV Shows" count={tvCount} total={totalItems} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function StatCard({ label, value, icon }: any) {
  return (
    <div className="group relative p-6 rounded-sm bg-white/[0.04] backdrop-blur-2xl border border-white/5 hover:border-[#3b82f6]/30 transition-all duration-500 overflow-hidden shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-center gap-3 mb-3 text-zinc-400 group-hover:text-[#3b82f6] transition-colors">
        {icon}
        <span className="text-[11px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-4xl font-black text-white tracking-tighter">{value}</p>
    </div>
  );
}

function DistributionBar({ label, count, total }: any) {
  const perc = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="space-y-4">
      <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
        <span className="text-zinc-500">{label}</span>
        <span className="text-[#3b82f6]">{Math.round(perc)}%</span>
      </div>
      <div className="h-1 w-full bg-white/5 rounded-none overflow-hidden">
        <div className="h-full bg-[#3b82f6] shadow-[0_0_20px_rgba(59,130,246,0.3)]" style={{ width: `${perc}%` }} />
      </div>
    </div>
  );
}