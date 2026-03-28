import {create} from 'zustand';
import type {MovieCategory, SortOrder, SortDirection} from '../types/tmdb';
import {storageGet, storageSet} from './storage';

const STORAGE_KEY = 'moviedb_preferences';

interface PreferencesState {
  category: MovieCategory;
  sortOrder: SortOrder;
  sortDirection: SortDirection;
  sortExplicitlySet: boolean;
  isHydrated: boolean;
  hydrate: () => void;
  setCategory: (category: MovieCategory) => void;
  setSortOrder: (sortOrder: SortOrder) => void;
  setSortDirection: (direction: SortDirection) => void;
}

export const usePreferencesStore = create<PreferencesState>((set, get) => ({
  category: 'now_playing',
  sortOrder: 'release_date',
  sortDirection: 'desc',
  sortExplicitlySet: false,
  isHydrated: false,

  hydrate: () => {
    const parsed = storageGet<Partial<PreferencesState>>(STORAGE_KEY);
    if (parsed) {
      set({...parsed, isHydrated: true});
    } else {
      set({isHydrated: true});
    }
  },

  setCategory: (category: MovieCategory) => {
    set({category});
    const {sortOrder, sortDirection, sortExplicitlySet} = get();
    storageSet(STORAGE_KEY, {category, sortOrder, sortDirection, sortExplicitlySet});
  },

  setSortOrder: (sortOrder: SortOrder) => {
    set({sortOrder, sortExplicitlySet: true});
    const {category, sortDirection} = get();
    storageSet(STORAGE_KEY, {category, sortOrder, sortDirection, sortExplicitlySet: true});
  },

  setSortDirection: (direction: SortDirection) => {
    set({sortDirection: direction});
    const {category, sortOrder, sortExplicitlySet} = get();
    storageSet(STORAGE_KEY, {category, sortOrder, sortDirection: direction, sortExplicitlySet});
  },
}));
