const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// --- MOVIES ---

export async function searchMovies(query: string) {
  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US`
  );
  
  if (!res.ok) throw new Error('Failed to fetch movies');
  const data = await res.json();
  return data.results;
}

export async function getTrendingMovies() {
  const res = await fetch(
    `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=en-US`
  );
  
  if (!res.ok) throw new Error('Failed to fetch trending movies');
  const data = await res.json();
  return data.results;
}

export async function getMovieById(id: string) {
  const res = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`
  );

  if (!res.ok) return null;
  return res.json();
}

// --- TV SERIES ---

export async function searchTvShows(query: string) {
  const res = await fetch(
    `${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US`
  );
  
  if (!res.ok) throw new Error('Failed to fetch TV shows');
  const data = await res.json();
  return data.results;
}

export async function getTrendingTvShows() {
  const res = await fetch(
    `${BASE_URL}/trending/tv/week?api_key=${API_KEY}&language=en-US`
  );
  
  if (!res.ok) throw new Error('Failed to fetch trending TV shows');
  const data = await res.json();
  return data.results;
}

export async function getTvShowById(id: string) {
  const res = await fetch(
    `${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=en-US`
  );

  if (!res.ok) return null;
  return res.json();
}