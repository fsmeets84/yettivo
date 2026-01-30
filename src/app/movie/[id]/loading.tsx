export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-900 text-white animate-pulse">
      {/* --- HERO SECTION SKELETON --- */}
      <div className="relative h-[40vh] md:h-[60vh] w-full bg-slate-800 overflow-hidden">
        <div className="absolute top-6 left-6 z-10 w-32 h-10 bg-slate-700 rounded-full" />
      </div>

      {/* --- CONTENT SECTION SKELETON --- */}
      <div className="max-w-6xl mx-auto px-6 -mt-32 relative z-10 pb-20">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Poster Card Skeleton */}
          <div className="w-48 md:w-72 shrink-0 rounded-xl bg-slate-800 border-4 border-slate-900 aspect-[2/3]" />

          {/* Text Details Skeleton */}
          <div className="flex-1 mt-4 md:mt-12 space-y-4">
            {/* Title */}
            <div className="h-10 md:h-12 bg-slate-800 rounded w-3/4" />
            
            {/* Meta info (stars, runtime etc) */}
            <div className="flex gap-4">
              <div className="h-6 w-12 bg-slate-800 rounded" />
              <div className="h-6 w-12 bg-slate-800 rounded" />
              <div className="h-6 w-12 bg-slate-800 rounded" />
            </div>

            {/* Overview paragraphs */}
            <div className="space-y-2 pt-4 max-w-3xl">
              <div className="h-4 bg-slate-800 rounded w-full" />
              <div className="h-4 bg-slate-800 rounded w-full" />
              <div className="h-4 bg-slate-800 rounded w-5/6" />
            </div>

            {/* Grid details */}
            <div className="grid grid-cols-3 gap-6 pt-8 mt-8 border-t border-slate-800">
               <div className="h-10 bg-slate-800 rounded" />
               <div className="h-10 bg-slate-800 rounded" />
               <div className="h-10 bg-slate-800 rounded" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}