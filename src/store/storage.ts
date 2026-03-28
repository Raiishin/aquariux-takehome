import {createMMKV} from 'react-native-mmkv';

export const storage = createMMKV({id: 'moviedb-storage'});

export function storageGet<T>(key: string): T | undefined {
  const raw = storage.getString(key);
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

export function storageSet(key: string, value: unknown): void {
  storage.set(key, JSON.stringify(value));
}

export function storageDelete(key: string): void {
  storage.delete(key);
}
