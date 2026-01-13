'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { useProducts, useProductsLoading, useProductsError, useFetchProducts } from '../stores/useProductStore';
import { useIsFavorite } from '../stores/useFavoritesStore';
import FavoriteButton from './components/FavoriteButton';

// Product Image component with error handling
function ProductImage({ src, alt }: { src: string; alt: string }) {
  const [imgError, setImgError] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgError(false);
    setImgSrc(src);
  }, [src]);

  if (imgError) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-zinc-200 dark:bg-zinc-700">
        <svg
          className="h-12 w-12 text-zinc-400 dark:text-zinc-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      className="object-contain p-4 transition-transform group-hover:scale-105"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
      onError={() => setImgError(true)}
      unoptimized
    />
  );
}

// Skeleton component for product cards
function ProductSkeleton() {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-square w-full bg-zinc-200 dark:bg-zinc-800" />
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Category skeleton */}
        <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
        
        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
        </div>
        
        {/* Price skeleton */}
        <div className="h-6 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
        
        {/* Rating skeleton */}
        <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
      </div>
    </div>
  );
}

export default function Home() {
  const products = useProducts();
  const isLoading = useProductsLoading();
  const error = useProductsError();
  const fetchProducts = useFetchProducts();

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const isFavorite = useIsFavorite();

  useEffect(() => {
    // Fetch products on mount if not already loaded
    if (products.length === 0 && !isLoading) {
      fetchProducts();
    }
  }, [products.length, isLoading, fetchProducts]);

  // Extract unique categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map((p) => p.category)));
    return uniqueCategories.sort();
  }, [products]);

  // Filter products based on search query, category, and favorites
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        searchQuery === '' ||
        product.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === '' || product.category === selectedCategory;
      const matchesFavorites =
        !showFavoritesOnly || isFavorite(product.id);
      return matchesSearch && matchesCategory && matchesFavorites;
    });
  }, [products, searchQuery, selectedCategory, showFavoritesOnly, isFavorite]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50 sm:text-5xl">
            Product Catalog
          </h1>
          <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
            Browse our collection of products
          </p>
        </div>

        {/* Filters */}
        {!isLoading && products.length > 0 && (
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-zinc-400 dark:text-zinc-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-lg border border-black/8 bg-white px-4 py-2.5 pl-10 text-base text-black placeholder-zinc-400 transition-colors focus:border-black/20 focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-white/14 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-white/30 dark:focus:ring-white/10"
              />
            </div>

            {/* Category Dropdown */}
            <div className="sm:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-lg border border-black/8 bg-white px-4 py-2.5 text-base text-black transition-colors focus:border-black/20 focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-white/14 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-white/30 dark:focus:ring-white/10"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Favorites Filter Toggle */}
            <div className="flex items-center">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-black/8 bg-white px-4 py-2.5 transition-colors hover:bg-black/4 dark:border-white/14 dark:bg-zinc-900 dark:hover:bg-[#1a1a1a]">
                <input
                  type="checkbox"
                  checked={showFavoritesOnly}
                  onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-black/8 text-red-500 focus:ring-2 focus:ring-black/10 dark:border-white/14 dark:focus:ring-white/10"
                />
                <span className="text-base text-black dark:text-zinc-50">
                  Favorites Only
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Loading State with Skeletons */}
        {isLoading && products.length === 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && products.length === 0 && (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center max-w-md">
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-red-500 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-2">
                Failed to load products
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6">
                {error}
              </p>
              <button
                onClick={() => fetchProducts()}
                className="inline-flex items-center gap-2 rounded-full border border-solid border-black/8 bg-white px-6 py-3 font-medium transition-colors hover:border-transparent hover:bg-black/4 dark:border-white/14 dark:bg-zinc-900 dark:hover:bg-[#1a1a1a]"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && products.length > 0 && (
          <>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group relative overflow-hidden rounded-2xl bg-white transition-all hover:shadow-lg dark:bg-zinc-900 dark:hover:shadow-zinc-800/50"
              >
                {/* Favorite Button */}
                <div className="absolute right-2 top-2 z-10">
                  <FavoriteButton productId={product.id} />
                </div>

                {/* Product Image */}
                <div className="relative aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <ProductImage src={product.image} alt={product.title} />
                </div>

                {/* Product Info */}
                <div className="p-4">
                  {/* Title */}
                  <h2 className="mb-2 line-clamp-2 text-base font-semibold leading-tight text-black dark:text-zinc-50">
                    {product.title}
                  </h2>

                  {/* Price */}
                  <div className="mb-2 text-xl font-semibold text-black dark:text-zinc-50">
                    ${product.price.toFixed(2)}
                  </div>

                  {/* Category */}
                  <div className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    {product.category}
                  </div>
                </div>
              </Link>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-zinc-400 dark:text-zinc-500 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <p className="text-lg text-zinc-600 dark:text-zinc-400">
                    No products found matching your filters
                  </p>
                  {(searchQuery || selectedCategory || showFavoritesOnly) && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('');
                        setShowFavoritesOnly(false);
                      }}
                      className="mt-4 text-sm text-zinc-500 underline hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && !error && products.length === 0 && (
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="text-lg text-zinc-600 dark:text-zinc-400">No products available</p>
          </div>
        )}
      </main>
    </div>
  );
}
