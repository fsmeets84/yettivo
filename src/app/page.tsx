import { searchMovies, getTrendingMovies, searchTvShows, getTrendingTvShows } from '@/lib/tmdb';
import SearchBox from '@/components/SearchBox';
import CategorySwitch from '@/components/CategorySwitch';
import { Movie, TvShow } from '@/types/types';
import Link from 'next/link';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
};

export default async function Home(props: Props) {
  const searchParams = await props.searchParams;
  const query = typeof searchParams.query === 'string' ? searchParams.query : null;
  
  // Determine category from URL (default to 'movie')
  const category = typeof searchParams.category === 'string' && searchParams.category === 'tv' ? 'tv' : 'movie';
  
  // The list can contain either Movies or TvShows
  let items: (Movie | TvShow)[] = [];
  
  try {
    if (category === 'movie') {
      items = query ? await searchMovies(query) : await getTrendingMovies();
    } else {
      items = query ? await searchTvShows(query) : await getTrendingTvShows();
    }
  } catch (error) {
    console.error(error);
  }

  return (
    <main className="p-8 bg-slate-900 min-h-screen text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-blue-400 tracking-tight text-center md:text-left">
           Discover your next favorite {category === 'movie' ? 'movie' : 'series'}.
        </h1>
        
        <SearchBox />
        
        {/* Switch between Movies and TV Series */}
        <CategorySwitch />

        <h2 className="text-xl mb-4 text-slate-400">
          {query ? (
            <>Results for: <span className="text-white italic">"{query}"</span></>
          ) : (
            <span className="text-white">Trending {category === 'movie' ? 'Movies' : 'TV Series'} this week 🔥</span>
          )}
        </h2>
        
        {items.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            No results found.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {items.map((item) => {
              // Type Guard: Check if item is Movie (has title) or TV (has name)
              const isMovie = 'title' in item;
              const title = isMovie ? (item as Movie).title : (item as TvShow).name;
              const date = isMovie ? (item as Movie).release_date : (item as TvShow).first_air_date;
              const linkUrl = isMovie ? `/movie/${item.id}` : `/tv/${item.id}`;

              return (
                <Link 
                  key={item.id} 
                  href={linkUrl} 
                  className="group block"
                >
                  <div className="aspect-[2/3] relative overflow-hidden rounded-lg bg-slate-800 shadow-lg group-hover:shadow-blue-900/20 transition-all">
                    {item.poster_path ? (
                      <img 
                        src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                        alt={title}
                        className="hover:scale-105 transition-transform duration-300 object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-500 text-sm p-4 text-center">
                        No poster available
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm">
                      {item.vote_average?.toFixed(1)}
                    </div>
                  </div>
                  <p className="mt-3 font-semibold truncate text-slate-100 group-hover:text-blue-400 transition-colors">
                    {title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {date ? date.split('-')[0] : 'Unknown'}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}