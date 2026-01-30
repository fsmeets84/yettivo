import { getMovieById } from "@/lib/tmdb";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// Define the type for the URL parameters
type Props = {
  params: Promise<{ id: string }>;
};

// 1. NEW: Dynamic Metadata Function
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovieById(id);

  if (!movie) {
    return {
      title: "Movie Not Found",
    };
  }

  return {
    title: movie.title, // This becomes "Movie Title | Yettivo"
    description: movie.overview,
  };
}

export default async function MoviePage({ params }: Props) {
  const { id } = await params;
  const movie = await getMovieById(id);

  if (!movie) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      {/* --- HERO SECTION WITH BACKDROP --- */}
      <div className="relative h-[40vh] md:h-[60vh] w-full overflow-hidden">
        {/* Background Image */}
        {movie.backdrop_path ? (
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover opacity-50"
          />
        ) : (
          <div className="w-full h-full bg-slate-800" />
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-6 left-6 z-10">
          <Link 
            href="/"
            className="flex items-center gap-2 bg-black/50 hover:bg-blue-600 backdrop-blur-md text-white px-4 py-2 rounded-full transition-colors font-medium text-sm"
          >
            ← Back to Search
          </Link>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="max-w-6xl mx-auto px-6 -mt-32 relative z-10 pb-20">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Poster Card */}
          <div className="w-48 md:w-72 shrink-0 rounded-xl overflow-hidden shadow-2xl border-4 border-slate-800">
             {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-auto"
                />
             ) : (
                <div className="h-96 bg-slate-700 flex items-center justify-center text-slate-400">
                  No Image
                </div>
             )}
          </div>

          {/* Movie Details */}
          <div className="flex-1 mt-4 md:mt-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
              {movie.title}
            </h1>
            
            <div className="flex flex-wrap gap-4 items-center text-slate-300 mb-6 text-sm md:text-base">
              {movie.release_date && (
                <span>{movie.release_date.split("-")[0]}</span>
              )}
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              <span className="flex items-center gap-1 text-yellow-400 font-bold">
                ★ {movie.vote_average?.toFixed(1)}
              </span>
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              {movie.runtime && <span>{movie.runtime} min</span>}
            </div>

            <p className="text-lg leading-relaxed text-slate-300 max-w-3xl mb-8">
              {movie.overview}
            </p>

            {/* Extra Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 border-t border-slate-800 pt-8">
              <div>
                <span className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Status</span>
                <span className="font-medium">{movie.status}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Language</span>
                <span className="font-medium uppercase">{movie.original_language}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Genres</span>
                <span className="font-medium">
                  {movie.genres?.map((g: any) => g.name).join(", ")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}