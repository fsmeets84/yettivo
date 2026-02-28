"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { 
  ChevronLeftIcon, 
  UserIcon, 
  IdentificationIcon, 
  FilmIcon,
  MapPinIcon,
  CakeIcon,
  UserCircleIcon,
  PlusIcon,
  MinusIcon
} from "@heroicons/react/24/outline";
import MovieCard from "@/components/MovieCard";

export default function PersonDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [person, setPerson] = useState<any>(null);
  const [credits, setCredits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchPersonData = async () => {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      try {
        setLoading(true);
        const [personRes, creditsRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}&language=en-US`),
          fetch(`https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${apiKey}&language=en-US`)
        ]);
        
        const personData = await personRes.json();
        const creditsData = await creditsRes.json();

        setPerson(personData);
        
        const uniqueCredits = creditsData.cast
          .filter((v: any, i: number, a: any[]) => a.findIndex(t => t.id === v.id) === i)
          .sort((a: any, b: any) => b.popularity - a.popularity)
          .slice(0, 18);
          
        setCredits(uniqueCredits);
      } catch (error) {
        console.error("Error fetching person data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPersonData();
  }, [id]);

  if (loading || !person) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c]">
      <div className="h-6 w-6 border-2 border-[#3b82f6]/20 border-t-[#3b82f6] rounded-full animate-spin" />
    </div>
  );

  const hasLongBio = person.biography && person.biography.length > 500;

  return (
    <main className="min-h-screen bg-[#0a0a0c] pt-32 pb-20 relative">
      <div className="container mx-auto px-8 relative z-10 max-w-[1800px]">
        
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-[#3b82f6] transition-all mb-12 group"
        >
          <ChevronLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to archive
        </button>

        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          <aside className="w-full lg:w-72 flex-shrink-0 space-y-10">
            <div className="aspect-[2/3] relative overflow-hidden rounded-sm border border-white/10 bg-zinc-900 shadow-2xl">
              {person.profile_path ? (
                <Image 
                  src={`https://image.tmdb.org/t/p/h632${person.profile_path}`} 
                  alt={person.name} 
                  fill 
                  className="object-cover opacity-90 transition-transform duration-700 hover:scale-105" 
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-zinc-900">
                  <UserIcon className="h-16 w-16 text-zinc-800" />
                </div>
              )}
            </div>

            <div className="space-y-8 px-1">
              <h2 className="text-[11px] font-black text-white uppercase tracking-[0.2em] border-b border-white/5 pb-2">Personal Details</h2>
              <div className="space-y-6">
                <MetaMini icon={<IdentificationIcon className="h-4 w-4" />} label="Known For" value={person.known_for_department} />
                <MetaMini icon={<CakeIcon className="h-4 w-4" />} label="Born" value={person.birthday} />
                <MetaMini icon={<MapPinIcon className="h-4 w-4" />} label="Birthplace" value={person.place_of_birth} />
              </div>
            </div>
          </aside>

          <div className="flex-1 space-y-16 min-w-0">
            <header className="space-y-6">
              <div className="flex items-center gap-2 text-[#3b82f6]">
                <UserCircleIcon className="h-5 w-5" />
                <span className="text-[11px] font-bold tracking-widest uppercase">Personnel Profile</span>
              </div>
              <h1 className="text-6xl font-black text-white tracking-tighter leading-none">
                {person.name}
              </h1>
              <div className="h-1 w-20 bg-blue-600 rounded-sm" />
            </header>

            <section className="space-y-4 max-w-4xl relative">
              <h3 className="text-[11px] font-black text-[#3b82f6] tracking-[0.2em] uppercase">Biography</h3>
              
              <div className="relative">
                <p className={`text-zinc-400 leading-relaxed text-[15px] font-medium whitespace-pre-line transition-all duration-700 ${
                  !isExpanded && hasLongBio ? "line-clamp-6" : ""
                }`}>
                  {person.biography || `Information about ${person.name} is currently being updated.`}
                </p>

                {/* Fade Effect Gradient */}
                {!isExpanded && hasLongBio && (
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0a0a0c] to-transparent pointer-events-none" />
                )}
              </div>

              {hasLongBio && (
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-2 text-[10px] font-black text-[#3b82f6] uppercase tracking-[0.2em] hover:text-white transition-colors pt-2"
                >
                  {isExpanded ? (
                    <>Show less <MinusIcon className="h-3 w-3" /></>
                  ) : (
                    <>Read full bio <PlusIcon className="h-3 w-3" /></>
                  )}
                </button>
              )}
            </section>

            <section className="space-y-8">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2 text-[#3b82f6]">
                  <FilmIcon className="h-5 w-5" />
                  <h2 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Featured In</h2>
                </div>
                <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">{credits.length} Projects Found</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
                {credits.map((item) => (
                  <MovieCard 
                    key={`${item.id}-${item.credit_id || item.id}`} 
                    id={item.id} 
                    title={item.title || item.name} 
                    posterPath={item.poster_path} 
                    voteAverage={item.vote_average} 
                    type={item.media_type} 
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function MetaMini({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="text-blue-500/50 mt-1 shrink-0">{icon}</div>
      <div>
        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1.5">{label}</p>
        <p className="text-[13px] font-bold text-zinc-300 tracking-tight leading-tight">{value || "Not available"}</p>
      </div>
    </div>
  );
}