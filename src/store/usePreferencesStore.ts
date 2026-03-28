import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {MovieCategory, SortOrder, SortDirection} from '../types/tmdb';

const STORAGE_KEY = '@moviedb_preferences';

interface PreferencesState {
  category: MovieCategory;
  sortOrder: SortOrder;
  sortDirection: SortDirection;
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  setCategory: (category: MovieCategory) => Promise<void>;
  setSortOrder: (sortOrder: SortOrder) => Promise<void>;
  setSortDirection: (direction: SortDirection) => Promise<void>;
}

async function persist(state: {
  category: MovieCategory;
  sortOrder: SortOrder;
  sortDirection: SortDirection;
}): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('[PreferencesStore] Failed to persist:', e);
  }
}

export const usePreferencesStore = create<PreferencesState>((set, get) => ({
  category: 'now_playing',
  sortOrder: 'release_date',
  sortDirection: 'desc',
  isHydrated: false,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        set({...parsed, isHydrated: true});
      } else {
        set({isHydrated: true});
      }
    } catch (e) {
      console.warn('[PreferencesStore] Failed to hydrate:', e);
      set({isHydrated: true});
    }
  },

  setCategory: async (category: MovieCategory) => {
    set({category});
    const {sortOrder, sortDirection} = get();
    await persist({category, sortOrder, sortDirection});
  },

  setSortOrder: async (sortOrder: SortOrder) => {
    set({sortOrder});
    const {category, sortDirection} = get();
    await persist({category, sortOrder, sortDirection});
  },

  setSortDirection: async (direction: SortDirection) => {
    set({sortDirection: direction});
    const {category, sortOrder} = get();
    await persist({category, sortOrder, sortDirection: direction});
  },
}));
