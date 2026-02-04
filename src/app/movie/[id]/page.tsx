"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useWatchlist } from "@/context/WatchlistContext";
import { useSession } from "next-auth/react";
import { 
  StarIcon, CalendarIcon, ClockIcon, BookmarkIcon,
  ChevronLeftIcon, PlayIcon, EyeIcon, InformationCircleIcon,
  ArchiveBoxIcon, ArrowPathIcon
} from "@heroicons/react/24/outline";
import { 
  BookmarkIcon as BookmarkSolid, 
  EyeIcon as EyeSolid,
  CheckCircleIcon as CheckSolid 
} from "@heroicons/react/24/solid";
import { useParams, useRouter } from "next/navigation";
import TrailerModal from "@/components/TrailerModal";

export default function MovieDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  const [movie, setMovie] = useState<any>(null);
  const [trailer, setTrailer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  
  const { 
    isInWatchlist, 
    addToWatchlist, 
    removeFromWatchlist, 
    isMovieWatched, 
    toggleWatched,
    watchlist,
    setMovieInProgress 
  } = useWatchlist();

  const movieInDb = watchlist.find(item => String(item.tmdbId) === String(id));
  const watched = isMovieWatched(Number(id));
  const inWatchlist = isInWatchlist(Number(id));
  const isInProgress = movieInDb?.inProgress || false;

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!id) return;
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      try {
        setLoading(true);
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=videos,images&include_image_language=en,null`
        );
        const data = await res.json();
        
        const logo = data.images?.logos?.find((l: any) => l.file_path);
        setMovie({ ...data, logoPath: logo?.file_path });

        const video = data.videos?.results.find((v: any) => v.type === "Trailer" && v.site === "YouTube");
        if (video) setTrailer(video.key);

      } catch (error) { 
        console.error("Error fetching movie data:", error); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchMovieData();
  }, [id]);

  // VERBETERDE FUNCTIE: Toggle de watching status (starten of stoppen)
  const handleToggleWatching = async () => {
    if (watched || !isLoggedIn || !movie) return;

    try {
      // 1. Voeg toe aan watchlist als hij er nog niet in staat
      if (!inWatchlist) {
        await addToWatchlist({ 
          tmdbId: movie.id, 
          title: movie.title, 
          posterPath: movie.poster_path, 
          type: 'movie', 
          voteAverage: movie.vote_average 
        });
      }

      // 2. Toggle de status: als het true was naar false, en vice versa
      await setMovieInProgress(Number(id), !isInProgress);
    } catch (error) {
      console.error("Failed to toggle watching status:", error);
    }
  };

  const handleToggleWatched = async () => {
    if (!isLoggedIn || !id || !movie) return;
    
    await toggleWatched(Number(id), { 
      title: movie.title, 
      posterPath: movie.poster_path, 
      voteAverage: movie.vote_average 
    });
  };

  const handleWatchlistAction = async () => {
    if (!isLoggedIn || !movie) return;
    if (inWatchlist) {
      await removeFromWatchlist(movie.id, 'movie');
    } else {
      await addToWatchlist({ 
        tmdbId: movie.id, 
        title: movie.title, 
        posterPath: movie.poster_path, 
        type: 'movie', 
        voteAverage: movie.vote_average 
      });
    }
  };

  if (loading || !movie) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c]">
      <div className="h-6 w-6 border-2 border-[#3b82f6]/20 border-t-[#3b82f6] rounded-full animate-spin" />
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0a0a0c] text-zinc-400 pb-20 relative overflow-hidden">
      {trailer && (
        <TrailerModal 
          videoKey={trailer} 
          isOpen={isTrailerOpen} 
          onClose={() => setIsTrailerOpen(false)} 
        />
      )}

      <section className="relative h-[85vh] w-full">
        <div 
          className="absolute inset-0 z-0"
          style={{ maskImage: 'linear-gradient(to bottom, black 30%, transparent 90%)' }}
        >
          {movie.backdrop_path && (
            <Image 
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} 
              alt="" 
              fill 
              className="object-cover opacity-30 grayscale-[0.2]" 
              priority 
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent z-[2]" />
        
        <button 
          onClick={() => router.back()} 
          className="absolute top-28 left-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-[#3b82f6] transition-all z-30 group"
        >
          <ChevronLeftIcon className="h-3 w-3 transition-transform group-hover:-translate-x-1" /> Back to archive
        </button>
      </section>

      <div className="container mx-auto px-8 -mt-96 relative z-10 pb-20">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          <div className="w-72 flex-shrink-0 mx-auto lg:mx-0">
            <div className="aspect-[2/3] relative overflow-hidden shadow-2xl rounded-sm border border-white/10 group bg-zinc-900">
              {movie.poster_path ? (
                <Image 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                  alt={movie.title} 
                  fill 
                  className="object-cover opacity-90 transition-transform duration-1000 group-hover:scale-110" 
                />
              ) : (
                <div className="flex h-full items-center justify-center text-zinc-700 text-[10px] font-bold uppercase tracking-widest">No Poster</div>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-10 pt-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-[#3b82f6]/10 border border-[#3b82f6]/20 rounded-sm">
                  <ArchiveBoxIcon className="h-3 w-3 text-[#3b82f6]" />
                  <span className="text-[#3b82f6] text-[10px] font-black tracking-widest uppercase">Archive Entry</span>
                </div>
                <div className="flex items-center gap-1.5 text-white font-black text-[10px] uppercase tracking-widest">
                  <StarIcon className="h-3.5 w-3.5 text-[#3b82f6] fill-[#3b82f6]" />
                  {movie.vote_average?.toFixed(1)} Rating
                </div>
              </div>

              {movie.logoPath ? (
                <div className="relative w-full max-w-[350px] h-32 md:max-w-[500px] md:h-44">
                  <Image
                    src={`https://image.tmdb.org/t/p/original${movie.logoPath}`}
                    alt={movie.title}
                    fill
                    className="object-contain object-left drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                    priority
                  />
                </div>
              ) : (
                <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter leading-[0.85]">
                  {movie.title}
                </h1>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {isLoggedIn ? (
                <>
                  <button 
                    onClick={handleWatchlistAction} 
                    className={`flex items-center justify-center gap-3 px-8 py-4 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                      inWatchlist 
                      ? "bg-white/5 border border-white/10 text-zinc-400 hover:text-[#3b82f6] hover:border-[#3b82f6]/30" 
                      : "bg-[#3b82f6] text-white shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:scale-105"
                    }`}
                  >
                    {inWatchlist ? <BookmarkSolid className="h-4 w-4" /> : <BookmarkIcon className="h-4 w-4" />} 
                    Watchlist
                  </button>

                  <button 
                    onClick={handleToggleWatching}
                    disabled={watched}
                    className={`flex items-center justify-center gap-3 px-8 py-4 rounded-sm border text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                      watched ? "opacity-30 cursor-not-allowed border-white/5 bg-white/5 text-zinc-600" :
                      isInProgress 
                      ? "bg-orange-500 border-orange-400 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)]" 
                      : "bg-white/5 border border-white/10 text-zinc-400 hover:text-orange-500 hover:border-orange-500/30"
                    }`}
                  >
                    {isInProgress ? (
                      <ArrowPathIcon className="h-4 w-4 animate-spin-slow" />
                    ) : (
                      <PlayIcon className="h-4 w-4 fill-current" />
                    )}
                    {isInProgress ? "Currently Watching" : "Start Watching"}
                  </button>

                  <button 
                    onClick={handleToggleWatched} 
                    className={`flex items-center justify-center gap-3 px-8 py-4 rounded-sm border text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                      watched 
                      ? "bg-[#10b981]/10 border-[#10b981]/40 text-[#10b981]" 
                      : "bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-white/30"
                    }`}
                  >
                    {watched ? <CheckSolid className="h-4 w-4" /> : <EyeSolid className="h-4 w-4" />} 
                    {watched ? "Watched" : "Mark as Watched"}
                  </button>
                </>
              ) : (
                <div className="px-6 py-4 rounded-sm bg-white/[0.02] border border-dashed border-white/10">
                   <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                     Sign in to manage watchlist & track progress
                   </p>
                </div>
              )}

              {trailer && (
                <button 
                  onClick={() => setIsTrailerOpen(true)}
                  className="flex items-center justify-center gap-3 px-8 py-4 rounded-sm bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all group"
                >
                  <PlayIcon className="h-4 w-4 fill-[#3b82f6] text-[#3b82f6]" /> Trailer
                </button>
              )}
            </div>

            <div className="space-y-4 pt-4 max-w-3xl border-b border-white/5 pb-10">
              <h2 className="text-[10px] font-black text-[#3b82f6] tracking-[0.3em] uppercase opacity-60">SYNOPSIS</h2>
              <p className="text-lg leading-relaxed text-zinc-300 font-medium tracking-tight">{movie.overview}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-10 border-t border-white/5">
              <MetaItem label="Release Year" value={movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"} icon={<CalendarIcon className="h-4 w-4" />} />
              <MetaItem label="Runtime" value={`${movie.runtime || 0}m`} icon={<ClockIcon className="h-4 w-4" />} />
              <MetaItem label="Status" value={movie.status || "Unknown"} icon={<InformationCircleIcon className="h-4 w-4" />} />
              <MetaItem label="Rating" value={`${movie.vote_count || 0} Votes`} icon={<StarIcon className="h-4 w-4" />} />
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