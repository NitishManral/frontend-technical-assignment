# Global State Management with Zustand

This project uses Zustand for global state management. Zustand is a lightweight, TypeScript-friendly state management solution that works seamlessly with Next.js.

## Store Structure

- `types.ts` - TypeScript type definitions for all stores
- `useAppStore.ts` - Application-level state (theme, loading states, etc.)
- `useUserStore.ts` - User-related state
- `index.ts` - Central export point for all stores

## Usage Examples

### Using App Store

```tsx
'use client';

import { useAppStore } from '@/stores';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useAppStore();

  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}
```

### Using User Store

```tsx
'use client';

import { useUserStore } from '@/stores';

export default function UserProfile() {
  const { user, setUser, clearUser } = useUserStore();

  const handleLogin = () => {
    setUser({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    });
  };

  return (
    <div>
      {user ? (
        <>
          <p>Welcome, {user.name}!</p>
          <button onClick={clearUser}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### Selecting Specific State (Performance Optimization)

For better performance, you can select only the specific state you need:

```tsx
'use client';

import { useAppStore } from '@/stores';

export default function LoadingIndicator() {
  // Only re-renders when isLoading changes
  const isLoading = useAppStore((state) => state.isLoading);

  return isLoading ? <div>Loading...</div> : null;
}
```

## Adding New Stores

1. Create a new store file (e.g., `useCartStore.ts`)
2. Define types in `types.ts` if needed
3. Export from `index.ts`
4. Use in components with `'use client'` directive

## Benefits of Zustand

- ✅ No provider wrapper needed
- ✅ TypeScript support out of the box
- ✅ Minimal boilerplate
- ✅ Great performance with selective subscriptions
- ✅ Works with Next.js App Router
- ✅ Small bundle size (~1KB)
