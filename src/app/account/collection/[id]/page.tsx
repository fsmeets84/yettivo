"use client";

import { useParams, useRouter } from "next/navigation";
import { useCollections } from "@/context/CollectionContext";
import MovieCard from "@/components/MovieCard";
import { 
  ChevronLeftIcon, 
  TrashIcon, 
  RectangleStackIcon,
  CalendarIcon,
  InformationCircleIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FilmIcon,
  TvIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { format } from "date-fns";
import { useState } from "react";
import ConfirmModal from "@/components/ConfirmModal";

export default function CollectionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getCollectionById, deleteCollection } = useCollections();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");

  const collection = getCollectionById(id as string);

  if (!collection) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0c] space-y-4">
        <p className="text-zinc-500 font-black uppercase tracking-widest text-[10px]">Error 404</p>
        <h1 className="text-white font-bold text-xl uppercase tracking-tighter">Collection not found</h1>
        <Link href="/account/collection" className="text-violet-500 font-black uppercase tracking-widest text-[10px] hover:underline">
          Return to Collections
        </Link>
      </div>
    );
  }

  const handleConfirmDelete = () => {
    deleteCollection(collection.id);
    setIsDeleteModalOpen(false);
    router.push("/account/collection");
  };

  // Filter de items op basis van de zoekopdracht binnen de collectie
  const filteredItems = collection.items.filter(item => 
    item.title.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#0a0a0c] pt-32 pb-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none">
        <RectangleStackIcon className="h-64 w-64 text-violet-500" />
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-violet-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-8 relative z-10">
        
        {/* Navigation & Actions */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-white/5 pb-12">
          <div className="space-y-6">
            <button 
              onClick={() => router.push("/account/collection")} 
              className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-violet-500 transition-all group"
            >
              <ChevronLeftIcon className="h-3 w-3 transition-transform group-hover:-translate-x-1" /> 
              Back to Collections
            </button>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-violet-500">
                <RectangleStackIcon className="h-5 w-5" />
                <span className="text-[11px] font-black uppercase tracking-[0.3em]">Archive Collection</span>
              </div>
              <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
                {collection.name}
              </h1>
              {collection.description && (
                <p className="text-zinc-500 text-lg max-w-2xl font-medium tracking-tight mt-4 italic">
                  "{collection.description}"
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-6">
             <div className="flex gap-8">
                <MetaStat label="Created" value={format(collection.createdAt, "dd MMM yyyy")} icon={<CalendarIcon className="h-4 w-4" />} />
                <MetaStat label="Total Entries" value={collection.items.length} icon={<InformationCircleIcon className="h-4 w-4" />} />
             </div>
             
             <div className="flex items-center gap-2">
               {/* Dubbele Add Media Knoppen voor Movies & TV */}
               <div className="flex bg-white/[0.03] border border-white/5 p-1 rounded-sm">
                 <Link
                   href="/movie"
                   className="flex items-center gap-2 px-4 py-2 hover:bg-violet-600 text-white text-[9px] font-black uppercase tracking-widest rounded-sm transition-all group/btn"
                   title="Add Movies"
                 >
                   <FilmIcon className="h-3.5 w-3.5 text-violet-500 group-hover/btn:text-white transition-colors" /> 
                   Movies
                 </Link>
                 <div className="w-px h-4 bg-white/10 self-center mx-1" />
                 <Link
                   href="/tv"
                   className="flex items-center gap-2 px-4 py-2 hover:bg-violet-600 text-white text-[9px] font-black uppercase tracking-widest rounded-sm transition-all group/btn"
                   title="Add TV Shows"
                 >
                   <TvIcon className="h-3.5 w-3.5 text-violet-500 group-hover/btn:text-white transition-colors" /> 
                   Series
                 </Link>
               </div>

               <button 
                 onClick={() => setIsDeleteModalOpen(true)}
                 className="flex items-center justify-center p-3 border border-red-500/20 text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all rounded-sm"
                 title="Delete Archive"
               >
                 <TrashIcon className="h-4 w-4" />
               </button>
             </div>
          </div>
        </header>

        {/* Filter utility */}
        {collection.items.length > 0 && (
           <div className="mb-10 flex justify-between items-center">
              <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">
                Archive Contents {filterQuery && `— Results for "${filterQuery}"`}
              </h2>
              <div className="relative group w-full max-w-xs">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600 group-focus-within:text-violet-500 transition-colors" />
                <input 
                  type="text" 
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="Filter this archive..."
                  className="w-full bg-white/[0.02] border border-white/5 rounded-sm py-2.5 pl-10 pr-4 text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-violet-500/50 transition-all"
                />
              </div>
           </div>
        )}

        {/* Content Grid */}
        {collection.items.length > 0 ? (
          filteredItems.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {filteredItems.map((item) => (
                <MovieCard 
                  key={`${collection.id}-${item.tmdbId}`}
                  id={item.tmdbId}
                  title={item.title}
                  posterPath={item.posterPath}
                  voteAverage={item.voteAverage}
                  type={item.type}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border border-white/5 rounded-sm bg-white/[0.01]">
               <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">No entries match your filter</p>
               <button onClick={() => setFilterQuery("")} className="mt-4 text-violet-500 text-[9px] font-bold uppercase tracking-widest hover:text-white transition-colors">Clear Filter</button>
            </div>
          )
        ) : (
          <div className="py-32 border border-dashed border-white/5 rounded-sm flex flex-col items-center justify-center space-y-4 bg-white/[0.01]">
            <RectangleStackIcon className="h-12 w-12 text-zinc-800" />
            <p className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.2em]">This collection is currently empty</p>
            <div className="flex gap-4">
              <Link href="/movie" className="px-6 py-3 bg-violet-600 text-white text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-violet-500 transition-all shadow-lg shadow-violet-900/20">
                Browse Movies
              </Link>
              <Link href="/tv" className="px-6 py-3 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-white/10 transition-all">
                Browse TV Shows
              </Link>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        title="Delete Archive"
        message={`Are you sure you want to permanently delete "${collection.name}"? All categorized entries will be removed from this archive. This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </main>
  );
}

function MetaStat({ label, value, icon }: { label: string, value: any, icon: React.ReactNode }) {
  return (
    <div className="space-y-1 text-right md:text-left">
      <div className="flex items-center gap-2 text-zinc-600 justify-end md:justify-start">
        {icon}
        <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-white font-bold text-sm uppercase tracking-tight">{value}</p>
    </div>
  );
}