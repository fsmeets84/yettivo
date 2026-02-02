export default function CategoryLoading() {
  return (
    /* bg-transparent ensures the global body glows remain visible during load */
    <div className="min-h-screen bg-transparent pt-32 pb-20 relative overflow-hidden">
      <div className="container mx-auto px-8 relative z-10">
        
        {/* Header Skeleton */}
        <header className="mb-12 space-y-4">
          <div className="h-3 w-32 bg-white/[0.05] animate-pulse rounded-full" />
          <div className="h-10 w-64 bg-white/[0.05] animate-pulse rounded-2xl" />
          <div className="h-4 w-96 bg-white/[0.03] animate-pulse rounded-full" />
        </header>

        {/* Grid Skeleton - Matches the Movie/TV archive layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="space-y-4">
              {/* Poster Skeleton using the glass-card utility */}
              <div className="aspect-[2/3] w-full glass-card animate-pulse border-white/5" />
              
              {/* Text Meta Skeletons */}
              <div className="px-1 space-y-2">
                <div className="h-4 w-full bg-white/[0.05] animate-pulse rounded-full" />
                <div className="flex gap-2">
                  <div className="h-3 w-12 bg-white/[0.03] animate-pulse rounded-full" />
                  <div className="h-3 w-8 bg-white/[0.03] animate-pulse rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}