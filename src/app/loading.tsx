export default function Loading() {
  return (
    /* bg-transparent laat de globale glows uit layout.tsx doorschijnen */
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center gap-6">
      
      <div className="relative flex items-center justify-center">
        {/* De 'Pulse' ringen voor een modern diepte-effect */}
        <div className="absolute h-16 w-16 border border-blue-500/20 rounded-sm animate-ping duration-[2000ms]" />
        
        {/* De centrale loader: een strakke vierkante box die roteert */}
        <div className="relative h-10 w-10 border-2 border-blue-500/20 rounded-sm flex items-center justify-center">
          <div className="h-4 w-4 bg-blue-600 rounded-[1px] animate-spin duration-[1500ms] shadow-[0_0_15px_rgba(37,99,235,0.4)]" />
        </div>
      </div>

      {/* Loading tekst in de nieuwe professionele stijl */}
      <div className="flex flex-col items-center gap-1">
        <p className="text-[13px] font-medium text-white tracking-tight animate-pulse">
          Loading library
        </p>
        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
      </div>
    </div>
  );
}