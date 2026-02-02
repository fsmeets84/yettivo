export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  // Optional extra details
  genres?: { id: number; name: string }[];
  runtime?: number;
  status?: string;
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  // Optional extra details
  number_of_seasons?: number;
  status?: string;
  genres?: { id: number; name: string }[];
  networks?: { name: string }[];
}