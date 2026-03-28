import {create} from 'zustand';
import type {WatchlistMovie, SortOrder, SortDirection} from '../types/tmdb';
import {storageGet, storageSet} from './storage';

const STORAGE_KEY = 'moviedb_watchlist';
const SORT_STORAGE_KEY = 'moviedb_watchlist_sort';

interface WatchlistState {
  watchlist: WatchlistMovie[];
  sortOrder: SortOrder;
  sortDirection: SortDirection;
  isHydrated: boolean;
  hydrate: () => void;
  addToWatchlist: (movie: WatchlistMovie) => void;
  removeFromWatchlist: (movieId: number) => void;
  isInWatchlist: (movieId: number) => boolean;
  setSortOrder: (sortOrder: SortOrder) => void;
  setSortDirection: (direction: SortDirection) => void;
}

export const useWatchlistStore = create<WatchlistState>((set, get) => ({
  watchlist: [],
  sortOrder: 'rating',
  sortDirection: 'desc',
  isHydrated: false,

  hydrate: () => {
    const watchlist = storageGet<WatchlistMovie[]>(STORAGE_KEY) ?? [];
    const sort = storageGet<{sortOrder: SortOrder; sortDirection: SortDirection}>(SORT_STORAGE_KEY);
    set({
      watchlist,
      sortOrder: sort?.sortOrder ?? 'rating',
      sortDirection: sort?.sortDirection ?? 'desc',
      isHydrated: true,
    });
  },

  addToWatchlist: (movie: WatchlistMovie) => {
    const {watchlist} = get();
    if (watchlist.some(m => m.id === movie.id)) return;
    const updated = [...watchlist, movie];
    set({watchlist: updated});
    storageSet(STORAGE_KEY, updated);
  },

  removeFromWatchlist: (movieId: number) => {
    const {watchlist} = get();
    const updated = watchlist.filter(m => m.id !== movieId);
    set({watchlist: updated});
    storageSet(STORAGE_KEY, updated);
  },

  isInWatchlist: (movieId: number) => {
    return get().watchlist.some(m => m.id === movieId);
  },

  setSortOrder: (sortOrder: SortOrder) => {
    set({sortOrder});
    storageSet(SORT_STORAGE_KEY, {sortOrder, sortDirection: get().sortDirection});
  },

  setSortDirection: (direction: SortDirection) => {
    set({sortDirection: direction});
    storageSet(SORT_STORAGE_KEY, {sortOrder: get().sortOrder, sortDirection: direction});
  },
}));
