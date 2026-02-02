export default function Loading() {
  return (
    /* bg-transparent is essential to keep the globals.css aura visible */
    <div className="min-h-screen bg-transparent pt-32 pb-20 relative overflow-hidden">
      <div className="container mx-auto px-8 relative z-10">
        
        {/* Title Skeleton - Matching the Studio tracking and shape */}
        <div className="h-10 w-64 bg-white/[0.05] animate-pulse rounded-2xl mb-12" />
        
        {/* Grid Skeleton - Using the universal glass-card utility from globals.css */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="space-y-4">
              {/* Poster Skeleton with deep blur effect */}
              <div className="aspect-[2/3] w-full glass-card animate-pulse border-white/5" />
              
              {/* Meta lines skeletons */}
              <div className="px-1 space-y-2">
                <div className="h-4 w-3/4 bg-white/[0.05] animate-pulse rounded-full" />
                <div className="h-3 w-1/2 bg-white/[0.03] animate-pulse rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}