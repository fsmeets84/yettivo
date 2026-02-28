export default function CategoryLoading() {
  return (
    /* bg-transparent laat de globale glows uit layout.tsx doorschijnen */
    <div className="min-h-screen bg-transparent pt-32 pb-20 relative overflow-hidden">
      <div className="container mx-auto px-8 relative z-10 max-w-[1800px]">
        
        {/* Header Skeleton - Strakke hiërarchie passend bij de Movie Page */}
        <header className="mb-16 space-y-4 max-w-2xl">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-blue-500/20 animate-pulse rounded-sm" />
            <div className="h-3 w-32 bg-white/[0.05] animate-pulse rounded-sm" />
          </div>
          <div className="h-12 w-72 bg-white/[0.08] animate-pulse rounded-sm" />
          <div className="flex items-center gap-4">
            <div className="h-6 w-24 bg-white/[0.03] border border-white/5 animate-pulse rounded-sm" />
            <div className="h-px flex-1 bg-white/5" />
          </div>
        </header>

        {/* Grid Skeleton - Exacte kopie van de 6-koloms MovieCard grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="space-y-4">
              {/* Poster Skeleton: Hoekig met shimmer effect */}
              <div className="relative aspect-[2/3] w-full bg-white/[0.03] border border-white/10 animate-pulse rounded-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              </div>
              
              {/* Info Skeletons: Links uitgelijnd en scherp */}
              <div className="px-0.5 space-y-3">
                <div className="h-4 w-[90%] bg-white/[0.06] animate-pulse rounded-sm" />
                <div className="flex gap-2">
                  <div className="h-3 w-12 bg-white/[0.03] animate-pulse rounded-sm" />
                  <div className="h-3 w-12 bg-white/[0.03] animate-pulse rounded-sm" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}