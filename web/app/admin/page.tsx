"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { recipeService, deleteRecipe, getAdminRecipes, updateRecipeStatus } from "@/src/services/recipeApi";
import { Recipe, RecipeStatus, PaginationMeta } from "@/src/types/recipe";
import { ApiError } from "@/src/services/apiClient";
import { useInfiniteScroll } from "@/src/hooks/useInfiniteScroll";
import ApproveRecipeModal from "./components/ApproveRecipeModal";
import RejectRecipeModal from "./components/RejectRecipeModal";
import DeleteRecipeModal from "./components/DeleteRecipeModal";
import AdminRecipeRow from "./components/AdminRecipeRow";
import AdminEmptyState from "./components/AdminEmptyState";
import AdminToast, { ToastState } from "./components/AdminToast";
import InfiniteScrollSentinel from "../components/InfiniteScrollSentinel";

import Tabs from "@/app/components/Tabs";

const ADMIN_STATUS_TABS: Array<{ label: string; value: RecipeStatus }> = [
  { label: "Tất cả", value: "all" },
  { label: "Chờ duyệt", value: "pending" },
  { label: "Đã duyệt", value: "approved" },
  { label: "Bị từ chối", value: "rejected" },
];

const ADMIN_PAGE_SIZE = 10;

export default function AdminDashboardPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<RecipeStatus>("all");

  // Delete modal state
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Approve modal state
  const [recipeToApprove, setRecipeToApprove] = useState<Recipe | null>(null);
  const [isApproving, setIsApproving] = useState(false);

  // Reject modal state
  const [recipeToReject, setRecipeToReject] = useState<Recipe | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectError, setRejectError] = useState<string | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {

    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch recipes from admin API
  const loadRecipes = useCallback(async (search?: string, status: RecipeStatus = "all") => {
    setIsLoading(true);
    try {
      const res = await getAdminRecipes({
        limit: ADMIN_PAGE_SIZE,
        current_page: 1,
        search: search || undefined,
        status: status,
      });
      setRecipes(res.data || []);
      setPagination(res.pagination || null);
    } catch (err: any) {
      console.error("[AdminDashboard] Error loading recipes:", err);
      showToast(
        err instanceof ApiError
          ? err.message
          : "Không thể tải danh sách công thức. Vui lòng kiểm tra lại kết nối.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    try {
      const res = await getAdminRecipes({
        limit: ADMIN_PAGE_SIZE,
        current_page: nextPage,
        search: debouncedSearch || undefined,
        status: activeStatus,
      });
      setRecipes((prev) => [...prev, ...(res.data || [])]);
      setPagination(res.pagination || null);
    } catch (err: any) {
      console.error("[AdminDashboard] Error loading more recipes:", err);
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
    } catch (err: any) {
      console.error("[AdminDashboard] Error deleting recipe:", err);
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
    } catch (err: any) {
      console.error("[AdminDashboard] Error approving recipe:", err);
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
    } catch (err: any) {
      console.error("[AdminDashboard] Error rejecting recipe:", err);
      const msg =
        err instanceof ApiError
          ? err.message
          : "Đã xảy ra lỗi khi từ chối công thức. Vui lòng thử lại.";
      showToast(msg, "error");
    } finally {
      setIsRejecting(false);
    }
  };

  // Format date helper
  const formatDate = (dateInput: string | Date | undefined) => {
    if (!dateInput) return "Vừa tạo";
    try {
      const d = new Date(dateInput);
      return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "Không xác định";
    }
  };

  return (
    <main className="p-4 md:p-12 min-h-screen relative z-10 max-w-[1300px] mx-auto">
      {/* ── Toast Notification Banner ─────────────────────────────── */}
      <AdminToast toast={toast} onClose={() => setToast(null)} />

      {/* ── Header ────────────────────────────────────────────── */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="font-[var(--font-headline)] text-3xl md:text-4xl font-extrabold text-[#1b1c1a] tracking-tight mb-1">
            Chào mừng trở lại, Bếp Trưởng!
          </h2>
          <p className="text-base md:text-lg text-[#584140]">
            Dưới đây là tổng quan tình hình và danh sách món ăn trên hệ thống hôm nay.
          </p>
        </div>
        <Link
          href="/admin/recipes/create"
          className="bg-[#ff6b6b] text-white font-[var(--font-headline)] text-sm font-bold px-6 py-3 rounded-xl shadow-[0_2px_0_#ae2f34] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(255,107,107,0.3)] active:translate-y-0 transition-all duration-300 flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          Tạo Công Thức Mới
        </Link>
      </header>

      {/* ── Stats Bento Grid ──────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Stat Card 1: Total Recipes */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_10px_20px_rgba(255,107,107,0.04)] hover:shadow-[0_20px_40px_rgba(255,107,107,0.08)] hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group border border-[#efeeea]">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#f4f4f0] rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
          <div className="flex justify-between items-start mb-6 relative z-10">
            <span className="material-symbols-outlined text-[#ae2f34] text-[32px] p-3 bg-[#ff6b6b]/10 rounded-xl">
              menu_book
            </span>
            <span className="bg-[#00b083]/15 text-[#006c4f] font-[var(--font-headline)] text-xs font-bold px-3 py-1 rounded-full">
              {recipes.length} món hiển thị
            </span>
          </div>
          <div className="relative z-10">
            <h3 className="font-[var(--font-headline)] text-sm font-semibold text-[#584140] mb-1">
              Tổng Số Công Thức
            </h3>
            <p className="font-[var(--font-headline)] text-3xl md:text-4xl font-extrabold text-[#1b1c1a]">
              {isLoading ? "..." : pagination?.totalCount}
            </p>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_10px_20px_rgba(255,107,107,0.04)] hover:shadow-[0_20px_40px_rgba(255,107,107,0.08)] hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group border border-[#efeeea]">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#f4f4f0] rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
          <div className="flex justify-between items-start mb-6 relative z-10">
            <span className="material-symbols-outlined text-[#785a00] text-[32px] p-3 bg-[#ffd167]/20 rounded-xl">
              publish
            </span>
            <span className="bg-[#efeeea] text-[#1b1c1a] font-[var(--font-headline)] text-xs font-bold px-3 py-1 rounded-full">
              Đúng tiến độ
            </span>
          </div>
          <div className="relative z-10">
            <h3 className="font-[var(--font-headline)] text-sm font-semibold text-[#584140] mb-1">
              Đã Xuất Bản
            </h3>
            <p className="font-[var(--font-headline)] text-3xl md:text-4xl font-extrabold text-[#1b1c1a]">
              {isLoading ? "..." : pagination?.totalCount}
            </p>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_10px_20px_rgba(255,107,107,0.04)] hover:shadow-[0_20px_40px_rgba(255,107,107,0.08)] hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group border border-[#efeeea]">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#f4f4f0] rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
          <div className="flex justify-between items-start mb-6 relative z-10">
            <span className="material-symbols-outlined text-[#006c4f] text-[32px] p-3 bg-[#00b083]/15 rounded-xl">
              visibility
            </span>
            <span className="bg-[#ff6b6b]/15 text-[#ae2f34] font-[var(--font-headline)] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              100% Sẵn sàng
            </span>
          </div>
          <div className="relative z-10">
            <h3 className="font-[var(--font-headline)] text-sm font-semibold text-[#584140] mb-1">
              Hệ Thống API
            </h3>
            <p className="font-[var(--font-headline)] text-3xl md:text-4xl font-extrabold text-[#1b1c1a]">
              Trực Tuyến
            </p>
          </div>
        </div>
      </section>

      {/* ── Recent Recipes Section ────────────────────────────── */}
      <section className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <h3 className="font-[var(--font-headline)] text-2xl font-bold text-[#1b1c1a]">
                Danh Sách Công Thức
              </h3>
              <button
                type="button"
                onClick={() => loadRecipes(debouncedSearch, activeStatus)}
                disabled={isLoading}
                className="p-1.5 rounded-lg hover:bg-[#efeeea] text-[#584140] hover:text-[#ae2f34] transition-colors cursor-pointer disabled:opacity-50"
                title="Tải lại danh sách"
              >
                <span className={`material-symbols-outlined text-[20px] ${isLoading ? "animate-spin" : ""}`}>
                  refresh
                </span>
              </button>
            </div>

            {/* Status Filter Tabs */}
            <Tabs<RecipeStatus>
              tabs={ADMIN_STATUS_TABS}
              activeTab={activeStatus}
              onChange={setActiveStatus}
              variant="white"
              size="sm"
              ariaLabel="Lọc trạng thái công thức"
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Search Input Box */}
            <div className="relative flex-1 sm:w-72">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c706f] text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm công thức..."
                className="w-full pl-10 pr-9 py-2 rounded-xl bg-white border border-[#e3e2df] text-sm text-[#1b1c1a] placeholder:text-[#8c706f] focus:outline-none focus:border-[#ff6b6b] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c706f] hover:text-[#1b1c1a] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>

            <Link
              href="/"
              className="font-[var(--font-headline)] text-sm font-bold text-[#ae2f34] hover:text-[#ff6b6b] transition-colors flex items-center gap-1 flex-shrink-0"
            >
              <span className="hidden md:inline">Xem Trang Công Khai</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-[24px] border border-[#efeeea] shadow-[0_10px_30px_rgba(0,0,0,0.02)] overflow-hidden">
          {/* Header row (Desktop) */}
          <div className="hidden md:grid grid-cols-12 gap-4 p-5 bg-[#f4f4f0]/60 border-b border-[#e3e2df] font-[var(--font-headline)] text-xs font-bold text-[#584140] uppercase tracking-wider">
            <div className="col-span-6">Tên Công Thức & Thời Gian</div>
            <div className="col-span-3">Trạng Thái / Ngày Tạo</div>
            <div className="col-span-3 text-right">Thao Tác</div>
          </div>

          {/* List Content */}
          <div className="divide-y divide-[#efeeea]">
            {/* Loading Skeleton */}
            {isLoading && (
              <div className="p-8 space-y-4">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="animate-pulse flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#efeeea] rounded-xl flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-[#efeeea] rounded w-1/3" />
                      <div className="h-3 bg-[#efeeea] rounded w-1/4" />
                    </div>
                    <div className="h-8 bg-[#efeeea] rounded-lg w-20" />
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && recipes.length === 0 && (
              <AdminEmptyState
                searchQuery={debouncedSearch}
                onClearSearch={() => setSearchQuery("")}
              />
            )}

            {/* Actual Recipes List */}
            {!isLoading &&
              recipes.map((item) => (
                <AdminRecipeRow
                  key={item.id}
                  recipe={item}
                  onApprove={(r) => setRecipeToApprove(r)}
                  onReject={(r) => {
                    setRecipeToReject(r);
                    setRejectionReason(r.rejection_reason || "");
                    setRejectError(null);
                  }}
                  onDelete={(r) => setRecipeToDelete(r)}
                />
              ))}

            {/* Infinite Scroll Sentinel */}
            {!isLoading && recipes.length > 0 && (
              <InfiniteScrollSentinel
                sentinelRef={sentinelRef}
                isLoadingMore={isLoadingMore}
                loadingText="Đang tải thêm công thức..."
              />
            )}
          </div>
        </div>
      </section>

      {/* ── Action Modals ────────────────────────────────────────── */}
      <ApproveRecipeModal
        recipe={recipeToApprove}
        isLoading={isApproving}
        onClose={() => setRecipeToApprove(null)}
        onConfirm={handleConfirmApprove}
      />

      <RejectRecipeModal
        recipe={recipeToReject}
        reason={rejectionReason}
        error={rejectError}
        isLoading={isRejecting}
        onChangeReason={(val) => {
          setRejectionReason(val);
          if (rejectError) setRejectError(null);
        }}
        onClose={() => {
          setRecipeToReject(null);
          setRejectionReason("");
          setRejectError(null);
        }}
        onConfirm={handleConfirmReject}
      />

      <DeleteRecipeModal
        recipe={recipeToDelete}
        isLoading={isDeleting}
        onClose={() => setRecipeToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </main>
  );
}
