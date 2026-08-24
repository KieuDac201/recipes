"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { getRecipes } from "@/src/services/recipeApi";
import { getCategories } from "@/src/services/categoryApi";
import type { Recipe, PaginationMeta, Category } from "@/src/types/recipe";
import {
  PUBLIC_RECIPE_PAGE_SIZE,
  SEARCH_DEBOUNCE_MS,
} from "@/src/config/constants";
import {
  type RecipeSortOption,
  RECIPE_SORT_OPTIONS,
} from "@/app/components/RecipeSortSelect";

// ─── URL Param Helpers ───────────────────────────────────────────

/** Build a URLSearchParams instance from current params with selective updates. */
function buildUpdatedParams(
  current: URLSearchParams,
  newParams: {
    page?: number;
    search?: string;
    sort?: string;
    categories?: string;
  },
): URLSearchParams {
  const updated = new URLSearchParams(current.toString());

  if (newParams.page !== undefined) {
    newParams.page > 1
      ? updated.set("page", String(newParams.page))
      : updated.delete("page");
  }

  if (newParams.search !== undefined) {
    const trimmed = newParams.search.trim();
    trimmed ? updated.set("search", trimmed) : updated.delete("search");
  }

  if (newParams.categories !== undefined) {
    const trimmed = newParams.categories.trim();
    trimmed
      ? updated.set("categories", trimmed)
      : updated.delete("categories");
  }

  if (newParams.sort !== undefined) {
    newParams.sort !== RECIPE_SORT_OPTIONS[0].id
      ? updated.set("sort", newParams.sort)
      : updated.delete("sort");
  }

  return updated;
}

/** Parse and sanitize URL search params into typed values. */
function parseUrlParams(searchParams: URLSearchParams) {
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("categories") || "";
  const sortParam = searchParams.get("sort") || RECIPE_SORT_OPTIONS[0].id;
  const currentSortOption =
    RECIPE_SORT_OPTIONS.find((opt) => opt.id === sortParam) ||
    RECIPE_SORT_OPTIONS[0];

  return { currentPage, currentSearch, currentCategory, sortParam, currentSortOption };
}

// ─── Main Hook ───────────────────────────────────────────────────

export function useRecipeListing() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Derived state from URL
  const { currentPage, currentSearch, currentCategory, sortParam, currentSortOption } =
    parseUrlParams(searchParams);

  // 2. Component state
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 3. Refs for race-condition prevention & debounce cleanup
  const lastFetchedKeyRef = useRef<string>("");
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const gridSectionRef = useRef<HTMLDivElement | null>(null);

  // 4. Load categories list on initial mount
  useEffect(() => {
    let isMounted = true;
    getCategories()
      .then((data) => {
        if (isMounted) setCategories(data);
      })
      .catch((err) => {
        console.error("Failed to load categories:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // 5. URL update helper
  const updateUrlParams = useCallback(
    (
      newParams: { page?: number; search?: string; sort?: string; categories?: string },
      mode: "push" | "replace" = "push",
    ) => {
      const updated = buildUpdatedParams(searchParams, newParams);
      const queryString = updated.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;

      if (mode === "replace") {
        router.replace(targetUrl, { scroll: false });
      } else {
        router.push(targetUrl, { scroll: false });
      }
    },
    [pathname, router, searchParams],
  );

  // 6. Core data fetching
  const fetchRecipesData = useCallback(
    async (
      page: number,
      searchTerm: string,
      sortOpt: RecipeSortOption,
      categoryVal: string,
      shouldScrollToTop: boolean = false,
    ) => {
      const fetchKey = `${page}|${searchTerm}|${sortOpt.id}|${categoryVal}`;
      lastFetchedKeyRef.current = fetchKey;

      setIsLoading(true);
      setError(null);
      try {
        const res = await getRecipes({
          search: searchTerm || undefined,
          categories: categoryVal || undefined,
          current_page: page,
          limit: PUBLIC_RECIPE_PAGE_SIZE,
          sort_by: sortOpt.sortBy,
          sort_order: sortOpt.sortOrder,
        });

        if (lastFetchedKeyRef.current === fetchKey) {
          setRecipes(res.data || []);
          setPagination(res.pagination || null);
        }

        if (shouldScrollToTop && typeof window !== "undefined") {
          if (gridSectionRef.current) {
            const topOffset =
              gridSectionRef.current.getBoundingClientRect().top +
              window.pageYOffset -
              80;
            window.scrollTo({ top: Math.max(0, topOffset), behavior: "smooth" });
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }
      } catch (err: unknown) {
        console.error("Failed to load recipes:", err);
        if (lastFetchedKeyRef.current === fetchKey) {
          setError("Không thể tải danh sách công thức. Vui lòng kiểm tra lại kết nối.");
        }
      } finally {
        if (lastFetchedKeyRef.current === fetchKey) {
          setIsLoading(false);
        }
      }
    },
    [],
  );

  // 7. Sync state with URL (handles mount, reload, popstate)
  useEffect(() => {
    const currentKey = `${currentPage}|${currentSearch}|${currentSortOption.id}|${currentCategory}`;

    // Keep controlled input aligned when navigating history
    setSearchInput(currentSearch);

    if (lastFetchedKeyRef.current !== currentKey) {
      fetchRecipesData(currentPage, currentSearch, currentSortOption, currentCategory, false);
    }
  }, [currentPage, currentSearch, sortParam, currentCategory, currentSortOption, fetchRecipesData]);

  // 8. Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, []);

  // ─── Event Handlers ─────────────────────────────────────────────

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);

    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);

    searchTimerRef.current = setTimeout(() => {
      updateUrlParams({ search: value, page: 1 }, "replace");
    }, SEARCH_DEBOUNCE_MS);
  };

  const handleClearSearch = () => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    setSearchInput("");
    updateUrlParams({ search: "", page: 1 }, "push");
  };

  const handleCategoryChange = (newCategory: string) => {
    updateUrlParams({ categories: newCategory, page: 1 }, "push");
  };

  const handleSortChange = (newOption: RecipeSortOption) => {
    updateUrlParams({ sort: newOption.id, page: 1 }, "push");
  };

  const handlePageChange = (newPage: number) => {
    updateUrlParams({ page: newPage }, "push");
    fetchRecipesData(newPage, currentSearch, currentSortOption, currentCategory, true);
  };

  const handleResetAllFilters = () => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    setSearchInput("");
    updateUrlParams({ search: "", categories: "", page: 1 }, "push");
  };

  const handleRetry = () => {
    fetchRecipesData(currentPage, currentSearch, currentSortOption, currentCategory, false);
  };

  // ─── Derived Values ─────────────────────────────────────────────

  const hasActiveFilters = Boolean(currentSearch || currentCategory);

  // ─── Public API ─────────────────────────────────────────────────

  return {
    // State
    recipes,
    categories,
    pagination,
    isLoading,
    error,
    searchInput,
    currentPage,
    currentCategory,
    currentSortOption,
    hasActiveFilters,

    // Refs
    gridSectionRef,

    // Handlers
    handleSearchChange,
    handleClearSearch,
    handleCategoryChange,
    handleSortChange,
    handlePageChange,
    handleResetAllFilters,
    handleRetry,
  };
}
