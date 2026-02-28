"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserIcon, ChevronLeftIcon, ChevronRightIcon, UserCircleIcon } from "@heroicons/react/24/outline";

export default function CastSection({ id, type }: { id: number; type: 'movie' | 'tv' }) {
  const [cast, setCast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCast = async () => {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${apiKey}&language=en-US`
        );
        const data = await res.json();
        setCast(data.cast?.slice(0, 15) || []);
      } catch (error) {
        console.error("Error fetching cast:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCast();
  }, [id, type]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollTo = direction === "left" 
        ? scrollLeft - clientWidth * 0.8 
        : scrollLeft + clientWidth * 0.8;
      
      scrollContainerRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth"
      });
    }
  };

  if (loading || cast.length === 0) return null;

  return (
    <section className="mt-16 w-full max-w-full overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-8 flex items-end justify-between px-1">
        <div>
          <div className="flex items-center gap-2 text-[#3b82f6] mb-2">
            <UserCircleIcon className="h-4 w-4" />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">Cast & Crew</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">
            Top Cast
          </h2>
        </div>

        <div className="hidden md:flex gap-2">
          <button 
            onClick={() => scroll("left")}
            className="p-2.5 bg-white/[0.03] border border-white/10 rounded-sm text-zinc-500 hover:text-white hover:bg-[#3b82f6] hover:border-[#3b82f6] transition-all active:scale-95"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button 
            onClick={() => scroll("right")}
            className="p-2.5 bg-white/[0.03] border border-white/10 rounded-sm text-zinc-500 hover:text-white hover:bg-[#3b82f6] hover:border-[#3b82f6] transition-all active:scale-95"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="relative">
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-5 pb-6 scrollbar-hide snap-x touch-pan-x outline-none"
        >
          {cast.map((member) => (
            <Link 
              key={member.id} 
              href={`/person/${member.id}`} 
              className="flex-shrink-0 w-32 snap-start group"
            >
              <div className="relative h-44 w-full mb-3 overflow-hidden rounded-sm border border-white/5 bg-zinc-900 transition-all duration-500 group-hover:border-[#3b82f6]/50 shadow-xl">
                {member.profile_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w300${member.profile_path}`}
                    alt={member.name}
                    fill
                    className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-zinc-900">
                    <UserIcon className="h-8 w-8 text-zinc-800" />
                  </div>
                )}
                {/* Subtle overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="space-y-1.5 px-1">
                <p className="text-[11px] font-black text-white truncate leading-none uppercase tracking-tight group-hover:text-[#3b82f6] transition-colors">
                  {member.name}
                </p>
                
                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-none truncate group-hover:text-zinc-400 transition-colors">
                  {member.character}
                </p>
              </div>
            </Link>
          ))}
          {/* Extra spacer for scroll end */}
          <div className="flex-shrink-0 w-8" />
        </div>
      </div>
    </section>
  );
}