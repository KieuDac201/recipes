"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import AuthGuard from "@/app/components/AuthGuard";
import { getMyRecipes } from "@/src/services/recipeApi";
import { Recipe, RecipeStatus, PaginationMeta } from "@/src/types/recipe";
import { useInfiniteScroll } from "@/src/hooks/useInfiniteScroll";
import { MY_RECIPE_PAGE_SIZE, SEARCH_DEBOUNCE_MS } from "@/src/config/constants";
import RecipeCard from "@/app/components/RecipeCard";
import RecipeSkeletonCard from "@/app/components/RecipeSkeletonCard";
import InfiniteScrollSentinel from "@/app/components/InfiniteScrollSentinel";
import Tabs from "@/app/components/Tabs";

const STATUS_TABS: Array<{ label: string; value: RecipeStatus }> = [
  { label: "Tất cả", value: "all" },
  { label: "Đang chờ duyệt", value: "pending" },
  { label: "Đã duyệt", value: "approved" },
  { label: "Bị từ chối", value: "rejected" },
];

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [activeTab, setActiveTab] = useState<RecipeStatus>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadMoreError, setLoadMoreError] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch my recipes initial
  const fetchMyRecipes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getMyRecipes({
        status: activeTab,
        search: debouncedSearch || undefined,
        current_page: 1,
        limit: MY_RECIPE_PAGE_SIZE,
      });
      setRecipes(res.data || []);
      setPagination(res.pagination || null);
    } catch (err: unknown) {
      console.error("[MyRecipesPage] Error loading recipes:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Không thể tải danh sách công thức của bạn."
      );
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, debouncedSearch]);

  useEffect(() => {
    fetchMyRecipes();
  }, [fetchMyRecipes]);

  // Load more handler
  const handleLoadMore = useCallback(async () => {
    if (!pagination || isLoadingMore) return;
    const nextPage = (pagination.currentPage || 1) + 1;
    if (nextPage > (pagination.totalPage || 1)) return;

    setIsLoadingMore(true);
    setLoadMoreError(false);
    try {
      const res = await getMyRecipes({
        status: activeTab,
        search: debouncedSearch || undefined,
        current_page: nextPage,
        limit: MY_RECIPE_PAGE_SIZE,
      });
      setRecipes((prev) => [...prev, ...(res.data || [])]);
      setPagination(res.pagination || null);
    } catch (err: unknown) {
      console.error("[MyRecipesPage] Error loading more recipes:", err);
      setLoadMoreError(true);
    } finally {
      setIsLoadingMore(false);
    }
  }, [pagination, isLoadingMore, activeTab, debouncedSearch]);

  const hasMore = pagination
    ? (pagination.currentPage || 1) < (pagination.totalPage || 1)
    : false;

  // Use common infinite scroll hook
  const { sentinelRef } = useInfiniteScroll({
    hasMore,
    isLoading: isLoading || isLoadingMore,
    hasError: loadMoreError,
    onLoadMore: handleLoadMore,
  });

  const handleTabChange = (tab: RecipeStatus) => {
    setActiveTab(tab);
  };

  return (
    <AuthGuard>
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-12 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#1b1c1a] tracking-tight font-[var(--font-headline)]">
              Món Của Tôi
            </h1>
            <p className="text-sm text-[#8c706f] mt-1">
              Quản lý các công thức bạn đã chia sẻ và theo dõi trạng thái kiểm duyệt.
            </p>
          </div>
          <Link
            href="/recipes/create"
            className="inline-flex items-center justify-center gap-2 bg-[#ff6b6b] text-white text-sm font-semibold py-2.5 px-5 rounded-full hover:scale-105 active:scale-95 transition-transform shadow-[0_2px_0_0_#ae2f34]"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Tạo Công Thức Mới
          </Link>
        </div>

        {/* Filter Controls: Tabs + Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Tabs */}
          <Tabs<RecipeStatus>
            tabs={STATUS_TABS}
            activeTab={activeTab}
            onChange={handleTabChange}
            variant="white"
            ariaLabel="Lọc trạng thái món của tôi"
          />

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Tìm trong món của tôi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e5e3dc] rounded-full text-sm placeholder-[#8c706f] focus:outline-none focus:border-[#ff6b6b] transition-colors"
            />
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-[#8c706f]">
              search
            </span>
          </div>
        </div>

        {/* Content Listing */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <RecipeSkeletonCard key={idx} />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-700 text-sm">
            <p className="font-semibold mb-2">{error}</p>
            <button
              onClick={fetchMyRecipes}
              className="text-xs underline font-bold hover:text-red-900"
            >
              Thử lại
            </button>
          </div>
        ) : recipes.length === 0 ? (
          <div className="bg-white border border-[#e5e3dc] rounded-3xl p-12 text-center">
            <div className="w-16 h-16 bg-[#ff6b6b]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#ff6b6b]">
              <span className="material-symbols-outlined text-3xl">menu_book</span>
            </div>
            <h3 className="text-lg font-bold text-[#1b1c1a] mb-2">Chưa có công thức nào</h3>
            <p className="text-sm text-[#8c706f] max-w-md mx-auto mb-6">
              {search
                ? `Không tìm thấy công thức nào phù hợp với từ khóa "${search}".`
                : activeTab !== "all"
                ? `Bạn hiện không có công thức nào ở trạng thái này.`
                : "Hãy bắt đầu chia sẻ công thức nấu ăn đặc sắc của bạn với cộng đồng ngay hôm nay!"}
            </p>
            <Link
              href="/recipes/create"
              className="inline-flex items-center gap-2 bg-[#ff6b6b] text-white text-sm font-semibold py-2.5 px-6 rounded-full hover:scale-105 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              Thêm công thức đầu tiên
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="h-full flex flex-col">
                <RecipeCard
                  recipe={recipe}
                  showStatus={true}
                  showEditButton={true}
                  className="h-full"
                />
              </div>
            ))}
          </div>
        )}

        {/* Infinite Scroll Sentinel */}
        {!isLoading && recipes.length > 0 && (
          <InfiniteScrollSentinel
            sentinelRef={sentinelRef}
            isLoadingMore={isLoadingMore}
            loadingText="Đang tải thêm công thức của bạn..."
          />
        )}
      </main>
    </AuthGuard>
  );
}
