export default function TVDetailLoading() {
  return (
    <div className="min-h-screen bg-transparent pt-32 pb-20 relative overflow-hidden">
      <div className="container mx-auto px-8 relative z-10 max-w-7xl">
        
        {/* Main Info Section (Hero) */}
        <div className="flex flex-col lg:flex-row gap-12 mb-20">
          
          {/* Left: Large Poster Skeleton */}
          <div className="w-full lg:w-1/3 xl:w-1/4 shrink-0">
            <div className="aspect-[2/3] w-full bg-white/[0.03] border border-white/10 animate-pulse rounded-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </div>
          </div>

          {/* Right: Content Skeleton */}
          <div className="flex-1 space-y-8 py-4">
            <div className="space-y-4">
              <div className="h-4 w-24 bg-blue-500/10 animate-pulse rounded-sm" />
              <div className="h-14 w-[80%] bg-white/[0.08] animate-pulse rounded-sm" />
              <div className="flex gap-4">
                <div className="h-4 w-20 bg-white/[0.04] animate-pulse rounded-sm" />
                <div className="h-4 w-32 bg-white/[0.04] animate-pulse rounded-sm" />
              </div>
            </div>

            {/* Synopsis lines */}
            <div className="space-y-3">
              <div className="h-4 w-full bg-white/[0.03] animate-pulse rounded-sm" />
              <div className="h-4 w-full bg-white/[0.03] animate-pulse rounded-sm" />
              <div className="h-4 w-2/3 bg-white/[0.03] animate-pulse rounded-sm" />
            </div>

            {/* Action buttons skeleton */}
            <div className="flex gap-4 pt-4">
              <div className="h-12 w-40 bg-white/[0.05] animate-pulse rounded-sm" />
              <div className="h-12 w-40 bg-white/[0.05] animate-pulse rounded-sm" />
            </div>
          </div>
        </div>

        {/* Bottom Section: Cast/Episodes Skeleton */}
        <div className="space-y-8">
          <div className="h-[1px] w-full bg-white/5" />
          <div className="h-6 w-48 bg-white/[0.05] animate-pulse rounded-sm" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-square w-full bg-white/[0.03] rounded-sm animate-pulse border border-white/5" />
                <div className="h-3 w-3/4 bg-white/[0.05] animate-pulse rounded-sm" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}