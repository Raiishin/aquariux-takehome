import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {WatchlistMovie, SortOrder, SortDirection} from '../types/tmdb';

const STORAGE_KEY = '@moviedb_watchlist';
const SORT_STORAGE_KEY = '@moviedb_watchlist_sort';

interface WatchlistState {
  watchlist: WatchlistMovie[];
  sortOrder: SortOrder;
  sortDirection: SortDirection;
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  addToWatchlist: (movie: WatchlistMovie) => Promise<void>;
  removeFromWatchlist: (movieId: number) => Promise<void>;
  isInWatchlist: (movieId: number) => boolean;
  setSortOrder: (sortOrder: SortOrder) => Promise<void>;
  setSortDirection: (direction: SortDirection) => Promise<void>;
}

async function persistList(watchlist: WatchlistMovie[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
  } catch (e) {
    console.warn('[WatchlistStore] Failed to persist list:', e);
  }
}

async function persistSort(sortOrder: SortOrder, sortDirection: SortDirection): Promise<void> {
  try {
    await AsyncStorage.setItem(SORT_STORAGE_KEY, JSON.stringify({sortOrder, sortDirection}));
  } catch (e) {
    console.warn('[WatchlistStore] Failed to persist sort:', e);
  }
}

export const useWatchlistStore = create<WatchlistState>((set, get) => ({
  watchlist: [],
  sortOrder: 'rating',
  sortDirection: 'desc',
  isHydrated: false,

  hydrate: async () => {
    try {
      const [listRaw, sortRaw] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(SORT_STORAGE_KEY),
      ]);
      const watchlist = listRaw ? (JSON.parse(listRaw) as WatchlistMovie[]) : [];
      const sort = sortRaw ? JSON.parse(sortRaw) : {};
      set({
        watchlist,
        sortOrder: sort.sortOrder ?? 'rating',
        sortDirection: sort.sortDirection ?? 'desc',
        isHydrated: true,
      });
    } catch (e) {
      console.warn('[WatchlistStore] Failed to hydrate:', e);
      set({isHydrated: true});
    }
  },

  addToWatchlist: async (movie: WatchlistMovie) => {
    const {watchlist} = get();
    if (watchlist.some(m => m.id === movie.id)) return;
    const updated = [...watchlist, movie];
    set({watchlist: updated});
    await persistList(updated);
  },

  removeFromWatchlist: async (movieId: number) => {
    const {watchlist} = get();
    const updated = watchlist.filter(m => m.id !== movieId);
    set({watchlist: updated});
    await persistList(updated);
  },

  isInWatchlist: (movieId: number) => {
    return get().watchlist.some(m => m.id === movieId);
  },

  setSortOrder: async (sortOrder: SortOrder) => {
    set({sortOrder});
    await persistSort(sortOrder, get().sortDirection);
  },

  setSortDirection: async (direction: SortDirection) => {
    set({sortDirection: direction});
    await persistSort(get().sortOrder, direction);
  },
}));
