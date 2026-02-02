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
      // 1. Navigeer naar de resultaten
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);

      // 2. Wis de fysieke inhoud van de input direct
      if (inputRef.current) {
        inputRef.current.value = "";
        inputRef.current.blur(); // Sluit de focus (belangrijk voor mobiel en styling)
      }
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex-1 max-w-md mx-12">
      <div className="relative group">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3b82f6]" />
        <input
          ref={inputRef}
          type="text"
          name="q"
          placeholder="Search archive..."
          autoComplete="off"
          className="w-full bg-black/40 border border-white/10 rounded-sm py-2 pl-11 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#3b82f6]/50 transition-all font-medium"
        />
      </div>
    </form>
  );
}