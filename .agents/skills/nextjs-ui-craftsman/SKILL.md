---
name: nextjs-ui-craftsman
description: >-
  Standard operating procedure and architectural best practices for generating Next.js (App Router),
  React, and Tailwind CSS UI code. Enforces automatic component decomposition, common component extraction,
  strict TypeScript typing, responsive design tokens, and modular code architecture to avoid post-generation refactoring.
---

# Next.js UI Craftsman Skill & Best Practices

Bộ quy chuẩn và phương pháp luận chuyên nghiệp giúp AI tạo code Frontend (Next.js App Router, React, Tailwind CSS, TypeScript) chuẩn chỉ ngay từ lần sinh mã đầu tiên, tuyệt đối không tạo file nguyên khối (monolithic) và không cần refactor lại.

---

## 1. Triết Lý Cốt Lõi: Zero-Refactor Architecture

> **Nguyên tắc vàng**: "Hãy viết code như một Senior Frontend Architect đã review kỹ càng."
> - **Tuyệt đối KHÔNG viết file Page vượt quá 200 dòng** chứa toàn bộ JSX inline, Modal inline, Row inline, Toast inline.
> - **Bắt buộc phân rã Component (Decomposition)** thành các module nhỏ, độc lập, đơn nhiệm (Single Responsibility Principle) ngay trong lượt code đầu tiên.

---

## 2. Cấu Trúc Thư Mục & Phân Cấp Component

Mỗi tính năng mới trong `web/app/` phải tuân theo cấu trúc phân tầng rõ ràng:

```text
web/app/
├── components/                          # 1. Global Common Components (Toàn hệ thống)
│   ├── Toast.tsx                        # Thông báo toàn cục
│   ├── Tabs.tsx                         # Bộ chuyển tab tái sử dụng
│   ├── RecipeCard.tsx                   # Card công thức
│   └── RecipeSkeletonCard.tsx           # Skeleton loading chung
│
├── admin/
│   ├── components/                      # 2. Domain Shared Components (Dùng chung cho Admin)
│   │   ├── AdminSidebar.tsx             # Menu điều hướng admin
│   │   ├── AdminPageHeader.tsx          # Header trang chuẩn (Breadcrumbs + Title + Action)
│   │   ├── AdminSearchBar.tsx           # Thanh tìm kiếm + Stats counter
│   │   ├── AdminEmptyState.tsx          # Trạng thái rỗng tùy biến
│   │   └── AdminToast.tsx               # Banner thông báo admin
│   │
│   └── [feature]/                       # 3. Feature Directory (VD: categories, recipes)
│       ├── components/                  # Subcomponents riêng của feature
│       │   ├── [Feature]Modal.tsx       # Modal Thêm / Sửa
│       │   ├── Delete[Feature]Modal.tsx # Modal Xác nhận xóa
│       │   ├── [Feature]TableRow.tsx    # Từng dòng hiển thị trong bảng
│       │   └── [Feature]Skeleton.tsx    # Skeleton loading riêng của bảng/grid
│       └── page.tsx                     # 4. Page Orchestrator (< 200 dòng, chỉ điều phối state)
```

---

## 3. Quy Chuẩn Bắt Buộc Khi Gen Mã Giao Diện Mới

Khi tạo một trang (Page) quản lý hoặc giao diện mới, AI **BẮT BUỘC** thực hiện theo thứ tự sau:

### Bước 1: Khai báo Service & Type trước
- Cập nhật Type trong `web/src/types/`.
- Cập nhật Service API trong `web/src/services/` với đủ xử lý lỗi `ApiError`, async/await.

### Bước 2: Tách Subcomponents trước khi viết `page.tsx`
Luôn tạo các file thành phần con trước:
1. **Modal Form (`[Feature]Modal.tsx`)**:
   - Nhận `isOpen`, `data` (null khi tạo mới, object khi sửa), `isLoading`, `error`, `onClose`, `onSubmit`.
   - Tự động validate form và hiển thị cảnh báo lỗi rõ ràng.
2. **Delete Modal (`Delete[Feature]Modal.tsx`)**:
   - Nhận object cần xóa, cảnh báo rủi ro, nút Hủy và nút Xác nhận xóa có hiệu ứng loading.
3. **Table Row / Card Item (`[Feature]TableRow.tsx` / `[Feature]Card.tsx`)**:
   - Hiển thị thông tin từng bản ghi gọn gàng, nút Sửa / Xóa với tooltip và cursor pointer.
