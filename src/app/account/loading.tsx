export default function AccountLoading() {
  return (
    /* bg-transparent laat de globale aura uit layout.tsx doorschijnen */
    <div className="min-h-screen bg-transparent pt-32 pb-20 relative overflow-hidden">
      <div className="container mx-auto px-8 max-w-6xl relative z-10 space-y-12">
        
        {/* Profile Header Skeleton */}
        <header className="flex items-center justify-between border-b border-white/5 pb-10 mb-12">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 rounded-sm bg-white/[0.03] border border-white/10 animate-pulse" />
            <div className="space-y-3">
              <div className="h-8 w-48 bg-white/[0.08] animate-pulse rounded-sm" />
              <div className="h-3 w-64 bg-white/[0.03] animate-pulse rounded-sm" />
            </div>
          </div>
          <div className="text-right space-y-2">
            <div className="h-3 w-24 bg-white/[0.03] animate-pulse rounded-sm ml-auto" />
            <div className="h-10 w-16 bg-white/[0.08] animate-pulse rounded-sm ml-auto" />
          </div>
        </header>

        {/* Stats Grid Skeleton - 4 kolommen */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-white/[0.02] border border-white/5 rounded-sm animate-pulse" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Recently Added Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-center px-1">
                <div className="h-3 w-32 bg-white/[0.05] animate-pulse rounded-sm" />
                <div className="h-3 w-20 bg-blue-500/10 animate-pulse rounded-sm" />
              </div>
              <div className="grid grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="aspect-[2/3] bg-white/[0.03] border border-white/5 rounded-sm animate-pulse" />
                ))}
              </div>
            </div>

            {/* Currently Watching Section */}
            <div className="space-y-6">
              <div className="h-3 w-40 bg-white/[0.05] animate-pulse rounded-sm px-1" />
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-20 bg-white/[0.02] border border-white/5 rounded-sm animate-pulse w-full" />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <aside className="lg:col-span-4">
            <div className="h-80 bg-white/[0.03] border border-white/5 rounded-sm animate-pulse p-8 space-y-10">
              <div className="h-3 w-32 bg-white/[0.05] rounded-sm" />
              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="flex justify-between"><div className="h-2 w-12 bg-white/5" /><div className="h-2 w-8 bg-white/5" /></div>
                  <div className="h-1 w-full bg-white/5 rounded-full" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between"><div className="h-2 w-12 bg-white/5" /><div className="h-2 w-8 bg-white/5" /></div>
                  <div className="h-1 w-full bg-white/5 rounded-full" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}