"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { recipeService, deleteRecipe } from "@/src/services/recipeApi";
import { Recipe, PaginationMeta } from "@/src/types/recipe";
import { ApiError } from "@/src/services/apiClient";

export default function AdminDashboardPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Delete modal state
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

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

  // Fetch recipes from backend API
  const loadRecipes = useCallback(async (search?: string) => {
    setIsLoading(true);
    try {
      const res = await recipeService.getAll({
        limit: 50,
        current_page: 1,
        search: search || undefined,
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

  // Initial load and on search change
  useEffect(() => {
    loadRecipes(debouncedSearch);
  }, [debouncedSearch, loadRecipes]);

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
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-floating flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 text-white ${
            toast.type === "error" ? "bg-[#ba1a1a]" : "bg-[#1b1c1a]"
          }`}
        >
          <span
            className={`material-symbols-outlined text-[22px] ${
              toast.type === "error" ? "text-white" : "text-[#06d6a0]"
            }`}
          >
            {toast.type === "error" ? "error" : "check_circle"}
          </span>
          <span className="font-[var(--font-headline)] text-sm font-bold">
            {toast.message}
          </span>
        </div>
      )}

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
              {isLoading ? "..." : recipes.length}
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
              {isLoading ? "..." : recipes.length}
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-4">
          <div className="flex items-center gap-3">
            <h3 className="font-[var(--font-headline)] text-2xl font-bold text-[#1b1c1a]">
              Danh Sách Công Thức
            </h3>
            <button
              type="button"
              onClick={() => loadRecipes(debouncedSearch)}
              disabled={isLoading}
              className="p-1.5 rounded-lg hover:bg-[#efeeea] text-[#584140] hover:text-[#ae2f34] transition-colors cursor-pointer disabled:opacity-50"
              title="Tải lại danh sách"
            >
              <span className={`material-symbols-outlined text-[20px] ${isLoading ? "animate-spin" : ""}`}>
                refresh
              </span>
            </button>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
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
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#ff6b6b]/10 flex items-center justify-center text-[#ae2f34] mb-3">
                  <span className="material-symbols-outlined text-[32px]">restaurant_menu</span>
                </div>
                <h4 className="font-[var(--font-headline)] font-bold text-lg text-[#1b1c1a] mb-1">
                  {debouncedSearch ? "Không tìm thấy công thức phù hợp" : "Chưa có công thức nào"}
                </h4>
                <p className="text-sm text-[#584140] max-w-md mb-6">
                  {debouncedSearch
                    ? `Không có kết quả nào khớp với từ khóa "${debouncedSearch}". Hãy thử tìm kiếm từ khóa khác.`
                    : "Bắt đầu thêm công thức món ăn mới để quản lý và chia sẻ trên hệ thống GourmetPop."}
                </p>
                {debouncedSearch ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="px-4 py-2 rounded-xl bg-[#efeeea] text-[#1b1c1a] font-[var(--font-headline)] text-xs font-bold hover:bg-[#e3e2df] transition-colors cursor-pointer"
                  >
                    Xóa Bộ Lọc Tìm Kiếm
                  </button>
                ) : (
                  <Link
                    href="/admin/recipes/create"
                    className="px-5 py-2.5 rounded-xl bg-[#ff6b6b] text-white font-[var(--font-headline)] text-xs font-bold hover:bg-[#e05656] shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Tạo Công Thức Đầu Tiên
                  </Link>
                )}
              </div>
            )}

            {/* Actual Recipes List */}
            {!isLoading &&
              recipes.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 p-4 md:p-5 hover:bg-[#faf9f5] transition-colors items-center group"
                >
                  {/* Title & Image & Cooking Info */}
                  <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#e9e8e4] flex-shrink-0 overflow-hidden flex items-center justify-center border border-[#e0bfbd]/40 relative group-hover:shadow-sm transition-shadow">
                      {item.image_url ? (
                        <img
                          alt={item.title}
                          className="w-full h-full object-cover"
                          src={item.image_url}
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <span className="material-symbols-outlined text-[#8c706f]">image</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-[var(--font-headline)] text-sm font-bold text-[#1b1c1a] truncate group-hover:text-[#ae2f34] transition-colors">
                          {item.title}
                        </p>
                        <span className="hidden sm:inline-block text-[11px] font-mono text-[#8c706f] bg-[#efeeea] px-1.5 py-0.5 rounded">
                          #{item.id}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-[#8c706f]">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">timer</span>
                          {item.prep_time_minutes + item.cook_time_minutes} phút
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">group</span>
                          {item.servings} phần
                        </span>
                        <span className="font-mono text-[11px] text-[#8c706f]/80 truncate max-w-[140px]">
                          /{item.slug}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Date */}
                  <div className="col-span-1 md:col-span-3 flex flex-wrap md:flex-col items-start gap-1.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#00b083]/15 text-[#006c4f] font-[var(--font-headline)] text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-[#006c4f]" />
                      Đã xuất bản
                    </span>
                    <span className="text-xs text-[#8c706f]">
                      Ngày tạo: {formatDate(item.created_at)}
                    </span>
                  </div>

                  {/* Quick Actions */}
                  <div className="col-span-1 md:col-span-3 flex items-center justify-between md:justify-end gap-2 text-sm text-[#584140]">
                    <div className="flex items-center gap-1">
                      {/* View button */}
                      <Link
                        href={`/recipes/${item.slug || item.id}`}
                        className="p-2 rounded-xl hover:bg-[#efeeea] text-[#584140] hover:text-[#006c4f] transition-all cursor-pointer"
                        title="Xem trang công thức"
                      >
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                      </Link>

                      {/* Edit button */}
                      <Link
                        href={`/admin/recipes/${item.id}/edit`}
                        className="p-2 rounded-xl hover:bg-[#efeeea] text-[#584140] hover:text-[#ae2f34] transition-all cursor-pointer"
                        title="Chỉnh sửa công thức"
                      >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </Link>

                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => setRecipeToDelete(item)}
                        className="p-2 rounded-xl hover:bg-[#ffdad6] text-[#584140] hover:text-[#ba1a1a] transition-all cursor-pointer"
                        title="Xóa công thức"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ── Delete Confirmation Modal ─────────────────────────────── */}
      {recipeToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] max-w-md w-full p-6 md:p-8 shadow-2xl border border-[#efeeea] animate-in zoom-in-95 duration-200 relative">
            <div className="w-14 h-14 rounded-2xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center mb-5 mx-auto">
              <span className="material-symbols-outlined text-[32px]">delete_forever</span>
            </div>

            <h3 className="font-[var(--font-headline)] text-2xl font-extrabold text-[#1b1c1a] text-center mb-2">
              Xác Nhận Xóa Công Thức?
            </h3>

            <p className="text-sm text-[#584140] text-center mb-6 leading-relaxed">
              Bạn có chắc chắn muốn xóa công thức món ăn này? Thao tác này sẽ xóa vĩnh viễn
              dữ liệu bao gồm các nguyên liệu và các bước hướng dẫn liên quan.
            </p>

            {/* Target Recipe Preview Card */}
            <div className="p-3.5 rounded-2xl bg-[#faf9f5] border border-[#efeeea] flex items-center gap-3.5 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#e9e8e4] overflow-hidden flex-shrink-0 flex items-center justify-center">
                {recipeToDelete.image_url ? (
                  <img
                    src={recipeToDelete.image_url}
                    alt={recipeToDelete.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="material-symbols-outlined text-[#8c706f]">image</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-[var(--font-headline)] text-sm font-bold text-[#1b1c1a] truncate">
                  {recipeToDelete.title}
                </p>
                <p className="text-xs text-[#8c706f] truncate">
                  ID: #{recipeToDelete.id} · /{recipeToDelete.slug}
                </p>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRecipeToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-xl bg-[#efeeea] text-[#584140] font-[var(--font-headline)] text-sm font-bold hover:bg-[#e3e2df] transition-colors cursor-pointer disabled:opacity-50"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-xl bg-[#ba1a1a] text-white font-[var(--font-headline)] text-sm font-bold hover:bg-[#93000a] transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-[0_2px_0_#410006] disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[18px]">
                      progress_activity
                    </span>
                    Đang Xóa...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                    Xóa Vĩnh Viễn
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
