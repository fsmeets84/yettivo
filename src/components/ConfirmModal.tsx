"use client";

import { useEffect } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmModalProps) {
  // Voorkom scrollen van de achtergrond
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop: Iets lichter zodat de rest van de site nog subtiel zichtbaar is */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onCancel} 
      />
      
      {/* Modal Content: Strakke zwarte kaart met subtiele border */}
      <div 
        className="relative bg-[#141414] border border-white/10 p-6 rounded-sm max-w-sm w-full shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Header */}
        <h2 className="text-lg font-bold text-white mb-2 tracking-tight">
          {title}
        </h2>
        
        {/* Message */}
        <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
          {message}
        </p>
        
        {/* Actions: Blauwe accenten conform je merkstijl */}
        <div className="flex gap-4 justify-end items-center">
          <button 
            onClick={onCancel}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-6 py-2.5 bg-[#3b82f6] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-[#2563eb] transition-all active:scale-95 shadow-lg shadow-blue-500/20"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}