export default function Loading() {
  return (
    <main className="p-8 bg-slate-900 min-h-screen text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-blue-400 tracking-tight">Yettivo</h1>
        
        {/* SearchBox Skeleton */}
        <div className="mb-8 relative max-w-lg mx-auto h-14 bg-slate-800 rounded-full animate-pulse" />

        {/* Title Skeleton */}
        <div className="h-8 w-48 bg-slate-800 rounded mb-4 animate-pulse" />
        
        {/* Movies Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {/* We maken een array van 10 items om 10 lege kaarten te tonen */}
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse">
              {/* Poster placeholder */}
              <div className="aspect-[2/3] bg-slate-800 rounded-lg mb-3" />
              {/* Title placeholder */}
              <div className="h-4 bg-slate-800 rounded w-3/4 mb-2" />
              {/* Date placeholder */}
              <div className="h-3 bg-slate-800 rounded w-1/4" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}