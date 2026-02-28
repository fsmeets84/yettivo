"use client";

import { useEffect } from "react";
import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmModalProps) {
  // Voorkom scrollen van de achtergrond wanneer de modal open is
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center px-4">
      {/* Backdrop met diepe blur effect */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-in fade-in duration-500" 
        onClick={onCancel} 
      />
      
      {/* Modal Card */}
      <div 
        className="relative bg-[#0d0d0f] border border-white/5 p-10 rounded-sm max-w-sm w-full shadow-[0_30px_60px_rgba(0,0,0,0.8)] animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Close button */}
        <button 
          onClick={onCancel}
          className="absolute top-6 right-6 text-zinc-600 hover:text-white transition-colors"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-6">
          {/* Icon Badge - Hoekig en blauw */}
          <div className="h-14 w-14 bg-blue-600/10 border border-blue-500/20 rounded-sm flex items-center justify-center">
            <ExclamationTriangleIcon className="h-7 w-7 text-blue-500" />
          </div>

          <div className="space-y-3">
            <h2 className="text-[11px] font-black text-blue-500 uppercase tracking-[0.25em]">
              System Request
            </h2>
            {/* Italic verwijderd */}
            <h3 className="text-2xl font-bold text-white tracking-tighter uppercase leading-none">
              {title}
            </h3>
            <p className="text-[13px] text-zinc-500 font-medium leading-relaxed max-w-[240px] mx-auto">
              {message}
            </p>
          </div>
        </div>
        
        {/* Button Actions - Strak en uniform */}
        <div className="flex flex-col gap-3 mt-12">
          <button 
            onClick={onConfirm}
            className="w-full py-4 bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-blue-500 transition-all active:scale-[0.97] shadow-lg shadow-blue-600/20"
          >
            Confirm Action
          </button>
          <button 
            onClick={onCancel}
            className="w-full py-4 bg-white/[0.02] border border-white/10 text-zinc-500 text-[11px] font-black uppercase tracking-[0.2em] rounded-sm hover:text-white hover:bg-white/[0.05] transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}