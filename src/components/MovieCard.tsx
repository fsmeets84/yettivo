"use client";

import { memo, useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWatchlist } from "@/context/WatchlistContext";
import { useCollections } from "@/context/CollectionContext";
import { useSession } from "next-auth/react";
import ConfirmModal from "./ConfirmModal";
import CreateCollectionModal from "./CreateCollectionModal";
import { format } from "date-fns";
import { 
  EyeIcon,
  StarIcon,
  BookmarkIcon as BookmarkOutline,
  CalendarIcon,
  PlusIcon,
  FolderIcon,
  PlusCircleIcon
} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid, EyeIcon as EyeSolid, CheckIcon } from "@heroicons/react/24/solid";

const MovieCard = memo(function MovieCard({ id, title, posterPath, voteAverage, type }: any) {
  const { status: sessionStatus } = useSession();
  const isLoggedIn = sessionStatus === "authenticated";

  const { 
    removeFromWatchlist, 
    addToWatchlist, 
    isInWatchlist, 
    isMovieWatched, 
    toggleWatched, 
    toggleAllEpisodesWatched,
    getWatchedEpisodesCount,
  } = useWatchlist();

  const { collections, addItemToCollection, removeItemFromCollection } = useCollections();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showCollections, setShowCollections] = useState(false);
  const [mediaStatus, setMediaStatus] = useState<string | null>(null);
  const [nextAirDate, setNextAirDate] = useState<string | null>(null);
  const [totalEpisodes, setTotalEpisodes] = useState<number>(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const inWatchlist = isInWatchlist(id);
  const isWatched = isMovieWatched(id);
  
  // Controleer of de film in ten minste één collectie zit
  const inAnyCollection = collections.some(col => col.items.some(i => i.tmdbId === id));
  
  const watchedCount = type === 'tv' ? getWatchedEpisodesCount(id) : 0;
  const progress = totalEpisodes > 0 ? (watchedCount / totalEpisodes) * 100 : 0;

  // Huidig item object om door te geven aan de modal
  const currentItem = {
    tmdbId: id,
    title,
    posterPath,
    type,
    voteAverage
  };

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
    const fetchDetails = async () => {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      try {
        const res = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}`);
        const data = await res.json();
        setMediaStatus(data.status);
        if (type === "tv") {
          setTotalEpisodes(data.number_of_episodes || 0);
          if (data.next_episode_to_air) {
            setNextAirDate(data.next_episode_to_air.air_date);
          }
        }
      } catch (error) {
        console.error("Error fetching card details:", error);
      }
    };
    fetchDetails();
  }, [id, type]);

  const handleToggleWatchlist = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (inWatchlist) { await removeFromWatchlist(id, type); } 
    else { await addToWatchlist(currentItem); }
  };

  const handleToggleWatched = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (type === 'movie') { await toggleWatched(id, { title, posterPath, voteAverage }); } 
    else { setIsModalOpen(true); }
  };

  const handleCollectionToggle = (e: React.MouseEvent, collectionId: string, inCollection: boolean) => {
    e.preventDefault(); e.stopPropagation();
    if (inCollection) {
      removeItemFromCollection(collectionId, id);
    } else {
      addItemToCollection(collectionId, currentItem);
    }
  };

  const getStatusLabel = (s: string | null) => {
    switch (s) {
      case "Returning Series": return { label: "Airing", style: "text-blue-400 border-blue-400/40 bg-black/60" };
      case "Ended": return { label: "Ended", style: "text-zinc-400 border-zinc-500/40 bg-black/60" };
      case "Released": return { label: "Released", style: "text-[#3b82f6] border-[#3b82f6]/40 bg-black/60" };
      default: return { label: s || "", style: "text-white/70 border-white/10 bg-black/60" };
    }
  };

  const statusInfo = getStatusLabel(mediaStatus);

  return (
    <>
      <div ref={dropdownRef} className="group space-y-3 relative outline-none animate-in fade-in duration-500">
        <div className={`relative aspect-[2/3] overflow-hidden rounded-sm border transition-all duration-500 ${
          isLoggedIn && (inWatchlist || inAnyCollection) ? 'border-zinc-500/30' : 'border-white/10'
        } ${isLoggedIn && inWatchlist ? 'border-[#3b82f6]/60 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : ''} bg-zinc-900 group-hover:border-white/30`}>
          
          <Link href={`/${type}/${id}`} className="block w-full h-full relative z-0">
            {posterPath ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${posterPath}`}
                alt={title || ""}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className={`object-cover transition-all duration-700 ${isLoggedIn && isWatched ? 'opacity-20 grayscale' : 'opacity-90 group-hover:opacity-100 group-hover:scale-105'}`}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-700 text-[10px] font-black uppercase tracking-widest">No Image</div>
            )}
          </Link>

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 pointer-events-none z-10" />

          {isLoggedIn && (
            <>
              {mediaStatus && (
                <div className="absolute top-2 right-2 z-30 pointer-events-none">
                  <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 border backdrop-blur-md rounded-sm shadow-2xl ${statusInfo.style}`}>
                    {statusInfo.label}
                  </span>
                </div>
              )}

              <div className="absolute top-2 left-2 flex gap-1.5 z-30">
                <button
                  onClick={handleToggleWatchlist}
                  className={`p-2 rounded-sm border transition-all duration-300 shadow-xl ${
                    inWatchlist 
                      ? 'bg-[#3b82f6] border-[#3b82f6] text-white opacity-100' 
                      : 'bg-black/80 backdrop-blur-md border-white/20 text-white/70 opacity-0 group-hover:opacity-100 hover:text-white hover:bg-[#3b82f6] -translate-x-2 group-hover:translate-x-0'
                  }`}
                >
                  {inWatchlist ? <BookmarkSolid className="h-4 w-4" /> : <BookmarkOutline className="h-4 w-4 stroke-[2px]" />}
                </button>

                <button
                  onClick={handleToggleWatched}
                  className={`p-2 rounded-sm border transition-all duration-300 shadow-xl ${
                    isWatched 
                      ? 'bg-emerald-500 border-emerald-500 text-white opacity-100' 
                      : 'bg-black/80 backdrop-blur-md border-white/20 text-white/70 opacity-0 group-hover:opacity-100 hover:text-white hover:bg-emerald-500 -translate-x-2 group-hover:translate-x-0'
                  }`}
                >
                  {isWatched ? <EyeSolid className="h-4 w-4" /> : <EyeIcon className="h-4 w-4 stroke-[2px]" />}
                </button>

                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowCollections(!showCollections); }}
                  className={`p-2 rounded-sm border transition-all duration-300 shadow-xl ${
                    inAnyCollection || showCollections
                      ? 'bg-violet-600 border-violet-600 text-white opacity-100 translate-x-0' 
                      : 'bg-black/80 backdrop-blur-md border-white/20 text-white/70 opacity-0 group-hover:opacity-100 hover:text-white hover:bg-violet-600 -translate-x-2 group-hover:translate-x-0'
                  }`}
                >
                  {inAnyCollection && !showCollections ? <FolderIcon className="h-4 w-4 stroke-[2px]" /> : <PlusIcon className="h-4 w-4 stroke-[2px]" />}
                </button>
              </div>

              {showCollections && (
                <div className="absolute top-12 left-2 w-48 bg-[#0d0d0f] border border-white/10 rounded-sm shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 p-1 flex flex-col">
                  <p className="text-[8px] font-black text-violet-500 uppercase tracking-widest p-2 border-b border-white/5 mb-1">Collection</p>
                  
                  <div className="max-h-40 overflow-y-auto custom-scrollbar flex-grow">
                    {collections.length > 0 ? collections.map(col => {
                      const inCollection = col.items.some(i => i.tmdbId === id);
                      return (
                        <button
                          key={col.id}
                          onClick={(e) => handleCollectionToggle(e, col.id, inCollection)}
                          className="w-full flex items-center justify-between p-2 hover:bg-white/5 rounded-sm transition-colors group/item"
                        >
                          <div className="flex items-center gap-2">
                            <FolderIcon className={`h-3.5 w-3.5 ${inCollection ? 'text-violet-400' : 'text-zinc-600'}`} />
                            <span className={`text-[10px] font-bold truncate max-w-[100px] ${inCollection ? 'text-white' : 'text-zinc-400'}`}>{col.name}</span>
                          </div>
                          {inCollection && <CheckIcon className="h-3 w-3 text-violet-400" />}
                        </button>
                      );
                    }) : (
                      <p className="p-3 text-[9px] text-zinc-600 uppercase font-black text-center">No collections</p>
                    )}
                  </div>

                  <button 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      e.stopPropagation(); 
                      setShowCollections(false);
                      setIsCreateModalOpen(true); 
                    }}
                    className="mt-1 p-2 border-t border-white/5 flex items-center gap-2 hover:bg-violet-600/10 transition-colors rounded-sm group/btn text-left"
                  >
                    <PlusCircleIcon className="h-4 w-4 text-violet-500 group-hover/btn:scale-110 transition-transform" />
                    <span className="text-[9px] font-black text-white uppercase tracking-widest">Create New</span>
                  </button>
                </div>
              )}
            </>
          )}

          {isLoggedIn && type === 'tv' && watchedCount > 0 && !isWatched && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-30">
              <div className="h-full bg-[#3b82f6] shadow-[0_0_10px_rgba(59,130,246,0.8)] transition-all duration-700" style={{ width: `${progress}%` }} />
            </div>
          )}

          {nextAirDate && (
            <div className={`absolute ${watchedCount > 0 && !isWatched ? 'bottom-1' : 'bottom-0'} left-0 right-0 py-2.5 px-3 bg-black/90 backdrop-blur-xl border-t border-white/10 z-20 pointer-events-none flex items-center gap-2`}>
              <CalendarIcon className="h-3.5 w-3.5 text-[#3b82f6]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">
                <span className="text-zinc-500 mr-1">Next:</span>{format(new Date(nextAirDate), "dd MMM")}
              </span>
            </div>
          )}

          {!nextAirDate && (
            <div className={`absolute ${watchedCount > 0 && !isWatched ? 'bottom-3' : 'bottom-2'} right-2 z-20 pointer-events-none`}>
              <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-sm border border-white/10 shadow-2xl">
                <StarIcon className="h-3.5 w-3.5 text-[#3b82f6] fill-[#3b82f6]" />
                <span className="text-[11px] font-bold text-white leading-none">{voteAverage > 0 ? voteAverage.toFixed(1) : "N/A"}</span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-1 px-0.5">
          <h3 className={`text-[13px] font-bold truncate tracking-tight transition-colors duration-300 ${isLoggedIn && inWatchlist ? 'text-[#3b82f6]' : 'text-zinc-100 group-hover:text-white'}`}>
            {title}
          </h3>
          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-2">
            {type === 'movie' ? 'Movie' : 'Series'}
            {isLoggedIn && type === 'tv' && watchedCount > 0 && !isWatched && (
              <span className="text-[#3b82f6] tracking-normal font-bold">{watchedCount}/{totalEpisodes}</span>
            )}
          </span>
        </div>
      </div>

      <ConfirmModal 
        isOpen={isModalOpen}
        title={isWatched ? "Remove Status" : "Mark Completed"}
        message={isWatched ? `Remove completed status for "${title}"?` : `Mark all episodes of "${title}" as completed?`}
        onConfirm={async () => {
          setIsModalOpen(false);
          await toggleAllEpisodesWatched(id, { title, posterPath, voteAverage, forceUnwatch: isWatched } as any);
        }}
        onCancel={() => setIsModalOpen(false)}
      />

      <CreateCollectionModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        itemToAutoAdd={currentItem} // Geeft het item mee voor automatische toevoeging
      />
    </>
  );
});

export default MovieCard;