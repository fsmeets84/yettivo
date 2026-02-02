export default function AccountLoading() {
  return (
    /* bg-transparent is cruciaal om de globale glows uit globals.css te zien */
    <div className="min-h-screen bg-transparent p-6 pt-32 space-y-12 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl space-y-12 relative z-10">
        
        {/* Profile Header Skeleton */}
        <div className="flex items-center gap-8 p-8 glass-card animate-pulse">
          <div className="w-20 h-20 rounded-2xl bg-white/[0.05]" />
          <div className="space-y-4 flex-1">
            <div className="h-3 w-32 bg-white/[0.05] rounded-full" />
            <div className="h-6 w-48 bg-white/[0.05] rounded-full" />
          </div>
        </div>

        {/* Account Stats Grid - Matching the 4-column layout of the page */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 glass-card animate-pulse shadow-2xl" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-8 space-y-12">
            <div className="space-y-6">
              <div className="h-4 w-40 bg-white/[0.05] animate-pulse rounded-full ml-1" />
              <div className="grid grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="aspect-[2/3] glass-card animate-pulse" />
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="h-4 w-32 bg-white/[0.05] animate-pulse rounded-full ml-1" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 glass-card animate-pulse w-full" />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-4">
            <div className="h-80 glass-card rounded-[2.5rem] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}