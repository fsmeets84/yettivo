"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowPathIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface ContinueItem {
  id: number;
  title: string;
  poster_path: string;
  type: "movie" | "tv";
  progressText?: string;
}

export default function ContinueWatching() {
  const [items, setItems] = useState<ContinueItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const scanProgress = async () => {
      setLoading(true);
      const activeItems: { id: string; type: "movie" | "tv" }[] = [];

      // Scan localStorage voor alle progress keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;

        if (key.startsWith("progress_movie_")) {
          if (JSON.parse(localStorage.getItem(key) || "false") === true) {
            activeItems.push({ id: key.replace("progress_movie_", ""), type: "movie" });
          }
        } else if (key.startsWith("progress_tv_") || key.startsWith("watched_tv_")) {
          const data = JSON.parse(localStorage.getItem(key) || "[]");
          const id = key.replace("progress_tv_", "").replace("watched_tv_", "");
          
          // Voorkom dubbele ID's voor series
          if (!activeItems.find(item => item.id === id)) {
            if ((Array.isArray(data) && data.length > 0) || data === true) {
              activeItems.push({ id, type: "tv" });
            }
          }
        }
      }

      if (activeItems.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      // Fetch metadata van TMDB voor de gevonden ID's
      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        const fetchedData = await Promise.all(
          activeItems.map(async (item) => {
            const res = await fetch(
              `https://api.themoviedb.org/3/${item.type}/${item.id}?api_key=${apiKey}`
            );
            const data = await res.json();
            
            // Optioneel: bereken voortgang tekst voor TV
            let progressText = "In Progress";
            if (item.type === "tv") {
              const watched = JSON.parse(localStorage.getItem(`watched_tv_${item.id}`) || "[]");
              if (watched.length > 0) {
                progressText = `${watched.length} episodes watched`;
              }
            }

            return {
              id: data.id,
              title: data.title || data.name,
              poster_path: data.poster_path,
              type: item.type,
              progressText
            };
          })
        );
        setItems(fetchedData);
      } catch (error) {
        console.error("Error fetching continue watching data:", error);
      } finally {
        setLoading(false);
      }
    };

    scanProgress();
  }, []);

  if (loading || items.length === 0) return null;

  return (
    <section className="container mx-auto px-8 pt-12 relative z-30">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3 text-orange-500">
          <ArrowPathIcon className="h-4 w-4 animate-spin-slow" />
          <span className="text-[10px] font-black tracking-[0.2em] uppercase">Resume mission</span>
        </div>
      </header>

      <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar scroll-smooth">
        {items.map((item) => (
          <Link 
            key={`${item.type}-${item.id}`} 
            href={`/${item.type}/${item.id}`}
            className="flex-shrink-0 group w-[300px]"
          >
            <div className="relative aspect-video rounded-[2px] overflow-hidden border border-white/5 bg-zinc-900 transition-all duration-500 group-hover:border-orange-500/50 group-hover:shadow-[0_0_40px_rgba(249,115,22,0.15)]">
              {/* Backdrop stijl afbeelding (landscape voor continue watching voelt meer 'streaming') */}
              <Image 
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} 
                alt={item.title}
                fill
                className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-700"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest block mb-1">
                  {item.progressText}
                </span>
                <h3 className="text-sm font-bold text-white tracking-tight truncate">
                  {item.title}
                </h3>
              </div>

              {/* Play icon overlay on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500">
                  <ChevronRightIcon className="h-6 w-6 text-white ml-1" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}