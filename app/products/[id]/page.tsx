'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useProduct, useProducts, useProductsLoading, useProductsError, useFetchProducts } from '../../../stores/useProductStore';
import FavoriteButton from '../../components/FavoriteButton';

// Product Image component with error handling
function ProductImage({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
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
          className="h-16 w-16 text-zinc-400 dark:text-zinc-500"
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
      className="object-contain p-8"
      priority={priority}
      sizes="(max-width: 768px) 100vw, 50vw"
      onError={() => setImgError(true)}
      unoptimized
    />
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id ? parseInt(params.id as string, 10) : null;
  
  const products = useProducts();
  const isLoading = useProductsLoading();
  const error = useProductsError();
  const product = useProduct(productId ?? undefined);
  const fetchProducts = useFetchProducts();

  useEffect(() => {
    // Fetch products if not already loaded
    if (products.length === 0 && !isLoading) {
      fetchProducts();
    }
  }, [products.length, isLoading, fetchProducts]);

  // Handle loading state
  if (isLoading && !product) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 h-6 w-20 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Image skeleton */}
            <div className="aspect-square w-full animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
            {/* Content skeleton */}
            <div className="flex flex-col justify-center space-y-6">
              <div className="h-4 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="space-y-2">
                <div className="h-12 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-12 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              </div>
              <div className="h-10 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="space-y-2">
                <div className="h-6 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <p className="text-lg text-red-600 dark:text-red-400">Error: {error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 rounded-full border border-solid border-black/8 px-5 py-2 transition-colors hover:border-transparent hover:bg-black/4 dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Handle product not found
  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <p className="text-lg text-zinc-600 dark:text-zinc-400">Product not found</p>
          <button
            onClick={() => router.back()}
            className="mt-4 rounded-full border border-solid border-black/8 px-5 py-2 transition-colors hover:border-transparent hover:bg-black/4 dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← Back
        </button>

        {/* Product Details */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Large Image */}
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white dark:bg-zinc-900">
            <ProductImage src={product.image} alt={product.title} priority />
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center space-y-6">
            {/* Category */}
            <div className="text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {product.category}
            </div>

            {/* Title with Favorite Button */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-black dark:text-zinc-50 sm:text-5xl flex-1">
                {product.title}
              </h1>
              <FavoriteButton productId={product.id} />
            </div>

            {/* Price */}
            <div className="text-3xl font-semibold text-black dark:text-zinc-50">
              ${product.price.toFixed(2)}
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-black dark:text-zinc-50">Description</h2>
              <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                {product.description}
              </p>
            </div>

            {/* Rating (bonus info) */}
            {product.rating && (
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <span className="font-medium">Rating:</span>
                <span>{product.rating.rate} / 5.0</span>
                <span className="text-zinc-400">({product.rating.count} reviews)</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
