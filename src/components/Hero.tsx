"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { StarIcon, PlayIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function Hero({ movies }: { movies: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [heroItems, setHeroItems] = useState<any[]>([]);
  const rawItems = movies?.slice(0, 5) || [];

  // Haal extra data (waaronder logo's) op voor de top 5 films
  useEffect(() => {
    const fetchLogos = async () => {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      const enrichedItems = await Promise.all(
        rawItems.map(async (item) => {
          try {
            const type = item.media_type === "tv" ? "tv" : "movie";
            const res = await fetch(
              `https://api.themoviedb.org/3/${type}/${item.id}?api_key=${apiKey}&append_to_response=images&include_image_language=en,null`
            );
            const data = await res.json();
            const logo = data.images?.logos?.find((l: any) => l.file_path);
            return { ...item, logoPath: logo?.file_path };
          } catch (error) {
            console.error("Error fetching hero logos:", error);
            return item;
          }
        })
      );
      setHeroItems(enrichedItems);
    };

    if (rawItems.length > 0) fetchLogos();
  }, [movies]);

  const nextSlide = useCallback(() => {
    setHeroItems((prev) => {
      if (prev.length === 0) return prev;
      setCurrentIndex((curr) => (curr + 1) % prev.length);
      return prev;
    });
  }, []);

  const prevSlide = () => {
    if (heroItems.length === 0) return;
    setCurrentIndex((curr) => (curr - 1 + heroItems.length) % heroItems.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 8000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  if (!heroItems.length) return null;

  const movie = heroItems[currentIndex];

  return (
    <section className="relative h-[65vh] w-full overflow-hidden bg-[#0a0a0c]">
      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt=""
            fill
            className="object-cover opacity-40 grayscale-[0.2]"
            style={{ 
              maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' 
            }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c] via-transparent to-transparent opacity-90" />
        </motion.div>
      </AnimatePresence>

      <div className="container mx-auto px-8 h-full flex flex-col justify-end pb-20 relative z-10">
        <motion.div 
          key={`content-${movie.id}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-2xl space-y-6"
        >
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 px-2.5 py-1 bg-[#3b82f6]/10 border border-[#3b82f6]/20 rounded-sm">
              <span className="text-[10px] font-black text-[#3b82f6] uppercase tracking-[0.2em]">
                Featured Entry
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-white font-bold text-xs">
               <StarIcon className="h-4 w-4 text-[#3b82f6] fill-[#3b82f6]" />
               {movie.vote_average?.toFixed(1)}
            </div>
          </div>

          {/* CLEAR LOGO INTEGRATIE */}
          {movie.logoPath ? (
            <div className="relative w-full max-w-[280px] h-24 md:max-w-[380px] md:h-32 drop-shadow-2xl">
              <Image
                src={`https://image.tmdb.org/t/p/original${movie.logoPath}`}
                alt={movie.title || movie.name}
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          ) : (
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
              {movie.title || movie.name}
            </h1>
          )}

          <p className="text-sm md:text-base text-zinc-400 font-medium line-clamp-2 max-w-lg leading-relaxed">
            {movie.overview}
          </p>

          <div className="flex items-center gap-4 pt-4">
            <Link
              href={`/${movie.media_type || 'movie'}/${movie.id}`}
              className="flex items-center gap-2 px-6 py-3 bg-[#2563eb] text-white rounded-sm font-bold text-sm shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:bg-[#3b82f6] transition-all"
            >
              <PlayIcon className="h-4 w-4 fill-current" />
              View Details
            </Link>

            <div className="flex gap-1.5 ml-4">
              {heroItems.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1 transition-all rounded-none ${i === currentIndex ? "w-8 bg-[#3b82f6]" : "w-2 bg-white/20"}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-sm bg-black/20 hover:bg-black/40 text-white/50 hover:text-white transition-all z-20">
        <ChevronLeftIcon className="h-6 w-6" />
      </button>
      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-sm bg-black/20 hover:bg-black/40 text-white/50 hover:text-white transition-all z-20">
        <ChevronRightIcon className="h-6 w-6" />
      </button>
    </section>
  );
}