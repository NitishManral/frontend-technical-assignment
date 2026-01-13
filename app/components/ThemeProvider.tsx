'use client';

import { useEffect } from 'react';
import { useAppStore } from '../../stores/useAppStore';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppStore((state) => state.theme);

  // Sync theme with HTML class when theme changes
  // The blocking script already set the initial class, so this just handles updates
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    console.log('Theme updated to:', theme, 'Dark class present:', root.classList.contains('dark'));
  }, [theme]);

  return <>{children}</>;
}
