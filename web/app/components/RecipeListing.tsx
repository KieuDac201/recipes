"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getRecipes } from "@/src/services/recipeApi";
import type { Recipe, PaginationMeta } from "@/src/types/recipe";
import { useInfiniteScroll } from "@/src/hooks/useInfiniteScroll";
import RecipeCard from "./RecipeCard";
import RecipeSkeletonCard from "./RecipeSkeletonCard";
import InfiniteScrollSentinel from "./InfiniteScrollSentinel";

const PAGE_SIZE = 8;

export default function RecipeListing() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Initial fetch and fetch when search changes
  const fetchInitialRecipes = useCallback(async (searchTerm: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getRecipes({
        search: searchTerm || undefined,
        current_page: 1,
        limit: PAGE_SIZE,
      });
      setRecipes(res.data || []);
      setPagination(res.pagination || null);
    } catch (err: any) {
      console.error("Failed to load recipes:", err);
      setError(
        "Không thể tải danh sách công thức. Vui lòng kiểm tra lại kết nối.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialRecipes(debouncedSearch);
  }, [debouncedSearch, fetchInitialRecipes]);

  // Load more handler
  const handleLoadMore = useCallback(async () => {
    if (!pagination || isLoadingMore) return;
    const nextPage = (pagination.currentPage || 1) + 1;
    if (nextPage > (pagination.totalPage || 1)) return;

    setIsLoadingMore(true);
    try {
      const res = await getRecipes({
        search: debouncedSearch || undefined,
        current_page: nextPage,
        limit: PAGE_SIZE,
      });
      setRecipes((prev) => [...prev, ...(res.data || [])]);
      setPagination(res.pagination || null);
    } catch (err: any) {
      console.error("Failed to load more recipes:", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [pagination, isLoadingMore, debouncedSearch]);

  const hasMore = pagination
    ? (pagination.currentPage || 1) < (pagination.totalPage || 1)
    : false;

  // Use common infinite scroll hook
  const { sentinelRef } = useInfiniteScroll({
    hasMore,
    isLoading: isLoading || isLoadingMore,
    onLoadMore: handleLoadMore,
  });

  return (
    <>
      {/* Hero + Search */}
      <section className="text-center mb-16 flex flex-col items-center">
        <h1 className="font-[var(--font-headline)] text-4xl md:text-5xl font-extrabold tracking-tight text-[#1b1c1a] mb-10 leading-tight">
          Hôm nay chúng ta nấu gì nào? 🍳
        </h1>

        {/* Search bar */}
        <div className="relative w-full max-w-2xl mb-6 group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
            <span
              className="material-symbols-outlined text-[#8c706f] group-focus-within:text-[#ff6b6b] text-[22px] transition-colors"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              search
            </span>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm công thức món ăn..."
            className="w-full bg-white border-2 border-[#e5e3dc] rounded-full py-4 pl-14 pr-12 text-base md:text-lg text-[#1b1c1a] font-medium placeholder:text-[#8c706f]/70 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_36px_rgba(255,107,107,0.12)] hover:border-[#ff6b6b]/40 focus:border-[#ff6b6b] focus:ring-4 focus:ring-[#ff6b6b]/15 focus:shadow-[0_14px_40px_rgba(255,107,107,0.18)] focus:outline-none focus-visible:outline-none outline-none transition-all duration-300"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#8c706f] hover:text-[#ff6b6b] transition-colors cursor-pointer"
              title="Xóa tìm kiếm"
            >
              <span className="material-symbols-outlined text-[20px] bg-[#efeeea] hover:bg-[#ffdad8] p-1 rounded-full transition-colors">
                close
              </span>
            </button>
          )}
        </div>
      </section>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center max-w-lg mx-auto mb-10">
          <p className="font-semibold mb-3">{error}</p>
          <button
            onClick={() => fetchInitialRecipes(debouncedSearch)}
            className="bg-[#ff6b6b] text-white px-6 py-2 rounded-full text-sm font-bold shadow hover:bg-[#ae2f34] transition-colors cursor-pointer"
          >
            Thử Lại
          </button>
        </div>
      )}

      {/* Loading Skeleton on Initial Load */}
      {isLoading && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <RecipeSkeletonCard key={i} />
          ))}
        </section>
      )}

      {/* Empty State */}
      {!isLoading && !error && recipes.length === 0 && (
        <div className="text-center py-24">
          <span className="text-6xl mb-4 block">🍽️</span>
          <p className="text-xl font-semibold text-[#1b1c1a]">
            Không tìm thấy công thức nào.
          </p>
          <p className="text-[#584140] mt-1">
            Hãy thử tìm kiếm bằng từ khóa khác.
          </p>
          {debouncedSearch && (
            <button
              onClick={() => setSearch("")}
              className="mt-5 bg-[#ff6b6b] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow hover:bg-[#ae2f34] transition-colors cursor-pointer"
            >
              Xóa Bộ Lọc
            </button>
          )}
        </div>
      )}

      {/* Recipe Grid */}
      {!isLoading && !error && recipes.length > 0 && (
        <>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </section>

          {/* Sentinel element for infinite scrolling */}
          <InfiniteScrollSentinel
            sentinelRef={sentinelRef}
            isLoadingMore={isLoadingMore}
            loadingText="Đang tải thêm món ngon..."
          />
        </>
      )}
    </>
  );
}
