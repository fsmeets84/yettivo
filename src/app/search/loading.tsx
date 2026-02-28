export default function SearchLoading() {
  return (
    /* bg-transparent laat de globale aura/glows uit layout.tsx doorschijnen */
    <div className="min-h-screen bg-transparent pt-32 pb-20 relative overflow-hidden">
      <div className="container mx-auto px-8 relative z-10">
        
        {/* Header Skeleton - Bootst de SearchPage header na */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-blue-500/20 animate-pulse rounded-sm" />
              <div className="h-3 w-32 bg-white/[0.05] animate-pulse rounded-sm" />
            </div>
            <div className="h-10 w-72 bg-white/[0.08] animate-pulse rounded-sm" />
            <div className="h-3 w-48 bg-white/[0.03] animate-pulse rounded-sm" />
          </div>

          {/* Filter Buttons Skeleton */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-sm border border-white/5 bg-white/5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 w-20 bg-white/[0.05] animate-pulse rounded-sm" />
            ))}
          </div>
        </header>

        {/* Grid Skeleton - 6-koloms layout zoals in de rest van de app */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="space-y-4">
              {/* Card Skeleton: Hoekig met shimmer effect */}
              <div className="relative aspect-[2/3] w-full bg-white/[0.03] border border-white/10 animate-pulse rounded-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              </div>
              
              {/* Text Skeletons: Strak en links uitgelijnd */}
              <div className="px-0.5 space-y-2.5">
                <div className="h-4 w-[90%] bg-white/[0.06] animate-pulse rounded-sm" />
                <div className="h-3 w-20 bg-white/[0.03] animate-pulse rounded-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}