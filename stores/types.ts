// Global state types

// User / Auth
export interface User {
  id: string;
  name: string;
  email: string;
}

// App-level UI / meta state
export interface AppState {
  theme: 'light' | 'dark';
  isLoading: boolean;
}

// Product domain
export interface ProductRating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: ProductRating;
}

export interface ProductState {
  products: Product[];
  selectedProductId: number | null;
  isLoading: boolean;
  error: string | null;
}
