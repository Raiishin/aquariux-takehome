export type MovieCategory = 'now_playing' | 'upcoming' | 'popular';
export type SortOrder = 'alphabetical' | 'rating' | 'release_date';
export type SortDirection = 'asc' | 'desc';

export interface MovieListItem {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  original_language: string;
  popularity: number;
}

export interface WatchlistMovie extends MovieListItem {
  addedAt: number;
}

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  genres: Genre[];
  runtime: number | null;
  status: string;
  tagline: string | null;
  original_language: string;
  popularity: number;
  spoken_languages: { english_name: string; iso_639_1: string; name: string }[];
  production_countries: { iso_3166_1: string; name: string }[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
  known_for_department: string;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface MovieCredits {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

export interface ReleaseDateEntry {
  certification: string;
  release_date: string;
  type: number;
}

export interface ReleaseDateResult {
  iso_3166_1: string;
  release_dates: ReleaseDateEntry[];
}

export interface ReleaseDatesResponse {
  id: number;
  results: ReleaseDateResult[];
}

export interface AccountDetails {
  id: number;
  name: string;
  username: string;
  avatar: {
    gravatar: { hash: string };
    tmdb: { avatar_path: string | null };
  };
  iso_639_1: string;
  iso_3166_1: string;
  include_adult: boolean;
}
