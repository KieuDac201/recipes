"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { deleteRecipe, getAdminRecipes, updateRecipeStatus } from "@/src/services/recipeApi";
import { Recipe, RecipeStatus, PaginationMeta } from "@/src/types/recipe";
import { ApiError } from "@/src/services/apiClient";
import { useInfiniteScroll } from "@/src/hooks/useInfiniteScroll";
import type { ToastState } from "@/app/admin/components/AdminToast";
import {
  ADMIN_RECIPE_PAGE_SIZE,
  ADMIN_SEARCH_DEBOUNCE_MS,
  TOAST_DURATION_MS,
} from "@/src/config/constants";

export function useAdminRecipesManagement() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<RecipeStatus>("all");

  // Modals state
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [recipeToApprove, setRecipeToApprove] = useState<Recipe | null>(null);
  const [isApproving, setIsApproving] = useState(false);

  const [recipeToReject, setRecipeToReject] = useState<Recipe | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectError, setRejectError] = useState<string | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);

  // Toast notification state with memory leak safety
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast({ message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, TOAST_DURATION_MS);
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, ADMIN_SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch recipes from admin API
  const loadRecipes = useCallback(
    async (search?: string, status: RecipeStatus = "all") => {
      setIsLoading(true);
      try {
        const res = await getAdminRecipes({
          limit: ADMIN_RECIPE_PAGE_SIZE,
          current_page: 1,
          search: search || undefined,
          status: status,
        });
        setRecipes(res.data || []);
        setPagination(res.pagination || null);
      } catch (err: unknown) {
        console.error("[useAdminRecipesManagement] Error loading recipes:", err);
        showToast(
          err instanceof ApiError
            ? err.message
            : "Không thể tải danh sách công thức. Vui lòng kiểm tra lại kết nối.",
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  // Initial load and on search/status change
  useEffect(() => {
    loadRecipes(debouncedSearch, activeStatus);
  }, [debouncedSearch, activeStatus, loadRecipes]);

  // Load more handler
  const handleLoadMore = useCallback(async () => {
    if (!pagination || isLoadingMore) return;
    const nextPage = (pagination.currentPage || 1) + 1;
    if (nextPage > (pagination.totalPage || 1)) return;

    setIsLoadingMore(true);
    setLoadMoreError(false);
    try {
      const res = await getAdminRecipes({
        limit: ADMIN_RECIPE_PAGE_SIZE,
        current_page: nextPage,
        search: debouncedSearch || undefined,
        status: activeStatus,
      });
      setRecipes((prev) => [...prev, ...(res.data || [])]);
      setPagination(res.pagination || null);
    } catch (err: unknown) {
      console.error("[useAdminRecipesManagement] Error loading more recipes:", err);
      setLoadMoreError(true);
    } finally {
      setIsLoadingMore(false);
    }
  }, [pagination, isLoadingMore, debouncedSearch, activeStatus]);

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

  // Handle delete recipe
  const handleConfirmDelete = async () => {
    if (!recipeToDelete) return;

    setIsDeleting(true);
    try {
      await deleteRecipe(recipeToDelete.id);
      setRecipes((prev) => prev.filter((r) => r.id !== recipeToDelete.id));
      showToast(`Đã xóa thành công công thức "${recipeToDelete.title}"!`);
      setRecipeToDelete(null);
    } catch (err: unknown) {
      console.error("[useAdminRecipesManagement] Error deleting recipe:", err);
      const msg =
        err instanceof ApiError
          ? err.message
          : "Đã xảy ra lỗi khi xóa công thức. Vui lòng thử lại.";
      showToast(msg, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle approve recipe
  const handleConfirmApprove = async () => {
    if (!recipeToApprove) return;

    setIsApproving(true);
    try {
      await updateRecipeStatus(recipeToApprove.id, "approved");
      setRecipes((prev) =>
        prev.map((r) =>
          r.id === recipeToApprove.id
            ? { ...r, status: "approved", rejection_reason: null }
            : r
        )
      );
      showToast(`Đã duyệt công thức "${recipeToApprove.title}" thành công!`);
      setRecipeToApprove(null);
    } catch (err: unknown) {
      console.error("[useAdminRecipesManagement] Error approving recipe:", err);
      const msg =
        err instanceof ApiError
          ? err.message
          : "Đã xảy ra lỗi khi duyệt công thức. Vui lòng thử lại.";
      showToast(msg, "error");
    } finally {
      setIsApproving(false);
    }
  };

  // Handle reject recipe
  const handleConfirmReject = async () => {
    if (!recipeToReject) return;

    if (!rejectionReason.trim()) {
      setRejectError("Vui lòng nhập lý do từ chối công thức.");
      return;
    }

    setIsRejecting(true);
    try {
      await updateRecipeStatus(recipeToReject.id, "rejected", rejectionReason.trim());
      setRecipes((prev) =>
        prev.map((r) =>
          r.id === recipeToReject.id
            ? { ...r, status: "rejected", rejection_reason: rejectionReason.trim() }
            : r
        )
      );
      showToast(`Đã từ chối công thức "${recipeToReject.title}"!`);
      setRecipeToReject(null);
      setRejectionReason("");
      setRejectError(null);
    } catch (err: unknown) {
      console.error("[useAdminRecipesManagement] Error rejecting recipe:", err);
      const msg =
        err instanceof ApiError
          ? err.message
          : "Đã xảy ra lỗi khi từ chối công thức. Vui lòng thử lại.";
      showToast(msg, "error");
    } finally {
      setIsRejecting(false);
    }
  };

  const openRejectModal = (recipe: Recipe) => {
    setRecipeToReject(recipe);
    setRejectionReason(recipe.rejection_reason || "");
    setRejectError(null);
  };

  const closeRejectModal = () => {
    setRecipeToReject(null);
    setRejectionReason("");
    setRejectError(null);
  };

  return {
    recipes,
    pagination,
    isLoading,
    isLoadingMore,
    searchQuery,
    setSearchQuery,
    debouncedSearch,
    activeStatus,
    setActiveStatus,
    recipeToDelete,
    setRecipeToDelete,
    isDeleting,
    recipeToApprove,
    setRecipeToApprove,
    isApproving,
    recipeToReject,
    openRejectModal,
    closeRejectModal,
    rejectionReason,
    setRejectionReason,
    rejectError,
    setRejectError,
    isRejecting,
    toast,
    setToast,
    loadRecipes,
    handleConfirmDelete,
    handleConfirmApprove,
    handleConfirmReject,
    sentinelRef,
  };
}
