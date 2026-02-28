"use client";

import { useState, useEffect } from "react";
import { XMarkIcon, FolderPlusIcon } from "@heroicons/react/24/outline";
import { useCollections } from "@/context/CollectionContext";

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemToAutoAdd?: {
    tmdbId: number;
    title: string;
    posterPath: string;
    type: "movie" | "tv";
    voteAverage: number;
  } | null;
}

export default function CreateCollectionModal({ isOpen, onClose, itemToAutoAdd }: CreateCollectionModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { createCollection, addItemToCollection } = useCollections();

  // Voorkom scrollen van de achtergrond
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      // 1. Maak de collectie aan en vang de nieuwe collectie op
      const newCollection = createCollection(name, description);
      
      // 2. Als er een item is meegegeven, voeg het direct toe aan de nieuwe collectie
      if (itemToAutoAdd && newCollection) {
        addItemToCollection(newCollection.id, itemToAutoAdd);
      }

      setName("");
      setDescription("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-in fade-in duration-500" 
        onClick={onClose} 
      />
      
      {/* Modal Card */}
      <div 
        className="relative bg-[#0d0d0f] border border-white/5 p-10 rounded-sm max-w-md w-full shadow-[0_30px_60px_rgba(0,0,0,0.8)] animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()} 
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-600 hover:text-white transition-colors"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-6 mb-8">
          <div className="h-14 w-14 bg-blue-600/10 border border-blue-500/20 rounded-sm flex items-center justify-center">
            <FolderPlusIcon className="h-7 w-7 text-blue-500" />
          </div>

          <div className="space-y-2">
            <h2 className="text-[11px] font-black text-blue-500 uppercase tracking-[0.25em]">
              Library Archive
            </h2>
            <h3 className="text-2xl font-bold text-white tracking-tighter uppercase leading-none">
              New Collection
            </h3>
            {itemToAutoAdd && (
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-2">
                Adding: <span className="text-blue-500">{itemToAutoAdd.title}</span>
              </p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
              Collection Name
            </label>
            <input 
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 90s Cyberpunk Favorites"
              className="w-full bg-white/[0.02] border border-white/10 rounded-sm py-4 px-4 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.04] transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
              Description (Optional)
            </label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this collection about?"
              rows={3}
              className="w-full bg-white/[0.02] border border-white/10 rounded-sm py-4 px-4 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.04] transition-all resize-none"
            />
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button 
              type="submit"
              className="w-full py-4 bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-blue-500 transition-all active:scale-[0.97] shadow-lg shadow-blue-600/20"
            >
              Create & Add
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="w-full py-4 bg-transparent text-zinc-600 text-[11px] font-black uppercase tracking-[0.2em] rounded-sm hover:text-white transition-all"
            >
              Discard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}