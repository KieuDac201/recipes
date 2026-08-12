"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getRecipes } from "@/src/services/recipeApi";
import type { Recipe, PaginationMeta } from "@/src/types/recipe";
import RecipeCard from "./RecipeCard";
import RecipeSkeletonCard from "./RecipeSkeletonCard";

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
  const isFirstRender = useRef(true);

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
      setError("Không thể tải danh sách công thức. Vui lòng kiểm tra lại kết nối.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialRecipes(debouncedSearch);
  }, [debouncedSearch, fetchInitialRecipes]);

  // Load more handler
  const handleLoadMore = async () => {
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
  };

  const hasMore = pagination
    ? (pagination.currentPage || 1) < (pagination.totalPage || 1)
    : false;

  return (
    <>
      {/* Hero + Search */}
      <section className="text-center mb-16 flex flex-col items-center">
        <h1 className="font-[var(--font-headline)] text-4xl md:text-5xl font-extrabold tracking-tight text-[#1b1c1a] mb-10 leading-tight">
          Hôm nay chúng ta nấu gì nào? 🍳
        </h1>

        {/* Search bar */}
        <div className="relative w-full max-w-2xl mb-6 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span
              className="material-symbols-outlined text-[#584140] group-focus-within:text-[#ff6b6b] transition-colors"
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
            className="w-full bg-[#f8f9fa] border-0 rounded-full py-4 pl-12 pr-12 text-lg text-[#1b1c1a] placeholder:text-[#584140]/60 focus:ring-2 focus:ring-[#ff6b6b] focus:bg-white shadow-inner transition-all duration-300 outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#584140] hover:text-[#ff6b6b] cursor-pointer"
              title="Xóa tìm kiếm"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
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
          <p className="text-xl font-semibold text-[#1b1c1a]">Không tìm thấy công thức nào.</p>
          <p className="text-[#584140] mt-1">Hãy thử tìm kiếm bằng từ khóa khác.</p>
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
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </section>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center mt-12 mb-6">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="bg-[#ff6b6b] text-white font-[var(--font-headline)] text-base font-bold px-8 py-3.5 rounded-full shadow-[0_4px_14px_rgba(255,107,107,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(255,107,107,0.45)] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 cursor-pointer"
              >
                {isLoadingMore ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Đang tải thêm...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">expand_more</span>
                    Xem Thêm Công Thức
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
