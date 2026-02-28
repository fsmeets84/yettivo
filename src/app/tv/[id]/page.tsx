"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useWatchlist } from "@/context/WatchlistContext";
import { useCollections } from "@/context/CollectionContext"; // Importeer Collections
import { useSession } from "next-auth/react";
import { 
  StarIcon, CalendarIcon, TvIcon,
  ChevronLeftIcon, InformationCircleIcon,
  ArrowPathIcon, CheckCircleIcon,
  Squares2X2Icon, UserGroupIcon,
  DocumentTextIcon, ClockIcon,
  FolderPlusIcon, FolderIcon, PlusCircleIcon
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckSolid, CheckIcon } from "@heroicons/react/24/solid";
import { useParams, useRouter } from "next/navigation";

import TrailerModal from "@/components/TrailerModal";
import ConfirmModal from "@/components/ConfirmModal";
import WatchlistButton from "@/components/WatchlistButton";
import MarkWatchedButton from "@/components/MarkWatchedButton";
import PlayTrailerButton from "@/components/PlayTrailerButton";
import CastSection from "@/components/CastSection";
import CreateCollectionModal from "@/components/CreateCollectionModal";

export default function TvShowDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  const [show, setShow] = useState<any>(null);
  const [activeSeason, setActiveSeason] = useState(1);
  const [activeTab, setActiveTab] = useState<"details" | "seasons" | "cast">("seasons");
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [episodesLoading, setEpisodesLoading] = useState(false);

  const [trailer, setTrailer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  
  // Collections states
  const [showCollections, setShowCollections] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { 
    isMovieWatched, 
    toggleAllEpisodesWatched,
    toggleEpisodeWatched,
    toggleSeasonWatched,
    setMovieInProgress, 
    watchlist 
  } = useWatchlist();

  const { collections, addItemToCollection, removeItemFromCollection } = useCollections();

  const showInDb = watchlist.find(item => String(item.tmdbId) === String(id) && item.type === 'tv');
  const watched = isMovieWatched(Number(id));
  const isInProgress = showInDb?.inProgress || (showInDb?.watchedEpisodes?.length ?? 0) > 0;
  const inAnyCollection = collections.some(col => col.items.some(i => String(i.tmdbId) === String(id)));

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCollections(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchShowData = async () => {
      if (!id) return;
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      try {
        setLoading(true);
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&append_to_response=videos,images&include_image_language=en,null`
        );
        const data = await res.json();
        const logo = data.images?.logos?.find((l: any) => l.file_path);
        setShow({ ...data, logoPath: logo?.file_path });
        const video = data.videos?.results.find((v: any) => v.type === "Trailer" && v.site === "YouTube");
        if (video) setTrailer(video.key);
      } catch (error) { 
        console.error("Error fetching TV data:", error); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchShowData();
  }, [id]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      if (!id || !show || activeTab !== "seasons") return;
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      try {
        setEpisodesLoading(true);
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/season/${activeSeason}?api_key=${apiKey}`
        );
        const data = await res.json();
        setEpisodes(data.episodes || []);
      } catch (error) {
        console.error("Error fetching episodes:", error);
      } finally {
        setEpisodesLoading(false);
      }
    };
    fetchEpisodes();
  }, [id, activeSeason, show, activeTab]);

  const handleCollectionToggle = (collectionId: string, inCollection: boolean) => {
    if (!show) return;
    const item = { 
      tmdbId: Number(id), 
      title: show.name, 
      posterPath: show.poster_path, 
      type: 'tv' as const, 
      voteAverage: show.vote_average 
    };
    if (inCollection) {
      removeItemFromCollection(collectionId, Number(id));
    } else {
      addItemToCollection(collectionId, item);
    }
  };

  const handleWatchedToggle = async () => {
    setIsConfirmModalOpen(false);
    if (!show) return;
    try {
      if (watched) {
        await toggleAllEpisodesWatched(Number(id), { 
          title: show.name, 
          posterPath: show.poster_path, 
          voteAverage: show.vote_average,
          forceUnwatch: true 
        } as any);
      } else {
        await toggleAllEpisodesWatched(Number(id), { 
          title: show.name, 
          posterPath: show.poster_path, 
          voteAverage: show.vote_average 
        });
      }
    } catch (error) {
      console.error("Failed to toggle watch status:", error);
    }
  };

  const handleEpisodeClick = async (seasonNum: number, epNum: number) => {
    if (!isLoggedIn || !show) return;
    const epKey = `${seasonNum}-${epNum}`;
    const isCurrentlyMarked = showInDb?.watchedEpisodes?.includes(epKey);
    const currentCount = showInDb?.watchedEpisodes?.length ?? 0;
    try {
      await toggleEpisodeWatched(Number(id), seasonNum, epNum);
      if (!isCurrentlyMarked && currentCount === 0) {
        await setMovieInProgress(Number(id), true, show.name, show.poster_path, 'tv');
      } else if (isCurrentlyMarked && currentCount === 1) {
        await setMovieInProgress(Number(id), false, show.name, show.poster_path, 'tv');
      }
    } catch (error) {
      console.error("Error updating episode:", error);
    }
  };

  const handleSeasonWatchedToggle = async () => {
    if (!show || !episodes.length) return;
    const seasonNum = activeSeason;
    const isSeasonFullyWatched = episodes.every(ep => 
      showInDb?.watchedEpisodes?.includes(`${seasonNum}-${ep.episode_number}`)
    );
    try {
      await toggleSeasonWatched(Number(id), seasonNum, episodes, !isSeasonFullyWatched);
      if (!isSeasonFullyWatched && !showInDb?.inProgress) {
        await setMovieInProgress(Number(id), true, show.name, show.poster_path, 'tv');
      }
    } catch (error) {
      console.error("Error updating season:", error);
    }
  };

  if (loading || !show) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c]">
      <div className="h-6 w-6 border-2 border-[#3b82f6]/20 border-t-[#3b82f6] rounded-full animate-spin" />
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0a0a0c] text-zinc-400 pb-20 relative overflow-hidden">
      {trailer && <TrailerModal videoKey={trailer} isOpen={isTrailerOpen} onClose={() => setIsTrailerOpen(false)} />}
      
      <CreateCollectionModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        itemToAutoAdd={show ? {
          tmdbId: Number(id),
          title: show.name,
          posterPath: show.poster_path,
          type: 'tv',
          voteAverage: show.vote_average
        } : null}
      />

      <ConfirmModal 
        isOpen={isConfirmModalOpen}
        title={watched ? "Mark as Unwatched" : "Mark as Watched"}
        message={watched ? `Remove "${show.name}" from your watched records?` : `Mark all episodes of "${show.name}" as watched?`}
        onConfirm={handleWatchedToggle}
        onCancel={() => setIsConfirmModalOpen(false)}
      />

      <section className="relative h-[85vh] w-full">
        <div className="absolute inset-0 z-0" style={{ maskImage: 'linear-gradient(to bottom, black 30%, transparent 90%)' }}>
          {show.backdrop_path && <Image src={`https://image.tmdb.org/t/p/original${show.backdrop_path}`} alt="" fill className="absolute object-cover opacity-30 grayscale-[0.2]" priority />}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent z-[2]" />
        <button onClick={() => router.back()} className="absolute top-28 left-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-[#3b82f6] transition-all z-30 group">
          <ChevronLeftIcon className="h-3 w-3 transition-transform group-hover:-translate-x-1" /> Back
        </button>
      </section>

      <div className="container mx-auto px-8 -mt-96 relative z-10 pb-20">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          <div className="w-72 flex-shrink-0 mx-auto lg:mx-0 space-y-10">
            <div className="aspect-[2/3] relative overflow-hidden shadow-2xl rounded-sm border border-white/10 group bg-zinc-900">
              <Image src={`https://image.tmdb.org/t/p/w500${show.poster_path}`} alt={show.name} fill className="object-cover opacity-90 transition-transform duration-1000 group-hover:scale-110" />
            </div>

            <aside className="hidden lg:block space-y-2 sticky top-28">
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4 px-2">Navigation</p>
              
              <button onClick={() => setActiveTab("details")} className={`w-full flex items-center gap-4 px-4 py-4 rounded-sm transition-all duration-300 ${activeTab === "details" ? "bg-[#3b82f6] text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]" : "text-zinc-500 hover:text-white hover:bg-white/5"}`}>
                <DocumentTextIcon className="h-5 w-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Details</span>
              </button>

              <button onClick={() => setActiveTab("seasons")} className={`w-full flex items-center gap-4 px-4 py-4 rounded-sm transition-all duration-300 ${activeTab === "seasons" ? "bg-[#3b82f6] text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]" : "text-zinc-500 hover:text-white hover:bg-white/5"}`}>
                <Squares2X2Icon className="h-5 w-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Seasons</span>
              </button>

              <button onClick={() => setActiveTab("cast")} className={`w-full flex items-center gap-4 px-4 py-4 rounded-sm transition-all duration-300 ${activeTab === "cast" ? "bg-[#3b82f6] text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]" : "text-zinc-500 hover:text-white hover:bg-white/5"}`}>
                <UserGroupIcon className="h-5 w-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Cast</span>
              </button>

              <div className="pt-8 space-y-4 px-2 border-t border-white/5">
                <MetaMini label="Status" value={show.status} />
                <MetaMini label="Episodes" value={show.number_of_episodes} />
                <MetaMini label="Network" value={show.networks?.[0]?.name} />
              </div>
            </aside>
          </div>

          <div className="flex-1 space-y-10 pt-8 min-w-0">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-[#3b82f6]/10 border border-[#3b82f6]/20 rounded-sm">
                  <TvIcon className="h-3 w-3 text-[#3b82f6]" />
                  <span className="text-[#3b82f6] text-[10px] font-black tracking-widest uppercase">TV Show Info</span>
                </div>
                <div className="flex items-center gap-1.5 text-white font-black text-[10px] uppercase tracking-widest">
                  <StarIcon className="h-3.5 w-3.5 text-[#3b82f6] fill-[#3b82f6]" />
                  {show.vote_average?.toFixed(1)} Rating
                </div>
              </div>

              {show.logoPath ? (
                <div className="relative w-full max-w-[350px] h-32 md:max-w-[500px] md:h-44">
                  <Image src={`https://image.tmdb.org/t/p/original${show.logoPath}`} alt={show.name} fill className="object-contain object-left drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]" priority />
                </div>
              ) : (
                <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter leading-[0.85] uppercase">{show.name}</h1>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {isLoggedIn ? (
                <>
                  <WatchlistButton id={show.id} title={show.name} posterPath={show.poster_path} type="tv" voteAverage={show.vote_average} />
                  
                  {/* Collections Dropdown for TV */}
                  <div className="relative" ref={dropdownRef}>
                    <button 
                      onClick={() => setShowCollections(!showCollections)}
                      className={`flex items-center justify-center gap-3 px-8 py-4 rounded-sm border text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                        inAnyCollection
                        ? "bg-violet-600/10 border-violet-500/40 text-violet-400" 
                        : "bg-white/5 border border-white/10 text-zinc-400 hover:text-violet-400 hover:border-violet-500/30"
                      }`}
                    >
                      {inAnyCollection ? <FolderIcon className="h-4 w-4 fill-current" /> : <FolderPlusIcon className="h-4 w-4" />}
                      Collections
                    </button>

                    {showCollections && (
                      <div className="absolute top-full mt-2 left-0 w-64 bg-[#0d0d0f] border border-white/10 rounded-sm shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 p-1 flex flex-col">
                        <p className="text-[8px] font-black text-violet-500 uppercase tracking-widest p-3 border-b border-white/5 mb-1">Select Archive</p>
                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                          {collections.length > 0 ? collections.map(col => {
                            const inCol = col.items.some(i => String(i.tmdbId) === String(id));
                            return (
                              <button
                                key={col.id}
                                onClick={() => handleCollectionToggle(col.id, inCol)}
                                className="w-full flex items-center justify-between p-3 hover:bg-white/5 rounded-sm transition-colors group/item"
                              >
                                <div className="flex items-center gap-3">
                                  <FolderIcon className={`h-4 w-4 ${inCol ? 'text-violet-400' : 'text-zinc-600'}`} />
                                  <span className={`text-[11px] font-bold ${inCol ? 'text-white' : 'text-zinc-400'}`}>{col.name}</span>
                                </div>
                                {inCol && <CheckIcon className="h-4 w-4 text-violet-400" />}
                              </button>
                            );
                          }) : (
                            <p className="p-4 text-[10px] text-zinc-600 uppercase font-black text-center">No archives found</p>
                          )}
                        </div>
                        <button 
                          onClick={() => { setShowCollections(false); setIsCreateModalOpen(true); }}
                          className="mt-1 p-3 border-t border-white/5 flex items-center gap-3 hover:bg-violet-600/10 transition-colors rounded-sm group/btn text-left"
                        >
                          <PlusCircleIcon className="h-5 w-5 text-violet-500 group-hover/btn:scale-110 transition-transform" />
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">Create New Archive</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className={`flex items-center justify-center gap-3 px-8 py-4 rounded-sm border text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 min-w-[160px] ${isInProgress && !watched ? "bg-orange-500 border-orange-400 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)]" : "bg-white/5 border border-white/10 text-zinc-600 opacity-50"}`}>
                    <ArrowPathIcon className={`h-4 w-4 ${isInProgress && !watched ? "animate-spin-slow" : ""}`} />
                    {isInProgress && !watched ? "Currently Watching" : "No active progress"}
                  </div>
                  <MarkWatchedButton onMark={() => setIsConfirmModalOpen(true)} isWatched={watched} />
                </>
              ) : (
                <div className="px-6 py-4 rounded-sm bg-white/[0.02] border border-dashed border-white/10 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Sign in to track your shows</div>
              )}
              {trailer && <PlayTrailerButton onClick={() => setIsTrailerOpen(true)} />}
            </div>

            {/* DYNAMIC CONTENT AREA */}
            <div className="pt-10 border-t border-white/5 min-h-[600px]">
              {/* Mobile Tab Switcher */}
              <div className="lg:hidden flex gap-2 mb-8 animate-in fade-in duration-700">
                <button onClick={() => setActiveTab("details")} className={`flex-1 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest border transition-colors ${activeTab === "details" ? "bg-[#3b82f6] border-[#3b82f6] text-white" : "bg-white/5 border-white/10 text-zinc-500"}`}>Details</button>
                <button onClick={() => setActiveTab("seasons")} className={`flex-1 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest border transition-colors ${activeTab === "seasons" ? "bg-[#3b82f6] border-[#3b82f6] text-white" : "bg-white/5 border-white/10 text-zinc-500"}`}>Seasons</button>
                <button onClick={() => setActiveTab("cast")} className={`flex-1 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest border transition-colors ${activeTab === "cast" ? "bg-[#3b82f6] border-[#3b82f6] text-white" : "bg-white/5 border-white/10 text-zinc-500"}`}>Cast</button>
              </div>

              <div className="bg-white/[0.01] border border-white/5 p-4 sm:p-8 rounded-sm backdrop-blur-sm">
                {activeTab === "details" ? (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="space-y-4 max-w-3xl">
                      <h2 className="text-[10px] font-black text-[#3b82f6] tracking-[0.3em] uppercase opacity-60">Synopsis</h2>
                      <p className="text-lg leading-relaxed text-zinc-300 font-medium tracking-tight">{show.overview}</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-10 border-t border-white/5">
                      <MetaItem label="First Air Date" value={show.first_air_date ? new Date(show.first_air_date).getFullYear() : "N/A"} icon={<CalendarIcon className="h-4 w-4" />} />
                      <MetaItem label="Seasons" value={show.number_of_seasons} icon={<TvIcon className="h-4 w-4" />} />
                      <MetaItem label="Episodes" value={show.number_of_episodes} icon={<InformationCircleIcon className="h-4 w-4" />} />
                      <MetaItem label="Status" value={show.status} icon={<StarIcon className="h-4 w-4" />} />
                    </div>
                  </div>
                ) : activeTab === "seasons" ? (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex flex-wrap gap-3">
                      {show.seasons?.filter((s: any) => s.season_number > 0).map((season: any) => {
                        const watchedInThisSeason = showInDb?.watchedEpisodes?.filter((ep: string) => ep.startsWith(`${season.season_number}-`)).length || 0;
                        const isSeasonFullyWatched = watchedInThisSeason >= season.episode_count;
                        const isSeasonInProgress = watchedInThisSeason > 0 && !isSeasonFullyWatched;
                        return (
                          <button key={season.id} onClick={() => setActiveSeason(season.season_number)} className={`relative px-5 py-2.5 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all border flex items-center gap-2 ${activeSeason === season.season_number ? "bg-[#3b82f6] text-white border-[#3b82f6] shadow-[0_0_20px_rgba(59,130,246,0.3)]" : isSeasonInProgress ? "bg-orange-500/5 border-orange-500/30 text-orange-500 hover:bg-orange-500/10" : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10"}`}>
                            {isSeasonFullyWatched ? <CheckSolid className={`h-3 w-3 ${activeSeason === season.season_number ? "text-white" : "text-[#10b981]"}`} /> : isSeasonInProgress ? <ArrowPathIcon className={`h-3 w-3 animate-spin-slow ${activeSeason === season.season_number ? "text-white" : "text-orange-500"}`} /> : null}
                            Season {season.season_number}
                            {watchedInThisSeason > 0 && <div className={`absolute bottom-0 left-0 h-[2px] transition-all duration-500 ${isSeasonFullyWatched ? "bg-[#10b981]" : "bg-orange-500"}`} style={{ width: `${(watchedInThisSeason / season.episode_count) * 100}%` }} />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="space-y-6 pt-4 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <h2 className="text-[10px] font-black text-[#3b82f6] tracking-[0.3em] uppercase opacity-60">Episodes — Season {activeSeason}</h2>
                        {isLoggedIn && (
                          <button onClick={handleSeasonWatchedToggle} className="flex items-center gap-2 px-4 py-2 rounded-sm bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-[#3b82f6]/20 hover:border-[#3b82f6]/40 transition-all group">
                            <CheckCircleIcon className="h-3.5 w-3.5 group-hover:text-[#3b82f6]" />
                            {episodes.every(ep => showInDb?.watchedEpisodes?.includes(`${activeSeason}-${ep.episode_number}`)) ? "Unmark Season" : "Mark Season"}
                          </button>
                        )}
                      </div>
                      <div className="grid gap-4">
                        {episodesLoading ? (
                           <div className="py-10 text-zinc-600 text-xs animate-pulse tracking-widest uppercase font-black">Loading Episodes...</div>
                        ) : (
                          episodes.map((ep) => {
                            const isEpWatched = showInDb?.watchedEpisodes?.includes(`${activeSeason}-${ep.episode_number}`);
                            return (
                              <div key={ep.id} className="group flex flex-col sm:flex-row items-center p-4 rounded-sm border border-white/5 hover:border-[#3b82f6]/30 transition-all gap-5 bg-white/[0.01]">
                                <div className="relative w-full sm:w-40 h-24 rounded-sm overflow-hidden flex-shrink-0 border border-white/10 bg-black">
                                  {ep.still_path && <Image src={`https://image.tmdb.org/t/p/w300${ep.still_path}`} alt="" fill className="object-cover opacity-60 group-hover:opacity-100 transition-opacity" />}
                                  <span className="absolute bottom-2 left-3 text-[9px] font-black text-[#3b82f6] uppercase">EP {ep.episode_number}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-white truncate">{ep.name}</p>
                                  <p className="text-[12px] text-zinc-400 line-clamp-2 mt-1 leading-relaxed">{ep.overview || "No synopsis available."}</p>
                                </div>
                                {isLoggedIn && (
                                  <button onClick={() => handleEpisodeClick(activeSeason, ep.episode_number)} className={`p-3 rounded-sm transition-all ${isEpWatched ? "text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/30" : "text-zinc-500 hover:text-white bg-white/5 border border-white/10"}`}>
                                    {isEpWatched ? <CheckSolid className="h-5 w-5" /> : <CheckCircleIcon className="h-5 w-5" />}
                                  </button>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-700">
                    <CastSection id={Number(id)} type="tv" />
                  </div>
                )}
              </div>
            </div>
          </div> 
        </div>
      </div>
    </main>
  );
}

function MetaItem({ label, value, icon }: { label: string, value: any, icon: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-[#3b82f6]/60">
        {icon}
        <span className="text-[9px] font-black tracking-widest uppercase">{label}</span>
      </div>
      <p className="text-sm font-bold text-white uppercase tracking-tighter">{value}</p>
    </div>
  );
}

function MetaMini({ label, value }: { label: string, value: any }) {
  return (
    <div className="space-y-1">
      <p className="text-[8px] font-black text-[#3b82f6]/50 uppercase tracking-widest">{label}</p>
      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">{value || "N/A"}</p>
    </div>
  );
}