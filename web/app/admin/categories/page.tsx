"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Category } from "@/src/types/recipe";
import {
  categoryService,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/src/services/categoryApi";
import { ApiError } from "@/src/services/apiClient";
import AdminPageHeader from "../components/AdminPageHeader";
import AdminSearchBar from "../components/AdminSearchBar";
import AdminToast, { ToastState } from "../components/AdminToast";
import AdminEmptyState from "../components/AdminEmptyState";
import CategoryTableRow from "./components/CategoryTableRow";
import CategoryTableSkeleton from "./components/CategoryTableSkeleton";
import CategoryModal from "./components/CategoryModal";
import DeleteCategoryModal from "./components/DeleteCategoryModal";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  // Form loading & error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch categories from backend
  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err: any) {
      console.error("[AdminCategories] Error fetching categories:", err);
      showToast(
        err instanceof ApiError
          ? err.message
          : "Không thể tải danh sách danh mục. Vui lòng kiểm tra lại kết nối.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const query = searchQuery.toLowerCase().trim();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.slug.toLowerCase().includes(query) ||
        c.id.toString().includes(query)
    );
  }, [categories, searchQuery]);

  // Handle Create Category
  const handleCreateCategory = async (data: { name: string; slug: string }) => {
    setIsSubmitting(true);
    setModalError(null);
    try {
      const newCategory = await createCategory(data);
      setCategories((prev) => [...prev, newCategory]);
      setIsCreateModalOpen(false);
      showToast(`Đã thêm danh mục "${newCategory.name}" thành công!`);
    } catch (err: any) {
      console.error("[AdminCategories] Create error:", err);
      setModalError(
        err instanceof ApiError
          ? err.message
          : "Không thể tạo danh mục. Vui lòng thử lại sau."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Update Category
  const handleUpdateCategory = async (data: { name: string; slug: string }) => {
    if (!editingCategory) return;
    setIsSubmitting(true);
    setModalError(null);
    try {
      const updated = await updateCategory(editingCategory.id, data);
      setCategories((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
      setEditingCategory(null);
      showToast(`Đã cập nhật danh mục "${updated.name}" thành công!`);
    } catch (err: any) {
      console.error("[AdminCategories] Update error:", err);
      setModalError(
        err instanceof ApiError
          ? err.message
          : "Không thể cập nhật danh mục. Vui lòng thử lại sau."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Category
  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;
    setIsDeleting(true);
    try {
      await deleteCategory(deletingCategory.id);
      setCategories((prev) => prev.filter((c) => c.id !== deletingCategory.id));
      const deletedName = deletingCategory.name;
      setDeletingCategory(null);
      showToast(`Đã xóa danh mục "${deletedName}" thành công!`);
    } catch (err: any) {
      console.error("[AdminCategories] Delete error:", err);
      showToast(
        err instanceof ApiError
          ? err.message
          : "Không thể xóa danh mục. Vui lòng thử lại sau.",
        "error"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Toast Notification */}
      <AdminToast toast={toast} onClose={() => setToast(null)} />

      {/* Header Section */}
      <AdminPageHeader
        breadcrumbs={[
          { label: "Trang Quản Trị", href: "/admin" },
          { label: "Danh Mục" },
        ]}
        title="Quản Lý Danh Mục"
        subtitle="Thêm mới, tìm kiếm, chỉnh sửa và quản lý các danh mục phân loại ẩm thực trên hệ thống."
      >
        <button
          type="button"
          onClick={() => {
            setModalError(null);
            setIsCreateModalOpen(true);
          }}
          className="bg-[#ff6b6b] text-white font-[var(--font-headline)] text-sm font-bold px-5 py-3 rounded-2xl shadow-[0_2px_0_#ae2f34] hover:shadow-[0_4px_0_#ae2f34] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Thêm Danh Mục
        </button>
      </AdminPageHeader>

      {/* Search & Stats Bar */}
      <AdminSearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Tìm kiếm danh mục theo tên, slug, ID..."
        count={filteredCategories.length}
        totalCount={categories.length}
        unitLabel="danh mục"
      />

      {/* Categories Content */}
      {isLoading ? (
        <CategoryTableSkeleton rowCount={5} />
      ) : filteredCategories.length === 0 ? (
        <AdminEmptyState
          icon="category"
          title="Không tìm thấy danh mục nào"
          description={
            searchQuery
              ? `Không có danh mục nào khớp với từ khóa "${searchQuery}". Vui lòng thử từ khóa khác.`
              : "Hệ thống chưa có danh mục nào. Hãy tạo danh mục đầu tiên ngay bây giờ!"
          }
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery("")}
          actionText="Tạo Danh Mục Mới"
          onActionClick={() => {
            setModalError(null);
            setIsCreateModalOpen(true);
          }}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-[#efeeea] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#efeeea] bg-[#faf9f5]/80 text-[#8c706f] text-xs font-bold uppercase tracking-wider font-[var(--font-headline)]">
                  <th className="py-4 px-6 w-20">ID</th>
                  <th className="py-4 px-6">Tên Danh Mục</th>
                  <th className="py-4 px-6">Slug (URL)</th>
                  <th className="py-4 px-6 text-right w-40">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#efeeea] text-sm">
                {filteredCategories.map((category) => (
                  <CategoryTableRow
                    key={category.id}
                    category={category}
                    onEdit={(cat) => {
                      setModalError(null);
                      setEditingCategory(cat);
                    }}
                    onDelete={(cat) => setDeletingCategory(cat)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <CategoryModal
        isOpen={isCreateModalOpen}
        category={null}
        isLoading={isSubmitting}
        error={modalError}
        onClose={() => {
          setIsCreateModalOpen(false);
          setModalError(null);
        }}
        onSubmit={handleCreateCategory}
      />

      {/* Edit Modal */}
      <CategoryModal
        isOpen={!!editingCategory}
        category={editingCategory}
        isLoading={isSubmitting}
        error={modalError}
        onClose={() => {
          setEditingCategory(null);
          setModalError(null);
        }}
        onSubmit={handleUpdateCategory}
      />

      {/* Delete Confirmation Modal */}
      <DeleteCategoryModal
        category={deletingCategory}
        isLoading={isDeleting}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDeleteCategory}
      />
    </div>
  );
}
