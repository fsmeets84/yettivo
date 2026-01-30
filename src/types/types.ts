export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  // Optional: add media_type for mixed results later
  media_type?: 'movie'; 
}

export interface TvShow {
  id: number;
  name: string; // TV shows use 'name', not 'title'
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string; // TV shows use 'first_air_date'
  vote_average: number;
  media_type?: 'tv';
}