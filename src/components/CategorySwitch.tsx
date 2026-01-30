"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function CategorySwitch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Check URL for category. Default to 'movie' if not found or invalid.
  const activeCategory = searchParams.get("category") === "tv" ? "tv" : "movie";
  const currentQuery = searchParams.get("query") || "";

  const handleSwitch = (category: "movie" | "tv") => {
    // Preserve the existing search query when switching categories
    const queryPart = currentQuery ? `&query=${encodeURIComponent(currentQuery)}` : "";
    router.push(`/?category=${category}${queryPart}`);
  };

  return (
    <div className="flex justify-center gap-4 mb-8">
      <button
        onClick={() => handleSwitch("movie")}
        className={`px-6 py-2 rounded-full font-medium transition-all ${
          activeCategory === "movie"
            ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50"
            : "bg-slate-800 text-slate-400 hover:bg-slate-700"
        }`}
      >
        Movies
      </button>
      <button
        onClick={() => handleSwitch("tv")}
        className={`px-6 py-2 rounded-full font-medium transition-all ${
          activeCategory === "tv"
            ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50"
            : "bg-slate-800 text-slate-400 hover:bg-slate-700"
        }`}
      >
        TV Series
      </button>
    </div>
  );
}