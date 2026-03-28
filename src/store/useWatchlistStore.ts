import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {WatchlistMovie} from '../types/tmdb';

const STORAGE_KEY = '@moviedb_watchlist';

interface WatchlistState {
  watchlist: WatchlistMovie[];
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  addToWatchlist: (movie: WatchlistMovie) => Promise<void>;
  removeFromWatchlist: (movieId: number) => Promise<void>;
  isInWatchlist: (movieId: number) => boolean;
}

async function persist(watchlist: WatchlistMovie[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
  } catch (e) {
    console.warn('[WatchlistStore] Failed to persist:', e);
  }
}

export const useWatchlistStore = create<WatchlistState>((set, get) => ({
  watchlist: [],
  isHydrated: false,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: WatchlistMovie[] = JSON.parse(raw);
        set({watchlist: parsed, isHydrated: true});
      } else {
        set({isHydrated: true});
      }
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
    await persist(updated);
  },

  removeFromWatchlist: async (movieId: number) => {
    const {watchlist} = get();
    const updated = watchlist.filter(m => m.id !== movieId);
    set({watchlist: updated});
    await persist(updated);
  },

  isInWatchlist: (movieId: number) => {
    return get().watchlist.some(m => m.id === movieId);
  },
}));