4. **Skeleton Loading (`[Feature]Skeleton.tsx`)**:
   - Dùng animation `animate-pulse` mô phỏng chính xác cấu trúc dữ liệu đang tải.

### Bước 3: Viết Orchestrator `page.tsx` tinh gọn
File `page.tsx` chỉ đóng vai trò nhạc trưởng (Orchestrator):
- Quản lý state dữ liệu (`items`, `isLoading`, `searchQuery`).
- Quản lý state modal (`isCreateOpen`, `editingItem`, `deletingItem`).
- Ráp nối các common components:
  - `<AdminToast toast={toast} onClose={...} />`
  - `<AdminPageHeader title="..." subtitle="..." breadcrumbs={[...]}>{actionButton}</AdminPageHeader>`
  - `<AdminSearchBar value={searchQuery} onChange={setSearchQuery} count={...} />`
  - Render danh sách qua map `<[Feature]TableRow />`
  - `<AdminEmptyState ... />` khi không có dữ liệu.
  - Các Modals điều khiển ở cuối file.

---

## 4. Bảng Quy Chuẩn Thiết Kế & UI Tokens (Bếp Phương)

Tuân thủ nghiêm ngặt hệ thống Design System đã thiết lập:

| Thành Phần | Giá Trị Màu / Class Chuẩn | Ứng Dụng |
| :--- | :--- | :--- |
| **Primary Brand** | `#ff6b6b` (Hover: `#ae2f34`) | Nút CTA chính, icon nổi bật, border focus |
| **Dark Red/Text** | `#ae2f34` / `#584140` / `#1b1c1a` | Logo, tiêu đề chính, text body, nhãn form |
| **Muted Text** | `#8c706f` | Subtitle, placeholder, timestamp, ID code |
| **Backgrounds** | `#faf9f5` (Main) / `#f4f4f0` (Bar/Card) | Nền tổng thể, thanh filter, sidebar |
| **Card / Modal** | `bg-white border-[#efeeea] rounded-3xl` | Card danh sách, container bảng, modal popup |
| **Danger State** | `bg-[#ba1a1a]` (Hover: `#93000a`, Tint: `#ffdad6`)| Nút xóa vĩnh viễn, alert lỗi |
| **Success State** | `text-[#006c4f] bg-[#00b083]/15` | Badge đã duyệt, toast thành công |
| **Font Family** | `font-[var(--font-headline)]` | Tiêu đề H1-H4, nhãn button, text in đậm |
| **Icon Set** | `material-symbols-outlined` | Sử dụng icon đồng nhất từ Google Symbols |

---

## 5. Kỹ Thuật React & Next.js Tối Ưu

1. **Client Component Directive**: Chỉ đặt `"use client"` ở đầu các component có `useState`, `useEffect`, hoặc tương tác sự kiện `onClick`, `onChange`.
2. **Debounce Search Input**: Khi có ô tìm kiếm, luôn áp dụng debounce 300ms - 400ms để tránh trigger API hoặc re-filter liên tục.
3. **Memoization**: Sử dụng `useMemo` cho dữ liệu lọc danh sách (`filteredItems`) và `useCallback` cho các hàm fetch data.
4. **Interactive States**:
   - Mọi nút bấm (button) phải có `cursor-pointer`, `disabled:opacity-50`, hiệu ứng `hover:` và `active:`.
   - Form inputs phải có `focus:outline-none focus:border-[#ff6b6b] focus:ring-2 focus:ring-[#ff6b6b]/20`.
5. **Accessibility & Responsive**:
   - Luôn hỗ trợ hiển thị đẹp trên cả Mobile (ngăn xếp dọc `flex-col`, menu ẩn) và Desktop (`md:flex-row`, sidebar cố định).
   - Đặt `aria-label` cho các nút chỉ có icon (close, edit, delete).

---

## 6. Checklist Tự Kiểm Tra Trước Khi Trả Lời (Self-Verification Checklist)

Mỗi lần sinh mã UI mới, AI phải tự rà soát:
- [ ] Đã tách file Modal, Row/Card, Skeleton thành components riêng chưa?
- [ ] File `page.tsx` có ngắn gọn (< 200 dòng) và dễ đọc không?
- [ ] Đã tái sử dụng các common components (`AdminPageHeader`, `AdminSearchBar`, `AdminToast`, `AdminEmptyState`) chưa?
- [ ] Có bị lỗi `any` hay thiếu props interface không?
- [ ] Đã chạy `npm run build` trong thư mục `/web` để đảm bảo Next.js compile thành công 100% không?
