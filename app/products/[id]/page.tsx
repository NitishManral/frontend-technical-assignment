'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect } from 'react';
import { useProduct, useProducts, useProductsLoading, useProductsError, useFetchProducts } from '../../../stores/useProductStore';

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
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <p className="text-lg text-zinc-600 dark:text-zinc-400">Loading product...</p>
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
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-contain p-8"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center space-y-6">
            {/* Category */}
            <div className="text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {product.category}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-black dark:text-zinc-50 sm:text-5xl">
              {product.title}
            </h1>

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
