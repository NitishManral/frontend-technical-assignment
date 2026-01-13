import { create } from 'zustand';
import type { Product, ProductState } from './types';

// Store shape for product-specific actions and state
interface ProductStore extends ProductState {
  // Setters
  setProducts: (products: Product[]) => void;
  upsertProduct: (product: Product) => void;
  removeProduct: (id: number) => void;
  clearProducts: () => void;

  // Selection
  selectProduct: (id: number | null) => void;

  // Async actions
  fetchProducts: () => Promise<void>;
}

const API_URL = 'https://fakestoreapi.com/products';

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  selectedProductId: null,
  isLoading: false,
  error: null,

  setProducts: (products) => set({ products }),

  upsertProduct: (product) =>
    set((state) => {
      const existingIndex = state.products.findIndex((p) => p.id === product.id);
      if (existingIndex === -1) {
        return { products: [...state.products, product] };
      }

      const next = [...state.products];
      next[existingIndex] = product;
      return { products: next };
    }),

  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
      selectedProductId:
        state.selectedProductId === id ? null : state.selectedProductId,
    })),

  clearProducts: () =>
    set({
      products: [],
      selectedProductId: null,
      error: null,
    }),

  selectProduct: (id) => set({ selectedProductId: id }),

  // Fetch from external API and hydrate store
  fetchProducts: async () => {
    // Avoid parallel fetches if one is already in progress
    if (get().isLoading) return;

    set({ isLoading: true, error: null });

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Failed to fetch products (${response.status})`);
      }

      const data = (await response.json()) as Product[];
      set({ products: data, isLoading: false, error: null });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown error while fetching products';

      set({ isLoading: false, error: message });
    }
  },
}));

// Convenience hooks for more ergonomic access

/**
 * Returns the full product list and loading/error flags.
 * Usage: const { products, isLoading, error } = useProducts();
 */
export const useProducts = () =>
  useProductStore((state) => ({
    products: state.products,
    isLoading: state.isLoading,
    error: state.error,
  }));

/**
 * Returns a single product by ID (or currently selected one if no id is passed).
 * Usage: const product = useProduct(1);
 */
export const useProduct = (id?: number) =>
  useProductStore((state) => {
    const targetId = id ?? state.selectedProductId;
    return targetId == null
      ? undefined
      : state.products.find((p) => p.id === targetId);
  });

/**
 * Returns CRUD helpers for products without subscribing to product list changes.
 * Usage: const { fetchProducts, upsertProduct, removeProduct } = useProductActions();
 */
export const useProductActions = () =>
  useProductStore((state) => ({
    fetchProducts: state.fetchProducts,
    upsertProduct: state.upsertProduct,
    removeProduct: state.removeProduct,
    clearProducts: state.clearProducts,
    selectProduct: state.selectProduct,
  }));

