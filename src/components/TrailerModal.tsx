"use client";

import { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface TrailerModalProps {
  videoKey: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function TrailerModal({ videoKey, isOpen, onClose }: TrailerModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
      {/* Backdrop met hogere blur voor focus */}
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-3xl cursor-pointer" 
        onClick={onClose}
      />

      <div className="relative w-full max-w-6xl aspect-video z-[210] border border-white/10 shadow-[0_0_100px_rgba(59,130,246,0.1)] rounded-sm bg-black overflow-hidden scale-in-95 animate-in duration-500">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-[#3b82f6] hover:text-white text-white/70 rounded-sm backdrop-blur-md border border-white/10 transition-all duration-300 z-[230] group"
          aria-label="Close trailer"
        >
          <XMarkIcon className="h-5 w-5 transition-transform group-hover:rotate-90" />
        </button>

        {/* Loading Indicator (zichtbaar totdat iframe geladen is) */}
        <div className="absolute inset-0 flex items-center justify-center -z-10">
          <div className="h-8 w-8 border-2 border-[#3b82f6]/20 border-t-[#3b82f6] rounded-full animate-spin" />
        </div>

        <iframe
          src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&color=white`}
          title="Movie Trailer"
          className="w-full h-full relative z-10"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}