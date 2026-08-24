"use client";

import { useEffect, useRef } from "react";

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  isLoading: boolean;
  hasError?: boolean;
  onLoadMore: () => void | Promise<void>;
  rootMargin?: string;
}

export function useInfiniteScroll({
  hasMore,
  isLoading,
  hasError = false,
  onLoadMore,
  rootMargin = "300px",
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  // Track whether user has scrolled sentinel out of view since last error
  const hasLeftViewportRef = useRef(false);

  // Reset the "left viewport" flag whenever the error clears
  useEffect(() => {
    if (!hasError) {
      hasLeftViewportRef.current = false;
    }
  }, [hasError]);

  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting) {
          // If there's an error, only trigger if user scrolled away and back
          if (hasError && !hasLeftViewportRef.current) return;
          onLoadMore();
        } else {
          // Sentinel left viewport — allow next intersection to retry
          if (hasError) {
            hasLeftViewportRef.current = true;
          }
        }
      },
      { rootMargin }
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasMore, isLoading, hasError, onLoadMore, rootMargin]);

  return { sentinelRef };
}
