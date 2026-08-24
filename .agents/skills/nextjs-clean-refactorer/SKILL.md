---
name: nextjs-clean-refactorer
description: >-
  Standard operating procedure for refactoring Next.js (App Router), React, and TypeScript code.
  Enforces strict separation of concerns via Custom Hooks, presentational components, and URL-driven state.
  Focuses on making code clean, testable, and maximally reusable without changing behavior.
---

# Next.js Clean Refactorer Skill

Bộ quy chuẩn và phương pháp luận chuyên nghiệp để **tái cấu trúc (Refactor)** code Frontend Next.js App Router + React + TypeScript, đảm bảo code gọn gàng, dễ hiểu, dễ bảo trì và tái sử dụng tối đa mà **không thay đổi hành vi (behavior)** của ứng dụng.

---

## 1. Triết Lý Cốt Lõi: Separation of Concerns (SoC)

> **Nguyên tắc vàng**: "Mỗi file chỉ làm một việc duy nhất. Logic ở hooks, giao diện ở components, điều phối ở page."
>
> - **Custom Hooks** (`src/hooks/use[Feature].ts`): Chứa toàn bộ **logic nghiệp vụ** (state, fetch, handlers, side effects). Không chứa bất kỳ JSX nào.
> - **Presentational Components** (`app/components/[Component].tsx`): Chỉ chịu trách nhiệm **render UI** từ props nhận vào. Không fetch data, không quản lý state phức tạp.
> - **Page / Orchestrator** (`app/.../page.tsx`): Chỉ gọi hooks, truyền props xuống components. Dưới 100 dòng là lý tưởng, tối đa 200 dòng.

---

## 2. Khi Nào Cần Refactor?

Bắt buộc refactor khi phát hiện bất kỳ dấu hiệu nào sau đây:

| Dấu Hiệu (Code Smell)                                          | Hành Động Refactor                                                     |
| :-------------------------------------------------------------- | :--------------------------------------------------------------------- |
| Component > 200 dòng có cả logic lẫn JSX                       | Tách logic ra Custom Hook, JSX ra Presentational Component             |
| Có > 5 `useState` trong 1 component                            | Gom vào Custom Hook hoặc dùng `useReducer`                            |
| Logic fetch + handler + state lặp lại ở nhiều nơi              | Tạo Generic Custom Hook tái sử dụng                                   |
| `useEffect` + `useCallback` + `useRef` chiếm > 50% file        | Tách toàn bộ vào Custom Hook                                          |
| Inline JSX lặp lại (search bar, filter bar, empty state...)    | Tách thành Presentational Component riêng                              |
| URL search params logic nằm trộn lẫn render logic              | Tách thành hook `useUrlParams()` hoặc `use[Feature]Listing()`         |

---

## 3. Quy Trình Refactor 5 Bước (SOP)

### Bước 1: Xác định ranh giới Logic vs UI

Đọc kỹ file cần refactor và phân loại từng đoạn code:

- **Logic (L)**: `useState`, `useEffect`, `useCallback`, `useRef`, fetch API, event handlers, URL sync, debounce
- **UI (U)**: JSX/TSX return, className, conditional rendering, map render list

### Bước 2: Trích xuất Custom Hook

Tạo file `src/hooks/use[Feature].ts` chứa toàn bộ phần Logic:

```typescript
// src/hooks/useRecipeListing.ts
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function useRecipeListing() {
  // 1. URL params extraction
  // 2. State declarations
  // 3. Side effects (useEffect)
  // 4. Event handlers (useCallback)
  // 5. Computed/derived values

  return {
    // State values (read-only cho component)
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

    // Refs (truyền xuống component cần attach DOM)
    gridSectionRef,

    // Event handlers (truyền xuống component làm props)
    handleSearchChange,
    handleClearSearch,
    handleCategoryChange,
    handleSortChange,
    handlePageChange,
    handleResetAllFilters,
    handleRetry,
  };
}
```

**Quy tắc đặt tên return object:**
- **State**: Dùng danh từ mô tả (`recipes`, `isLoading`, `error`)
- **Handlers**: Dùng tiền tố `handle` + Verb (`handleSearchChange`, `handlePageChange`)
- **Refs**: Dùng hậu tố `Ref` (`gridSectionRef`, `sentinelRef`)

### Bước 3: Tách Presentational Components

Với mỗi khối JSX có thể tái sử dụng, tạo component riêng:

```text
# Trước refactor (1 file nguyên khối)
RecipeListing.tsx (400+ dòng)
  ├── Search bar JSX (30 dòng)
  ├── Category filter JSX (20 dòng)  
  ├── Sort select JSX (15 dòng)
  ├── Error state JSX (15 dòng)
  ├── Loading skeleton JSX (10 dòng)
  ├── Empty state JSX (20 dòng)
  ├── Recipe grid JSX (20 dòng)
  └── Pagination JSX (10 dòng)

# Sau refactor (nhiều file nhỏ, đơn nhiệm)
src/hooks/useRecipeListing.ts          ← Logic hook
app/components/RecipeSearchBar.tsx      ← Search bar UI
app/components/CategorySelect.tsx       ← Category dropdown UI  
app/components/RecipeSortSelect.tsx     ← Sort dropdown UI
app/components/RecipeCard.tsx           ← Card item UI
app/components/RecipeSkeletonCard.tsx   ← Skeleton UI
app/components/Pagination.tsx           ← Pagination UI
app/components/RecipeListing.tsx        ← Orchestrator (< 100 dòng)
```

