const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  runtime: number;
  status: string;
  budget: number;
  revenue: number;
  genres: { id: number; name: string }[];
  production_companies: { id: number; name: string; logo_path: string | null }[];
  original_language: string;
  popularity: number;
}

export interface TvShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  last_air_date: string;
  vote_average: number;
  number_of_seasons: number;
  number_of_episodes: number;
  status: string;
  in_production: boolean;
  genres: { id: number; name: string }[];
  networks: { id: number; name: string; logo_path: string | null }[];
  origin_country: string[];
  original_language: string;
  episode_run_time: number[];
  // Voeg deze regel toe:
  seasons: {
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    season_number: number;
    episode_count: number;
    air_date: string;
  }[];
}
// Helper for fetching from TMDB
async function fetchFromTMDB(endpoint: string, params: string = "") {
  const url = `${BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}&language=en-US${params}`;
  const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour
  if (!res.ok) return null;
  return res.json();
}

// Movies
export async function getTrendingMovies() {
  const data = await fetchFromTMDB("/trending/movie/day");
  return data?.results || [];
}

export async function getMovieById(id: string): Promise<Movie | null> {
  return fetchFromTMDB(`/movie/${id}`);
}

export async function getMovieVideos(id: string) {
  const data = await fetchFromTMDB(`/movie/${id}/videos`);
  return data?.results?.find((v: any) => v.type === "Trailer" && v.site === "YouTube") || data?.results?.[0];
}

// TV Shows
export async function getTrendingTvShows() {
  const data = await fetchFromTMDB("/trending/tv/day");
  return data?.results || [];
}

export async function getTvShowById(id: string): Promise<TvShow | null> {
  return fetchFromTMDB(`/tv/${id}`);
}

export async function getTvVideos(id: string) {
  const data = await fetchFromTMDB(`/tv/${id}/videos`);
  return data?.results?.find((v: any) => v.type === "Trailer" && v.site === "YouTube") || data?.results?.[0];
}

export async function getSeasonDetails(tvId: string, seasonNumber: number) {
  const data = await fetchFromTMDB(`/tv/${tvId}/season/${seasonNumber}`);
  return data;
}

// Search
export async function searchMulti(query: string) {
  const data = await fetchFromTMDB("/search/multi", `&query=${encodeURIComponent(query)}`);
  return data?.results || [];
}