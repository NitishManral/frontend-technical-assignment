// Export all stores from a single entry point
export { useAppStore } from './useAppStore';
export { useUserStore } from './useUserStore';
export {
  useProductStore,
  useProducts,
  useProduct,
  useProductActions,
} from './useProductStore';

export type {
  User,
  AppState,
  Product,
  ProductRating,
  ProductState,
} from './types';
