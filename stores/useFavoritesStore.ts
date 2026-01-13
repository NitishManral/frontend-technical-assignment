import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface FavoritesStoreState {
  favoriteIds: number[];
}

interface FavoritesStore extends FavoritesStoreState {
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favoriteIds: [],

      toggleFavorite: (id: number) =>
        set((state) => {
          const favoriteIds = state.favoriteIds.includes(id)
            ? state.favoriteIds.filter((fid) => fid !== id)
            : [...state.favoriteIds, id];
          return { favoriteIds };
        }),

      isFavorite: (id: number) => {
        return get().favoriteIds.includes(id);
      },

      clearFavorites: () => set({ favoriteIds: [] }),
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Convenience hooks for more ergonomic access

/**
 * Returns the array of favorite product IDs.
 * Usage: const favorites = useFavorites();
 */
export const useFavorites = () => useFavoritesStore((state) => state.favoriteIds);

/**
 * Returns a function to toggle favorite status.
 * Usage: const toggleFavorite = useToggleFavorite();
 */
export const useToggleFavorite = () => useFavoritesStore((state) => state.toggleFavorite);

/**
 * Returns a function to check if a product is favorited.
 * Usage: const isFavorite = useIsFavorite();
 */
export const useIsFavorite = () => useFavoritesStore((state) => state.isFavorite);

/**
 * Returns a boolean indicating if a specific product is favorited.
 * Usage: const isFav = useIsProductFavorite(productId);
 */
export const useIsProductFavorite = (id: number) =>
  useFavoritesStore((state) => state.isFavorite(id));

/**
 * Returns a function to clear all favorites.
 * Usage: const clearFavorites = useClearFavorites();
 */
export const useClearFavorites = () => useFavoritesStore((state) => state.clearFavorites);
