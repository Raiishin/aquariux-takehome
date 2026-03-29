import apiClient from './client';
import type {
  MovieCategory,
  MovieListItem,
  PaginatedResponse,
  MovieDetails,
  MovieCredits,
  ReleaseDatesResponse,
} from '../types/tmdb';

export const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w342';
export const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w780';
export const PROFILE_BASE_URL = 'https://image.tmdb.org/t/p/w185';

export async function fetchMoviesByCategory(
  category: MovieCategory,
  page = 1,
): Promise<PaginatedResponse<MovieListItem>> {
  const response = await apiClient.get<PaginatedResponse<MovieListItem>>(
    `/movie/${category}`,
    { params: { page } },
  );
  return response.data;
}

export async function searchMoviesInCategory(
  category: MovieCategory,
  keyword: string,
  page = 1,
): Promise<PaginatedResponse<MovieListItem>> {
  const response = await apiClient.get<PaginatedResponse<MovieListItem>>(
    `/movie/${category}`,
    { params: { page } },
  );
  const lower = keyword.toLowerCase();
  const filtered = response.data.results.filter(
    movie =>
      movie.title.toLowerCase().includes(lower) ||
      movie.overview.toLowerCase().includes(lower),
  );
  return { ...response.data, results: filtered };
}

export async function fetchMovieDetails(
  movieId: number,
): Promise<MovieDetails> {
  const response = await apiClient.get<MovieDetails>(`/movie/${movieId}`);
  return response.data;
}

export async function fetchMovieCredits(
  movieId: number,
): Promise<MovieCredits> {
  const response = await apiClient.get<MovieCredits>(
    `/movie/${movieId}/credits`,
  );
  return response.data;
}

export async function fetchMovieCertification(
  movieId: number,
): Promise<string> {
  const response = await apiClient.get<ReleaseDatesResponse>(
    `/movie/${movieId}/release_dates`,
  );
  const results = response.data.results;
  const usEntry = results.find(r => r.iso_3166_1 === 'US');
  if (usEntry) {
    const theatrical = usEntry.release_dates.find(rd => rd.type === 3);
    if (theatrical && theatrical.certification) {
      return theatrical.certification;
    }
    const first = usEntry.release_dates.find(rd => rd.certification);
    if (first) return first.certification;
  }
  for (const entry of results) {
    const found = entry.release_dates.find(rd => rd.certification);
    if (found) return found.certification;
  }
  return 'NR';
}

export async function fetchRecommendedMovies(
  movieId: number,
): Promise<MovieListItem[]> {
  const response = await apiClient.get<PaginatedResponse<MovieListItem>>(
    `/movie/${movieId}/recommendations`,
  );
  return response.data.results.slice(0, 20);
}

export async function fetchAccountDetails() {
  const response = await apiClient.get('/account');
  return response.data;
}
