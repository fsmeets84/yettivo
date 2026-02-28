"use client";

import { useWatchlist } from "@/context/WatchlistContext";
import { useCollections } from "@/context/CollectionContext";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import CreateCollectionModal from "@/components/CreateCollectionModal";
import { 
  UserIcon, 
  ArchiveBoxIcon, 
  FilmIcon, 
  TvIcon, 
  StarIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  RectangleStackIcon,
  PlusIcon,
  ClockIcon,
  FolderIcon
} from "@heroicons/react/24/outline";
import { format } from "date-fns";

export default function AccountPage() {
  const { watchlist } = useWatchlist();
  const { collections } = useCollections();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isLoggedIn = status === "authenticated";
  const user = session?.user;

  useEffect(() => {
    setMounted(true);
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (!mounted || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c]">
        <div className="h-6 w-6 border-2 border-[#3b82f6]/20 border-t-[#3b82f6] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) return null;

  // Statistieken
  const totalItems = watchlist.length;
  const movieCount = watchlist.filter(item => item.type === 'movie').length;
  const tvCount = watchlist.filter(item => item.type === 'tv').length;
  const avgRating = totalItems > 0 
    ? (watchlist.reduce((acc, item) => acc + (item.voteAverage || 0), 0) / totalItems).toFixed(1)
    : "0.0";

  const recentAdditions = [...watchlist]
    .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
    .slice(0, 5);
  
  const seriesWithProgress = watchlist
    .filter(i => i.type === 'tv' && (i.watchedEpisodes?.length ?? 0) > 0 && !i.isWatched)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-[#0a0a0c] pt-32 pb-20">
      <div className="container mx-auto px-8 relative z-10">
        
        {/* Profile Header */}
        <header className="flex items-center justify-between border-b border-white/5 pb-10 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 rounded-sm bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center shadow-xl">
              <UserIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tighter uppercase">
                {user?.name || "Member"}
              </h1>
              <p className="text-[10px] font-black text-zinc-500 mt-1 uppercase tracking-[0.3em]">
                Personal Profile — <span className="text-[#3b82f6] lowercase">{user?.email}</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-zinc-500 mb-1 uppercase tracking-widest">Collection Size</p>
            <p className="text-4xl font-black text-white leading-none tracking-tighter">{totalItems}</p>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <StatCard label="Watchlist" value={totalItems} icon={<ArchiveBoxIcon className="h-4 w-4" />} />
          <StatCard label="Movies" value={movieCount} icon={<FilmIcon className="h-4 w-4" />} />
          <StatCard label="TV Shows" value={tvCount} icon={<TvIcon className="h-4 w-4" />} />
          <StatCard label="Avg Rating" value={avgRating} icon={<StarIcon className="h-4 w-4" />} />
        </div>

        {/* Collections Section */}
        <section className="mb-20 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-600/10 rounded-sm">
                <RectangleStackIcon className="h-5 w-5 text-violet-500" />
              </div>
              <h2 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Custom Archives</h2>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/account/collection" className="text-[10px] font-black text-zinc-500 hover:text-violet-400 transition-all uppercase tracking-widest">
                View All Archives
              </Link>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-[10px] font-black uppercase tracking-widest rounded-sm transition-all shadow-lg shadow-violet-600/20 active:scale-95"
              >
                <PlusIcon className="h-3 w-3" /> New Collection
              </button>
            </div>
          </div>

          {collections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {collections.slice(0, 4).map((coll) => {
                const previewItems = coll.items.slice(0, 3);
                return (
                  <Link 
                    key={coll.id} 
                    href={`/account/collection/${coll.id}`}
                    className="group relative p-6 bg-[#0d0d0f] border border-white/5 rounded-sm hover:border-violet-500/40 transition-all duration-500 overflow-hidden shadow-xl min-h-[220px] flex flex-col justify-between"
                  >
                    {/* Background Preview Posters */}
                    <div className="absolute inset-0 z-0 flex opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-30 transition-all duration-700">
                      {previewItems.length > 0 ? (
                        previewItems.map((item, idx) => (
                          <div key={idx} className="relative flex-1 h-full border-r border-black/20 last:border-0">
                            <Image
                              src={`https://image.tmdb.org/t/p/w300${item.posterPath}`}
                              alt=""
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))
                      ) : (
                        <div className="w-full h-full bg-[#0d0d0f]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] via-[#0d0d0f]/80 to-[#0d0d0f]/40" />
                    </div>

                    <div className="relative z-10 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="p-2 bg-violet-600/20 backdrop-blur-md rounded-sm border border-violet-500/30 group-hover:bg-violet-600 group-hover:text-white transition-all duration-500">
                          <FolderIcon className="h-4 w-4 text-violet-500 group-hover:text-white" />
                        </div>
                        <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">
                          {format(coll.createdAt, "MMM yyyy")}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg leading-tight group-hover:text-violet-400 transition-colors truncate uppercase tracking-tighter">
                          {coll.name}
                        </h3>
                        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1">
                          {coll.items.length} {coll.items.length === 1 ? 'Entry' : 'Entries'}
                        </p>
                      </div>
                    </div>

                    <div className="relative z-10 flex items-center text-[9px] font-black text-zinc-500 uppercase tracking-widest gap-1 group-hover:text-white transition-colors">
                      Open Archive <ChevronRightIcon className="h-2.5 w-2.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div 
              onClick={() => setIsModalOpen(true)}
              className="group p-12 border border-dashed border-white/5 rounded-sm text-center hover:border-violet-500/20 transition-all cursor-pointer bg-white/[0.01]"
            >
              <RectangleStackIcon className="h-8 w-8 text-zinc-800 mx-auto mb-4 group-hover:text-violet-500/40 transition-colors" />
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">No custom archives created yet</p>
              <p className="text-violet-500 text-[9px] font-bold uppercase mt-2 opacity-0 group-hover:opacity-100 transition-opacity tracking-widest">Click to create your first folder</p>
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">
            
            {/* Recent Activity */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#3b82f6]">
                  <ArrowPathIcon className="h-4 w-4" />
                  <h2 className="text-[10px] font-black text-white tracking-[0.2em] uppercase">Recently Added</h2>
                </div>
                <Link href="/watchlist" className="text-[10px] font-black text-zinc-500 hover:text-[#3b82f6] transition-all flex items-center gap-1 uppercase tracking-widest">
                  View full list <ChevronRightIcon className="h-3 w-3" />
                </Link>
              </div>
              
              <div className="grid grid-cols-5 gap-4">
                {recentAdditions.map((item) => {
                  const pPath = item.posterPath || (item as any).poster_path;
                  return (
                    <Link 
                      key={`${item.type}-${item.tmdbId}`} 
                      href={`/${item.type}/${item.tmdbId}`} 
                      className="group relative aspect-[2/3] rounded-sm overflow-hidden border border-white/5 bg-zinc-900 transition-all hover:border-[#3b82f6]/50"
                    >
                      {pPath ? (
                        <Image 
                          src={`https://image.tmdb.org/t/p/w300${pPath}`} 
                          alt="" 
                          fill 
                          className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px] text-zinc-800 uppercase font-black bg-zinc-900">No Image</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                        <p className="text-[8px] font-black text-white uppercase truncate tracking-tighter">{item.title}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* Progress Section */}
            <section className="space-y-6">
              <h2 className="text-[10px] font-black text-white tracking-[0.2em] uppercase">Currently Watching</h2>
              <div className="grid gap-3">
                {seriesWithProgress.length > 0 ? seriesWithProgress.map(series => {
                  const episodesCount = series.watchedEpisodes?.length || 0;
                  const pPath = series.posterPath || (series as any).poster_path;
                  return (
                    <Link 
                      key={series.tmdbId} 
                      href={`/tv/${series.tmdbId}`}
                      className="p-4 rounded-sm bg-white/[0.02] border border-white/5 flex items-center gap-6 hover:bg-white/[0.05] transition-all border-l-2 border-l-[#3b82f6] group"
                    >
                      <div className="h-12 w-8 relative rounded-sm overflow-hidden flex-shrink-0 bg-zinc-900">
                        {pPath && <Image src={`https://image.tmdb.org/t/p/w92${pPath}`} alt="" fill className="object-cover opacity-90" />}
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between items-end mb-2">
                           <p className="text-xs font-bold text-white group-hover:text-[#3b82f6] transition-colors">{series.title}</p>
                           <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                             {episodesCount} episodes watched
                           </span>
                         </div>
                         <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-[#3b82f6] w-1/3 shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
                         </div>
                      </div>
                    </Link>
                  );
                }) : (
                  <div className="p-8 border border-dashed border-white/5 rounded-sm text-center">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">No active series</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Distribution Sidebar */}
          <aside className="lg:col-span-4 animate-in fade-in slide-in-from-right-4 duration-1000">
            <div className="p-8 rounded-sm bg-white/[0.02] border border-white/5 shadow-2xl">
              <h2 className="text-[10px] font-black text-white mb-10 tracking-[0.2em] uppercase">Library Distribution</h2>
              <div className="space-y-10">
                <DistributionBar label="Movies" count={movieCount} total={totalItems} />
                <DistributionBar label="TV Shows" count={tvCount} total={totalItems} />
              </div>
            </div>
          </aside>
        </div>
      </div>

      <CreateCollectionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </main>
  );
}

function StatCard({ label, value, icon }: any) {
  return (
    <div className="group relative p-6 rounded-sm bg-white/[0.02] border border-white/5 hover:border-[#3b82f6]/30 transition-all duration-500">
      <div className="flex items-center gap-3 mb-3 text-zinc-500 group-hover:text-[#3b82f6] transition-colors">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
      </div>
      <p className="text-4xl font-black text-white tracking-tighter">{value}</p>
    </div>
  );
}

function DistributionBar({ label, count, total }: any) {
  const perc = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="space-y-4">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em]">
        <span className="text-zinc-500">{label}</span>
        <span className="text-[#3b82f6]">{Math.round(perc)}%</span>
      </div>
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-[#3b82f6]" style={{ width: `${perc}%` }} />
      </div>
    </div>
  );
}