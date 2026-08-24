"use client";

import { useRecipeListing } from "@/src/hooks/useRecipeListing";
import { PUBLIC_RECIPE_PAGE_SIZE } from "@/src/config/constants";
import RecipeSearchBar from "./RecipeSearchBar";
import RecipeCard from "./RecipeCard";
import RecipeSkeletonCard from "./RecipeSkeletonCard";
import RecipeSortSelect from "./RecipeSortSelect";
import CategorySelect from "./CategorySelect";
import Pagination from "./Pagination";

export default function RecipeListing() {
  const {
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
    gridSectionRef,
    handleSearchChange,
    handleClearSearch,
    handleCategoryChange,
    handleSortChange,
    handlePageChange,
    handleResetAllFilters,
    handleRetry,
  } = useRecipeListing();

  const showToolbar = !error && (recipes.length > 0 || isLoading);
  const showPagination = pagination && (pagination.totalPage || 0) > 1;

  return (
    <>
      {/* Hero + Search */}
      <RecipeSearchBar
        value={searchInput}
        onChange={handleSearchChange}
        onClear={handleClearSearch}
      />

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center max-w-lg mx-auto mb-10">
          <p className="font-semibold mb-3">{error}</p>
          <button
            type="button"
            onClick={handleRetry}
            className="bg-[#ff6b6b] text-white px-6 py-2 rounded-full text-sm font-bold shadow hover:bg-[#ae2f34] transition-colors cursor-pointer"
          >
            Thử Lại
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div ref={gridSectionRef}>
        {/* Toolbar: Category Filter & Sort Select */}
        {showToolbar && (
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <CategorySelect
                categories={categories}
                value={currentCategory}
                onChange={handleCategoryChange}
                disabled={isLoading}
              />
              <RecipeSortSelect
                value={currentSortOption}
                onChange={handleSortChange}
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        {/* Loading / Empty / Recipe Grid */}
        {isLoading ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: PUBLIC_RECIPE_PAGE_SIZE }).map((_, i) => (
              <RecipeSkeletonCard key={i} />
            ))}
          </section>
        ) : recipes.length === 0 && !error ? (
          <div className="text-center py-24">
            <span className="text-6xl mb-4 block">🍽️</span>
            <p className="text-xl font-semibold text-[#1b1c1a]">
              Không tìm thấy công thức nào.
            </p>
            <p className="text-[#584140] mt-1">
              Hãy thử tìm kiếm bằng từ khóa hoặc danh mục khác.
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetAllFilters}
                className="mt-5 bg-[#ff6b6b] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow hover:bg-[#ae2f34] transition-colors cursor-pointer"
              >
                Xóa Bộ Lọc
              </button>
            )}
          </div>
        ) : (
          <section aria-label="Danh sách công thức nấu ăn">
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch">
              {recipes.map((recipe) => (
                <li key={recipe.id} className="h-full flex flex-col">
                  <RecipeCard recipe={recipe} className="h-full" />
                </li>
              ))}
            </ul>

            {/* Pagination */}
            {showPagination && (
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.totalPage || 1}
                onPageChange={handlePageChange}
                isLoading={isLoading}
              />
            )}
          </section>
        )}
      </div>
    </>
  );
}