### Bước 4: Viết Orchestrator Component tinh gọn

Component chính chỉ còn:
1. Gọi Custom Hook
2. Destructure return values
3. Ráp nối Presentational Components với props

```tsx
// app/components/RecipeListing.tsx (< 100 dòng)
"use client";

import { useRecipeListing } from "@/src/hooks/useRecipeListing";
import RecipeSearchBar from "./RecipeSearchBar";
import RecipeCard from "./RecipeCard";
import RecipeSkeletonCard from "./RecipeSkeletonCard";
import RecipeSortSelect from "./RecipeSortSelect";
import CategorySelect from "./CategorySelect";
import Pagination from "./Pagination";

export default function RecipeListing() {
  const {
    recipes, categories, pagination,
    currentPage, searchInput, currentCategory, currentSortOption,
    isLoading, error, hasActiveFilters, gridSectionRef,
    handleSearchChange, handleClearSearch, handleCategoryChange,
    handleSortChange, handlePageChange, handleResetAllFilters, handleRetry,
  } = useRecipeListing();

  return (
    <>
      <RecipeSearchBar value={searchInput} onChange={handleSearchChange} onClear={handleClearSearch} />

      {error && <ErrorBanner error={error} onRetry={handleRetry} />}

      <div ref={gridSectionRef}>
        <Toolbar ... />
        {isLoading ? <SkeletonGrid /> : <RecipeGrid recipes={recipes} />}
        <Pagination ... />
      </div>
    </>
  );
}
```

### Bước 5: Xác nhận hành vi không thay đổi

- Chạy `npm run build` trong `/web` để đảm bảo TypeScript compile thành công 100%.
- Kiểm tra trực quan trên trình duyệt: Search, Sort, Category filter, Pagination, URL sync, Back/Forward đều hoạt động giống hệt trước refactor.
- Đảm bảo không có `console.error`, `console.warn` mới xuất hiện.

---

## 4. Quy Tắc Thiết Kế Custom Hooks Tái Sử Dụng

### 4.1. Cấu trúc file hook chuẩn

```text
src/hooks/
├── use[Feature]Listing.ts      # Hook quản lý danh sách + pagination + search + filter
├── use[Feature]Management.ts   # Hook quản lý CRUD + modals + toast
├── useUrlParams.ts             # Hook tái sử dụng cho URL searchParams sync
├── useDebounce.ts              # Hook tái sử dụng cho debounce giá trị
└── useToast.ts                 # Hook tái sử dụng cho toast notification
```

### 4.2. Generic Hooks (Tái sử dụng cao)

Khi phát hiện pattern lặp lại ở 2+ features, trích xuất thành Generic Hook:

```typescript
// src/hooks/useDebounce.ts — Dùng được ở mọi nơi cần debounce
export function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}
```

```typescript
// src/hooks/useToast.ts — Dùng chung cho cả Admin và Public
export function useToast(durationMs: number = TOAST_DURATION_MS) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ message, type });
    timerRef.current = setTimeout(() => setToast(null), durationMs);
  }, [durationMs]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, []);

  return { toast, setToast, showToast };
}
```

### 4.3. Feature-Specific Hooks

Mỗi trang có logic phức tạp nên có 1 hook riêng:

| Trang              | Hook                              | Trách nhiệm                                                |
| :------------------ | :-------------------------------- | :--------------------------------------------------------- |
| Home (Recipe List) | `useRecipeListing()`              | URL sync, fetch, search debounce, sort, category, paginate |
| Admin Recipes      | `useAdminRecipesManagement()`     | CRUD, modals, toast, status update, infinite scroll         |
| Admin Categories   | `useAdminCategoriesManagement()`  | CRUD, modals, toast                                        |

---

## 5. Quy Tắc Props Interface Cho Presentational Components

Mỗi Presentational Component phải có **interface props được định nghĩa tường minh**:

```typescript
// ✅ ĐÚNG: Props interface rõ ràng, đơn nhiệm
export interface RecipeSearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function RecipeSearchBar({
  value,
  onChange,
  onClear,
  placeholder = "Tìm kiếm công thức món ăn...",
  disabled = false,
}: RecipeSearchBarProps) {
  // Chỉ render UI, KHÔNG có useState/useEffect
  return ( ... );
}
```

```typescript
// ❌ SAI: Component nhận quá nhiều props không liên quan
export interface BadComponentProps {
  recipes: Recipe[];
  isLoading: boolean;
  searchQuery: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  categories: Category[];
  onCategoryChange: (val: string) => void;
  sortOption: RecipeSortOption;
  onSortChange: (opt: RecipeSortOption) => void;
  // ... quá nhiều trách nhiệm trong 1 component
}
```

---

## 6. Checklist Tự Kiểm Tra Sau Khi Refactor

Mỗi lần refactor, AI phải tự rà soát:

- [ ] Logic đã được tách hoàn toàn ra Custom Hook chưa? (Component không còn `useCallback`, `useRef` cho logic nghiệp vụ)
- [ ] Component chính (Orchestrator) có dưới 150 dòng không?
- [ ] Mỗi Presentational Component có props interface tường minh không?
- [ ] Có hook nào đang lặp pattern giống nhau ở 2+ nơi mà chưa được trích xuất thành Generic Hook không?
- [ ] Hành vi ứng dụng có thay đổi sau refactor không? (URL sync, search, pagination, back/forward)
- [ ] Đã chạy `npm run build` trong `/web` thành công 100% không?
- [ ] Không có `any` type mới xuất hiện?
