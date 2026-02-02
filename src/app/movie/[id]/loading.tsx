export default function DetailLoading() {
  return (
    /* bg-transparent ensures the global body glows remain visible */
    <div className="min-h-screen bg-transparent pt-32 pb-20 relative overflow-hidden">
      
      <div className="container mx-auto px-8 relative z-10">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Poster Skeleton - Matches the 2/3 aspect ratio and glass style */}
          <div className="w-64 flex-shrink-0">
            <div className="aspect-[2/3] w-full glass-card animate-pulse border-white/10" />
          </div>

          {/* Content Skeleton - Right side */}
          <div className="flex-1 space-y-10 pt-8">
            <div className="space-y-6">
              {/* Badge & Rating Skeleton */}
              <div className="flex items-center gap-4">
                <div className="h-6 w-24 bg-white/[0.05] animate-pulse rounded-lg" />
                <div className="h-6 w-20 bg-white/[0.05] animate-pulse rounded-lg" />
              </div>
              
              {/* Main Title Skeleton */}
              <div className="h-16 w-3/4 bg-white/[0.05] animate-pulse rounded-2xl" />
              
              {/* Tagline or Meta Info */}
              <div className="h-6 w-1/2 bg-white/[0.03] animate-pulse rounded-full" />
            </div>

            {/* Action Buttons Skeletons - Matches the rounded-xl buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="h-12 w-40 glass-card animate-pulse border-white/5" />
              <div className="h-12 w-40 glass-card animate-pulse border-white/5" />
              <div className="h-12 w-40 glass-card animate-pulse border-white/5" />
            </div>

            {/* Meta Stats Grid Skeleton */}
            <div className="grid grid-cols-3 gap-8 pt-10 border-t border-white/5 max-w-md">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="h-3 w-16 bg-white/[0.03] rounded-full animate-pulse" />
                  <div className="h-5 w-20 bg-white/[0.05] rounded-lg animate-pulse" />
                </div>
              ))}
            </div>

            {/* Synopsis Skeleton */}
            <div className="space-y-4 pt-4 max-w-2xl">
              <div className="h-3 w-20 bg-white/[0.03] rounded-full animate-pulse" />
              <div className="space-y-3">
                <div className="h-4 w-full bg-white/[0.03] animate-pulse rounded-full" />
                <div className="h-4 w-full bg-white/[0.03] animate-pulse rounded-full" />
                <div className="h-4 w-2/3 bg-white/[0.03] animate-pulse rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}