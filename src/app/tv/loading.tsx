export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-[#0d061a] p-6 pt-32 space-y-12">
      <div className="container mx-auto">
        {/* Title Skeleton */}
        <div className="h-10 w-64 bg-white/5 animate-pulse rounded-2xl mb-12" />

        {/* Grid Skeleton - Bootst de MovieCard-structuur na */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-x-6 gap-y-12">
          {[...Array(14)].map((_, i) => (
            <div key={i} className="space-y-4">
              {/* Poster Aspect Ratio */}
              <div className="aspect-[2/3] w-full bg-white/5 animate-pulse rounded-[2rem] border border-white/5" />
              {/* Title Line */}
              <div className="h-4 w-3/4 bg-white/5 animate-pulse rounded-full mx-auto" />
              {/* Rating Line */}
              <div className="h-3 w-1/2 bg-white/5 animate-pulse rounded-full mx-auto opacity-50" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}