export default function Loading() {
  return (
    /* bg-transparent zorgt ervoor dat de globale glows uit globals.css 
       direct zichtbaar zijn terwijl de content laadt */
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center gap-4">
      
      {/* Animated Spinner with Studio Blue glow */}
      <div className="relative">
        {/* Outer static ring */}
        <div className="h-12 w-12 border-4 border-white/[0.03] rounded-full" />
        
        {/* Inner spinning ring with neon glow */}
        <div className="absolute inset-0 h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(37,99,235,0.3)]" />
      </div>

      {/* Subtle loading text */}
      <p className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase animate-pulse">
        Accessing archive
      </p>
    </div>
  );
}