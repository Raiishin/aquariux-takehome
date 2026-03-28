import type {MovieListItem, SortOrder, SortDirection} from '../types/tmdb';

export function sortMovies(
  movies: MovieListItem[],
  sortOrder: SortOrder,
  direction: SortDirection,
): MovieListItem[] {
  const sorted = [...movies];
  sorted.sort((a, b) => {
    switch (sortOrder) {
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      case 'rating':
        return a.vote_average - b.vote_average;
      case 'release_date':
        return (
          new Date(a.release_date).getTime() -
          new Date(b.release_date).getTime()
        );
      default:
        return 0;
    }
  });
  if (direction === 'desc') sorted.reverse();
  return sorted;
}

export function formatRuntime(minutes: number | null): string {
  if (minutes === null || minutes === 0) return 'N/A';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function formatReleaseDate(dateStr: string): string {
  if (!dateStr) return 'TBA';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'TBA';
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}
