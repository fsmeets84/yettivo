export default function WatchlistLoading() {
  return (
    /* bg-transparent laat de globale glows uit layout.tsx doorschijnen */
    <div className="min-h-screen bg-transparent pt-32 pb-20 relative overflow-hidden">
      <div className="container mx-auto px-8 relative z-10">
        
        {/* Header Skeleton - Matched de hiërarchie van de WatchlistPage */}
        <header className="mb-16 space-y-4 max-w-2xl">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-blue-500/20 animate-pulse rounded-sm" />
            <div className="h-3 w-32 bg-white/[0.05] animate-pulse rounded-sm" />
          </div>
          <div className="h-12 w-64 bg-white/[0.08] animate-pulse rounded-sm" />
          <div className="flex items-center gap-4">
            <div className="h-6 w-24 bg-white/[0.03] border border-white/5 animate-pulse rounded-sm" />
            <div className="h-px flex-1 bg-white/5" />
          </div>
        </header>

        {/* Grid Skeleton - Exacte kopie van de 6-koloms grid structuur */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="space-y-4">
              {/* Poster Skeleton - Hoekig en strak */}
              <div className="relative aspect-[2/3] w-full bg-white/[0.03] border border-white/10 animate-pulse rounded-sm overflow-hidden">
                {/* Subtiele glans-animatie over de kaart */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              </div>
              
              {/* Meta Skeletons - Matchen de titel en het type label */}
              <div className="px-1 space-y-3">
                <div className="h-4 w-[90%] bg-white/[0.05] animate-pulse rounded-sm" />
                <div className="h-3 w-16 bg-blue-500/10 animate-pulse rounded-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}