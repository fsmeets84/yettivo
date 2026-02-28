"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchReleases = async () => {
      // Alleen items checken die nog niet 'Completed' zijn voor een snellere kalender
      const activeWatchlist = watchlist.filter(item => !item.isWatched);
      
      if (activeWatchlist.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      const allEvents: any[] = [];

      try {
        const promises = activeWatchlist.map(async (item) => {
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
            const releaseDate = new Date(data.release_date);
            // Alleen movies tonen die in de huidige getoonde maand (of nabij) vallen
            allEvents.push({
              date: releaseDate,
              title: data.title,
              subTitle: "Movie Premiere",
              overview: data.overview,
              rating: data.vote_average,
              image: data.poster_path,
              id: item.tmdbId,
              type: "movie"
            });
          }
        });

        await Promise.all(promises);
        setEvents(allEvents);
      } catch (error) {
        console.error("Error fetching calendar data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReleases();
  }, [watchlist, currentMonth]);

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  return (
    <main className="min-h-screen bg-[#0a0a0c] text-white pt-32 pb-20 px-8 relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#3b82f6]">
              <CalendarIcon className="h-4 w-4" />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase">Release Schedule</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tighter">
              {format(currentMonth, "MMMM yyyy")}
            </h1>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-3 bg-white/5 border border-white/10 hover:bg-white/10 transition-all rounded-sm">
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-3 bg-white/5 border border-white/10 hover:bg-white/10 transition-all rounded-sm">
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-7 border-t border-l border-white/5 animate-in fade-in duration-1000">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-4 border-r border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-600">
              {day}
            </div>
          ))}
          
          {days.map((day) => {
            const dayEvents = events.filter(e => isSameDay(e.date, day));
            const isToday = isSameDay(day, new Date());

            return (
              <div key={day.toString()} className={`min-h-[140px] p-4 border-r border-b border-white/5 transition-colors ${isToday ? "bg-[#3b82f6]/5" : "hover:bg-white/[0.01]"}`}>
                <span className={`text-sm font-bold ${isToday ? "text-[#3b82f6]" : "text-zinc-600"}`}>
                  {format(day, "d")}
                </span>
                
                <div className="mt-4 space-y-2">
                  {dayEvents.map((event, i) => (
                    <div key={i} className="relative group/item">
                      <button 
                        onClick={() => setSelectedEvent(event)}
                        className="w-full text-left p-2.5 rounded-sm bg-[#3b82f6]/10 border border-[#3b82f6]/20 hover:border-[#3b82f6]/50 transition-all"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <p className="text-[12px] font-bold text-zinc-100 truncate leading-tight">
                            {event.title}
                          </p>
                        </div>
                      </button>

                      {/* HOVER PREVIEW CARD */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 z-[120] opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-300 pointer-events-none">
                        <div className="bg-[#141417] border border-white/10 rounded-sm overflow-hidden shadow-2xl">
                          <div className="relative h-40 w-full">
                            <Image src={`https://image.tmdb.org/t/p/w500${event.image}`} alt="" fill className="object-cover opacity-80" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#141417] via-transparent to-transparent" />
                            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                              <span className="text-[9px] font-black uppercase tracking-widest text-[#3b82f6] bg-black/80 px-2 py-1 rounded-sm flex items-center gap-1.5 shadow-lg border border-white/5">
                                {event.type === 'tv' ? <TvIcon className="h-3 w-3" /> : <FilmIcon className="h-3 w-3" />}
                                {event.subTitle}
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            <p className="text-sm font-bold text-white mb-1.5">{event.title}</p>
                            <p className="text-[11px] text-zinc-400 line-clamp-3 leading-relaxed font-medium">
                              {event.overview}
                            </p>
                          </div>
                        </div>
                        <div className="w-4 h-4 bg-[#141417] border-r border-b border-white/10 rotate-45 mx-auto -mt-2 shadow-2xl" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Slide-over */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[130] flex items-center justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedEvent(null)} />
          <div className="relative w-full max-w-md h-full bg-[#0f0f12] border-l border-white/10 p-10 shadow-2xl animate-in slide-in-from-right duration-300">
            <button onClick={() => setSelectedEvent(null)} className="absolute top-10 right-10 text-zinc-500 hover:text-white transition-colors">
              <XMarkIcon className="h-7 w-7" />
            </button>

            <div className="mt-16 space-y-8">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-[#3b82f6] uppercase tracking-[0.2em] flex items-center gap-2">
                  {selectedEvent.type === 'tv' ? 'TV Release' : 'Movie Release'}
                  <span className="text-white/20">•</span>
                  {selectedEvent.subTitle}
                </p>
                <h2 className="text-4xl font-bold text-white tracking-tighter leading-none">
                  {selectedEvent.title}
                </h2>
                {selectedEvent.episodeName && (
                   <p className="text-xl font-medium text-zinc-400">"{selectedEvent.episodeName}"</p>
                )}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-[13px] font-bold text-white">
                    <StarIcon className="h-4 w-4 text-[#3b82f6] fill-[#3b82f6]" />
                    {selectedEvent.rating.toFixed(1)}
                  </div>
                  <span className="text-zinc-700">|</span>
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
                className="block w-full py-5 bg-[#3b82f6] text-white text-center text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-[#2563eb] transition-all shadow-[0_10px_30px_rgba(59,130,246,0.3)] active:scale-95"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}