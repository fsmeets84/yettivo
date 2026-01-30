import { getTvShowById } from "@/lib/tmdb";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

// 1. Dynamic Metadata for TV Shows
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const show = await getTvShowById(id);

  if (!show) {
    return {
      title: "TV Show Not Found",
    };
  }

  return {
    title: show.name, // "Breaking Bad | Yettivo"
    description: show.overview,
  };
}

export default async function TvPage({ params }: Props) {
  const { id } = await params;
  const show = await getTvShowById(id);

  if (!show) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      {/* --- HERO SECTION WITH BACKDROP --- */}
      <div className="relative h-[40vh] md:h-[60vh] w-full overflow-hidden">
        {/* Background Image */}
        {show.backdrop_path ? (
          <img
            src={`https://image.tmdb.org/t/p/original${show.backdrop_path}`}
            alt={show.name}
            className="w-full h-full object-cover opacity-50"
          />
        ) : (
          <div className="w-full h-full bg-slate-800" />
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-6 left-6 z-10">
          {/* Note: We force the category back to 'tv' so the user returns to the TV list */}
          <Link 
            href="/?category=tv"
            className="flex items-center gap-2 bg-black/50 hover:bg-blue-600 backdrop-blur-md text-white px-4 py-2 rounded-full transition-colors font-medium text-sm"
          >
            ← Back to TV Series
          </Link>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="max-w-6xl mx-auto px-6 -mt-32 relative z-10 pb-20">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Poster Card */}
          <div className="w-48 md:w-72 shrink-0 rounded-xl overflow-hidden shadow-2xl border-4 border-slate-800">
             {show.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                  alt={show.name}
                  className="w-full h-auto"
                />
             ) : (
                <div className="h-96 bg-slate-700 flex items-center justify-center text-slate-400">
                  No Image
                </div>
             )}
          </div>

          {/* TV Show Details */}
          <div className="flex-1 mt-4 md:mt-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
              {show.name}
            </h1>
            
            <div className="flex flex-wrap gap-4 items-center text-slate-300 mb-6 text-sm md:text-base">
              {show.first_air_date && (
                <span>{show.first_air_date.split("-")[0]}</span>
              )}
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              <span className="flex items-center gap-1 text-yellow-400 font-bold">
                ★ {show.vote_average?.toFixed(1)}
              </span>
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              {/* Show number of seasons instead of runtime */}
              <span>
                {show.number_of_seasons} {show.number_of_seasons === 1 ? "Season" : "Seasons"}
              </span>
            </div>

            <p className="text-lg leading-relaxed text-slate-300 max-w-3xl mb-8">
              {show.overview}
            </p>

            {/* Extra Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 border-t border-slate-800 pt-8">
              <div>
                <span className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Status</span>
                <span className="font-medium">{show.status}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Network</span>
                {/* Show the first network logo or name */}
                <span className="font-medium">
                  {show.networks && show.networks[0] ? show.networks[0].name : "Unknown"}
                </span>
              </div>
              <div>
                <span className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Genres</span>
                <span className="font-medium">
                  {show.genres?.map((g: any) => g.name).join(", ")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}