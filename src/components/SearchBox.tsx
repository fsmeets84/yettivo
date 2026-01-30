"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBox() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Check if we are searching for TV shows or Movies based on the URL
  const isTv = searchParams.get("category") === "tv";

  // Initialize the search box with the current URL query (if it exists)
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); 
    
    if (searchTerm.trim()) {
      // We need to keep the category in the URL when searching!
      const categoryParam = isTv ? "&category=tv" : "&category=movie";
      
      router.push(`/?query=${encodeURIComponent(searchTerm)}${categoryParam}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="mb-8 relative max-w-lg mx-auto">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          // Dynamic placeholder text based on category
          placeholder={isTv ? "Search for a TV show..." : "Search for a movie..."}
          className="w-full p-4 pl-5 pr-12 rounded-full bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400 shadow-lg transition-all"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 rounded-full hover:bg-blue-500 transition-colors text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}