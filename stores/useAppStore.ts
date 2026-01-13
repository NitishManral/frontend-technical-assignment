import { create } from 'zustand';
import { AppState } from './types';

interface AppStore extends AppState {
  setTheme: (theme: 'light' | 'dark') => void;
  setLoading: (isLoading: boolean) => void;
  toggleTheme: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  theme: 'light',
  isLoading: false,
  setTheme: (theme) => set({ theme }),
  setLoading: (isLoading) => set({ isLoading }),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}));
