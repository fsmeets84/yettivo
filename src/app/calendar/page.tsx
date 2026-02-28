"use client";

import { useEffect, useState, useMemo } from "react";
import { useWatchlist } from "@/context/WatchlistContext";
import Image from "next/image";
import { 
  CalendarIcon, ChevronLeftIcon, ChevronRightIcon, 
  XMarkIcon, InformationCircleIcon, StarIcon,
  TvIcon, FilmIcon 
} from "@heroicons/react/24/outline";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns";
import Link from "next/link";

export default function CalendarPage() {
  const { watchlist } = useWatchlist();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const watchlistKey = useMemo(() => {
    return watchlist
      .filter(item => !item.isWatched)
      .map(item => item.tmdbId)
      .join(',');
  }, [watchlist]);

  useEffect(() => {
    const fetchReleases = async () => {
      const activeWatchlist = watchlist.filter(item => !item.isWatched);
      
      if (activeWatchlist.length === 0) {
        setEvents([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      const allEvents: any[] = [];

      try {
        const promises = activeWatchlist.map(async (item) => {
          try {
            const res = await fetch(
              `https://api.themoviedb.org/3/${item.type}/${item.tmdbId}?api_key=${apiKey}`
            );
            const data = await res.json();

            if (item.type === "tv" && data.next_episode_to_air) {
              allEvents.push({
                date: new Date(data.next_episode_to_air.air_date),
                title: data.name,
                subTitle: `S${data.next_episode_to_air.season_number} E${data.next_episode_to_air.episode_number}`,
                episodeName: data.next_episode_to_air.name,
                overview: data.next_episode_to_air.overview || data.overview,
                rating: data.vote_average,
                image: data.poster_path,
                id: item.tmdbId,
                type: "tv"
              });
            } else if (item.type === "movie" && data.release_date) {
              allEvents.push({
                date: new Date(data.release_date),
                title: data.title,
                subTitle: "Movie Premiere",
                overview: data.overview,
                rating: data.vote_average,
                image: data.poster_path,
                id: item.tmdbId,
                type: "movie"
              });
            }
          } catch (err) {
            console.error(`Failed to fetch for ${item.tmdbId}`, err);
          }
        });

        await Promise.all(promises);
        setEvents(allEvents);
      } catch (error) {
        console.error("Calendar error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReleases();
  }, [watchlistKey]);

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  return (
    <main className="min-h-screen bg-[#0a0a0c] text-white pt-32 pb-20 relative overflow-hidden">
      {/* Premium Ambient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-8 relative z-10 max-w-[1800px]">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-500">
              <CalendarIcon className="h-4 w-4" />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase">Schedule Archive</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter capitalize leading-none">
              {format(currentMonth, "MMMM yyyy")}
            </h1>
          </div>

          <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 p-1.5 rounded-sm shadow-2xl">
            <button 
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} 
              className="p-3 hover:bg-white/5 transition-all rounded-sm text-zinc-400 hover:text-white"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button 
              onClick={() => setCurrentMonth(new Date())}
              className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
            >
              Today
            </button>
            <button 
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} 
              className="p-3 hover:bg-white/5 transition-all rounded-sm text-zinc-400 hover:text-white"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid Container */}
        <div className="bg-[#0d0d0f]/40 border border-white/5 shadow-2xl backdrop-blur-sm animate-in fade-in duration-1000">
          <div className="grid grid-cols-7 border-b border-white/5">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 text-center border-r last:border-0 border-white/5">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-7">
            {days.map((day) => {
              const dayEvents = events.filter(e => isSameDay(e.date, day));
              const isToday = isSameDay(day, new Date());

              return (
                <div key={day.toString()} className={`min-h-[160px] p-4 border-r border-b border-white/5 last:border-r-0 transition-colors ${isToday ? "bg-blue-600/[0.03]" : "hover:bg-white/[0.01]"}`}>
                  <div className="flex justify-between items-start">
                    <span className={`text-xs font-bold tracking-widest ${isToday ? "text-blue-500" : "text-zinc-600"}`}>
                      {format(day, "d")}
                    </span>
                  </div>
                  
                  <div className="mt-4 space-y-1.5">
                    {dayEvents.map((event, i) => (
                      <div key={i} className="relative group/item">
                        <button 
                          onClick={() => setSelectedEvent(event)}
                          className="w-full text-left p-2.5 rounded-sm bg-blue-600/10 border border-blue-500/20 hover:border-blue-500/50 transition-all"
                        >
                          <p className="text-[11px] font-bold text-zinc-100 truncate group-hover:text-blue-400 transition-colors">
                            {event.title}
                          </p>
                        </button>

                        {/* Hover Preview Card */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 z-[120] opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-300 pointer-events-none translate-y-2 group-hover/item:translate-y-0">
                          <div className="bg-[#141417] border border-white/10 rounded-sm overflow-hidden shadow-2xl">
                            <div className="relative h-44 w-full">
                              <Image src={`https://image.tmdb.org/t/p/w500${event.image}`} alt="" fill className="object-cover opacity-80" />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#141417] via-transparent to-transparent" />
                              <div className="absolute bottom-3 left-3">
                                <span className="text-[8px] font-black uppercase tracking-widest text-white bg-blue-600 px-2 py-1 rounded-sm flex items-center gap-1.5">
                                  {event.type === 'tv' ? <TvIcon className="h-3 w-3" /> : <FilmIcon className="h-3 w-3" />}
                                  {event.subTitle}
                                </span>
                              </div>
                            </div>
                            <div className="p-4">
                              <p className="text-sm font-bold text-white mb-2">{event.title}</p>
                              <p className="text-[11px] text-zinc-400 line-clamp-3 leading-relaxed font-medium">
                                {event.overview}
                              </p>
                            </div>
                          </div>
                          <div className="w-3 h-3 bg-[#141417] border-r border-b border-white/10 rotate-45 mx-auto -mt-1.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail Slide-over */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[130] flex items-center justify-end">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedEvent(null)} />
          <div className="relative w-full max-w-md h-full bg-[#0d0d0f] border-l border-white/10 p-12 shadow-2xl animate-in slide-in-from-right duration-500">
            <button onClick={() => setSelectedEvent(null)} className="absolute top-10 right-10 text-zinc-600 hover:text-white transition-colors">
              <XMarkIcon className="h-8 w-8" />
            </button>

            <div className="mt-16 space-y-10">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] flex items-center gap-3">
                  {selectedEvent.type === 'tv' ? 'TV release' : 'Movie release'}
                  <span className="text-zinc-800">|</span>
                  {selectedEvent.subTitle}
                </p>
                <h2 className="text-4xl font-black text-white tracking-tighter leading-none">
                  {selectedEvent.title}
                </h2>
                {selectedEvent.episodeName && (
                   <p className="text-xl font-medium text-zinc-400 leading-tight">"{selectedEvent.episodeName}"</p>
                )}
                <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-[13px] font-bold text-white">
                    <StarIcon className="h-4 w-4 text-blue-500 fill-blue-500" />
                    {selectedEvent.rating.toFixed(1)}
                  </div>
                  <span className="text-zinc-500 text-[11px] font-black uppercase tracking-widest">
                    {format(selectedEvent.date, "dd MMMM yyyy")}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <InformationCircleIcon className="h-4 w-4" /> Synopsis
                </h3>
                <p className="text-zinc-300 text-[15px] leading-relaxed font-medium tracking-tight">
                  {selectedEvent.overview || "No description available for this release."}
                </p>
              </div>

              <Link 
                href={`/${selectedEvent.type}/${selectedEvent.id}`}
                className="block w-full py-5 bg-blue-600 text-white text-center text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 active:scale-95"
              >
                Access File Details
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}