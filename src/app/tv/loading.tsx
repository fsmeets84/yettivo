export default function CategoryLoading() {
  return (
    /* Achtergrond aangepast naar #0a0a0c voor consistentie */
    <div className="min-h-screen bg-[#0a0a0c] px-8 pt-32 pb-20">
      <div className="container mx-auto max-w-[1800px]">
        
        {/* Title Section Skeleton */}
        <div className="mb-16 space-y-4 max-w-2xl">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-blue-500/20 animate-pulse rounded-sm" />
            <div className="h-3 w-32 bg-white/[0.05] animate-pulse rounded-sm" />
          </div>
          <div className="h-12 w-64 bg-white/[0.08] animate-pulse rounded-sm" />
          <div className="h-[1px] w-full bg-white/5" />
        </div>

        {/* Grid Skeleton - Exacte kopie van de Series grid structuur */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="space-y-4">
              {/* Poster Skeleton: Strakke hoeken, geen ronde vormen */}
              <div className="relative aspect-[2/3] w-full bg-white/[0.03] border border-white/10 animate-pulse rounded-sm overflow-hidden">
                {/* Subtiele shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              </div>
              
              {/* Info Skeletons: Geen gecentreerde tekst meer, maar links uitgelijnd */}
              <div className="px-0.5 space-y-2.5">
                <div className="h-4 w-[85%] bg-white/[0.06] animate-pulse rounded-sm" />
                <div className="h-3 w-16 bg-white/[0.03] animate-pulse rounded-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}