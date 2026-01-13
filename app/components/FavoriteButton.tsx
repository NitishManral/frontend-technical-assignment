'use client';

import { useIsProductFavorite, useToggleFavorite } from '../../stores/useFavoritesStore';

interface FavoriteButtonProps {
  productId: number;
  className?: string;
}

export default function FavoriteButton({ productId, className = '' }: FavoriteButtonProps) {
  const isFavorite = useIsProductFavorite(productId);
  const toggleFavorite = useToggleFavorite();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(productId);
  };

  return (
    <button
      onClick={handleClick}
      className={`group/favorite flex items-center justify-center rounded-full p-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 ${className}`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={isFavorite}
    >
      {isFavorite ? (
        // Filled heart (favorited)
        <svg
          className="h-6 w-6 text-red-500 transition-colors group-hover/favorite:text-red-600 dark:text-red-400 dark:group-hover/favorite:text-red-300"
          fill="currentColor"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ) : (
        // Outline heart (not favorited)
        <svg
          className="h-6 w-6 text-zinc-400 transition-colors group-hover/favorite:text-red-500 dark:text-zinc-500 dark:group-hover/favorite:text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      )}
    </button>
  );
}
