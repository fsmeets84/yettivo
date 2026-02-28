"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function SearchBox() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const searchTerm = inputRef.current?.value.trim();

    if (searchTerm) {
      // Navigeer naar de resultaten
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);

      // Wis de inhoud en haal focus weg
      if (inputRef.current) {
        inputRef.current.value = "";
        inputRef.current.blur();
      }
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex-1 max-w-md mx-12 animate-in fade-in duration-700">
      <div className="relative group">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3b82f6] transition-transform group-focus-within:scale-110" />
        <input
          ref={inputRef}
          type="text"
          name="q"
          placeholder="Search movies, series or cast..."
          autoComplete="off"
          className="w-full bg-white/[0.03] border border-white/10 rounded-sm py-2 pl-11 pr-4 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-[#3b82f6]/50 focus:bg-white/[0.05] transition-all font-medium"
        />
        
        {/* Subtiele shortcut hint (optioneel, voor de looks) */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:block">
           <span className="text-[9px] font-black text-zinc-800 border border-white/5 px-1.5 py-0.5 rounded-sm uppercase">Enter</span>
        </div>
      </div>
    </form>
  );
}