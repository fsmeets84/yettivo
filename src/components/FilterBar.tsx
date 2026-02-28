"use client";

import { useState, useEffect } from "react";
import { ChevronDownIcon, FunnelIcon } from "@heroicons/react/24/outline";

interface FilterBarProps {
  type: "movie" | "tv";
  onFilterChange: (filters: any) => void;
}

export default function FilterBar({ type, onFilterChange }: FilterBarProps) {
  const [genres, setGenres] = useState<any[]>([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");

  useEffect(() => {
    const fetchGenres = async () => {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      const res = await fetch(
        `https://api.themoviedb.org/3/genre/${type}/list?api_key=${apiKey}&language=en-US`
      );
      const data = await res.json();
      setGenres(data.genres || []);
    };
    fetchGenres();
  }, [type]);

  useEffect(() => {
    onFilterChange({
      genre: selectedGenre,
      year: selectedYear,
      sort: sortBy
    });
  }, [selectedGenre, selectedYear, sortBy]);

  const years = Array.from({ length: 40 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="flex flex-wrap items-center gap-3 mb-12 animate-in fade-in slide-in-from-left-4 duration-700">
      <div className="flex items-center gap-2.5 text-blue-500 mr-2 bg-blue-500/10 px-4 py-2.5 rounded-sm border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
        <FunnelIcon className="h-4 w-4" />
        <span className="text-[11px] font-black uppercase tracking-[0.2em]">Filters</span>
      </div>

      {/* Genre Filter */}
      <FilterSelect 
        value={selectedGenre} 
        onChange={setSelectedGenre} 
        options={genres.map(g => ({ value: g.id.toString(), label: g.name }))}
        defaultLabel="Genre: All"
      />

      {/* Year Filter */}
      <FilterSelect 
        value={selectedYear} 
        onChange={setSelectedYear} 
        options={years.map(y => ({ value: y.toString(), label: y.toString() }))}
        defaultLabel="Year: Any"
      />

      {/* Sort Filter */}
      <div className="relative group">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="appearance-none bg-[#0d0d0f] border border-blue-500/30 hover:border-blue-500/60 rounded-sm py-2.5 pl-4 pr-12 min-w-[160px] text-[11px] font-black text-blue-400 uppercase tracking-[0.1em] focus:outline-none focus:ring-0 transition-all cursor-pointer shadow-2xl"
        >
          <option className="bg-[#0d0d0f] text-zinc-100" value="popularity.desc">Sort: Popularity</option>
          <option className="bg-[#0d0d0f] text-zinc-100" value="vote_average.desc">Sort: Rating</option>
          <option className="bg-[#0d0d0f] text-zinc-100" value="primary_release_date.desc">Sort: Latest</option>
        </select>
        <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500 pointer-events-none" />
      </div>
    </div>
  );
}

function FilterSelect({ value, onChange, options, defaultLabel }: any) {
  const isActive = value !== "";

  return (
    <div className="relative group">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none bg-[#0d0d0f] border rounded-sm py-2.5 pl-4 pr-12 min-w-[140px] text-[11px] font-black uppercase tracking-[0.1em] focus:outline-none focus:ring-0 transition-all cursor-pointer shadow-2xl ${
          isActive 
          ? "border-white/40 text-white" 
          : "border-white/10 text-zinc-300 hover:border-white/20"
        }`}
      >
        <option className="bg-[#0d0d0f] text-zinc-500" value="">{defaultLabel}</option>
        {options.map((opt: any) => (
          <option key={opt.value} className="bg-[#0d0d0f] text-white" value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className={`absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors pointer-events-none ${
        isActive ? "text-white" : "text-zinc-600 group-hover:text-zinc-400"
      }`} />
    </div>
  );
}