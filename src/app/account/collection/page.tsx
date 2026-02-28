"use client";

import { useCollections } from "@/context/CollectionContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  RectangleStackIcon, 
  PlusIcon, 
  ChevronRightIcon,
  MagnifyingGlassIcon,
  FolderIcon,
  ClockIcon,
  InboxIcon,
  TrashIcon 
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import CreateCollectionModal from "@/components/CreateCollectionModal";
import ConfirmModal from "@/components/ConfirmModal";

export default function CollectionsOverviewPage() {
  const { collections, deleteCollection } = useCollections();
  const { status } = useSession();
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState<{ id: string, name: string } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin");
  }, [status, router]);

  const openDeleteConfirm = (e: React.MouseEvent, id: string, name: string) => {
    e.preventDefault();
    e.stopPropagation();
    setCollectionToDelete({ id, name });
  };

  const handleConfirmDelete = () => {
    if (collectionToDelete) {
      deleteCollection(collectionToDelete.id);
      setCollectionToDelete(null);
    }
  };

  const filteredCollections = collections.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c]">
      <div className="h-6 w-6 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0a0a0c] pt-32 pb-20 relative overflow-hidden">
      {/* Dynamic background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-violet-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-8 relative z-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 border-b border-white/5 pb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-violet-500">
              <RectangleStackIcon className="h-5 w-5" />
              <span className="text-[11px] font-black uppercase tracking-[0.3em]">Master Archive</span>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
              Your Collections
            </h1>
            <p className="text-zinc-500 text-sm font-medium tracking-wide max-w-md">
              Manage and curate your personalized media libraries and digital archives.
            </p>
          </div>

          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-3 px-8 py-5 bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-sm transition-all shadow-[0_10px_30px_rgba(139,92,246,0.2)] active:scale-95 group"
          >
            <PlusIcon className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" /> Create New Archive
          </button>
        </header>

        {/* Compact Search Bar with High Contrast & Stats */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 mb-12">
          <div className="relative flex-grow max-w-md group">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-violet-400 group-focus-within:text-violet-200 transition-colors z-20" />
            <input 
              type="text"
              placeholder="Search by collection title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-violet-500/[0.03] border border-violet-500/20 rounded-sm py-3.5 pl-12 pr-4 text-xs text-white placeholder:text-zinc-700 focus:outline-none focus:border-violet-500/60 focus:bg-violet-500/10 focus:ring-1 focus:ring-violet-500/20 transition-all shadow-[0_0_20px_rgba(139,92,246,0.05)]"
            />
          </div>
          
          {/* Verbeterde Statistieken sectie */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end px-6 py-3 bg-white/[0.03] border border-white/10 rounded-sm min-w-[140px]">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] mb-1">Total Archives</span>
              <span className="text-2xl font-black text-white leading-none">{collections.length}</span>
            </div>
            <div className="flex flex-col items-end px-6 py-3 bg-violet-500/[0.03] border border-violet-500/20 rounded-sm min-w-[140px]">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] mb-1">Saved Entries</span>
              <span className="text-2xl font-black text-violet-500 leading-none">
                {collections.reduce((acc, curr) => acc + curr.items.length, 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Collections Grid */}
        {filteredCollections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {filteredCollections.map((coll) => {
              const previewItems = coll.items.slice(0, 3);
              return (
                <Link 
                  key={coll.id} 
                  href={`/account/collection/${coll.id}`}
                  className="group relative p-8 bg-[#0d0d0f] border border-white/5 rounded-sm hover:border-violet-500/40 transition-all duration-500 overflow-hidden shadow-xl min-h-[300px] flex flex-col justify-between"
                >
                  {/* Background Preview Posters */}
                  <div className="absolute inset-0 z-0 flex opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-30 transition-all duration-700">
                    {previewItems.length > 0 ? (
                      previewItems.map((item, idx) => (
                        <div key={idx} className="relative flex-1 h-full border-r border-black/50 last:border-0">
                          <Image
                            src={`https://image.tmdb.org/t/p/w300${item.posterPath}`}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-black" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] via-[#0d0d0f]/90 to-[#0d0d0f]/40" />
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => openDeleteConfirm(e, coll.id, coll.name)}
                    className="absolute top-4 right-4 p-2.5 bg-black/60 backdrop-blur-md text-red-500/40 hover:text-red-500 hover:bg-red-500/20 rounded-sm opacity-0 group-hover:opacity-100 transition-all z-30 active:scale-90"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>

                  <div className="relative z-10 space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="p-3 bg-violet-600/20 backdrop-blur-md rounded-sm border border-violet-500/30 group-hover:bg-violet-600 group-hover:text-white transition-all duration-500">
                        <FolderIcon className="h-6 w-6 text-violet-500 group-hover:text-white" />
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-400 group-hover:text-violet-400 transition-colors pr-8">
                         <ClockIcon className="h-3 w-3" />
                         <span className="text-[9px] font-black uppercase tracking-widest">{format(coll.createdAt, "MMM yyyy")}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-black text-white group-hover:text-violet-400 transition-colors uppercase tracking-tighter leading-none">
                        {coll.name}
                      </h3>
                      <p className="text-zinc-400 text-xs line-clamp-2 mt-4 font-medium leading-relaxed group-hover:text-zinc-200 transition-colors">
                        {coll.description || "Personal archive — No description provided."}
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] bg-violet-600/20 px-3 py-1 rounded-sm border border-violet-500/20">
                      {coll.items.length} {coll.items.length === 1 ? 'Entry' : 'Entries'}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-white transition-all">
                      Open Archive <ChevronRightIcon className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-40 border border-dashed border-white/5 rounded-sm text-center bg-white/[0.01]">
            <InboxIcon className="h-12 w-12 text-zinc-800 mx-auto mb-4" />
            <p className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.2em]">
              {searchTerm ? "No collections match your search" : "Your master archive is currently empty"}
            </p>
          </div>
        )}
      </div>

      <CreateCollectionModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      
      <ConfirmModal 
        isOpen={!!collectionToDelete}
        title="Delete Archive"
        message={`Are you sure you want to permanently delete "${collectionToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setCollectionToDelete(null)}
      />
    </main>
  );
}