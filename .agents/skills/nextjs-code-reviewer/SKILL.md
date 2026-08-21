---
name: nextjs-code-reviewer
description: >-
  Standard operating procedure and architectural benchmark for conducting comprehensive code reviews on Next.js (App Router), React, and TypeScript code. Use this skill whenever reviewing components, pages, hooks, or features to identify issues and optimization opportunities categorized into clear priority levels (P0 Critical, P1 SEO & SSR, P2 Performance, P3 Clean Code).
---

# Next.js Code Reviewer Skill

Quy trình chuẩn hóa và bộ tiêu chí đánh giá (Best Practices) để kiểm tra, đánh giá (Review) và đề xuất tối ưu hóa cho các file code Next.js (App Router), React và TypeScript.

---

## 🎯 Phân Loại Thứ Tự Ưu Tiên (Priority Levels)

Khi thực hiện Code Review, mọi vấn đề và đề xuất tối ưu MUST được phân loại rõ ràng theo 4 mức độ ưu tiên từ cao đến thấp:

```text
🚨 P0: Critical (Lỗi nghiêm trọng, Crash, Hydration, Security, Memory Leak)
   └── ⚠️ P1: High (SEO, SSR Architecture, Core Web Vitals, Rendering Boundary)
       └── ⚡ P2: Medium (Performance, Re-render, State Management, Code Structure)
           └── 💡 P3: Low (Clean Code, TypeScript Strictness, Naming & DX)
```

---

## 🔍 Bộ Tiêu Chí Review Theo Mức Độ Ưu Tiên

### 🚨 P0 - Critical (Lỗi Nghiêm Trọng - Cần Sửa Ngay)

1. **Hydration Mismatch**:
   - Sử dụng các giá trị bất định (`Math.random()`, `Date.now()`, `new Date()`) trực tiếp trong quá trình render server/client làm lệch HTML.
   - Thao tác trực tiếp với `window`, `document`, `localStorage` trong render body mà không bọc trong `useEffect` hoặc kiểm tra điều kiện an toàn.
   - Cấu trúc HTML không hợp lệ gây vỡ cây DOM (ví dụ: `<p>` lồng trong `<p>`, `<div>` lồng trong `<p>`).

2. **Memory Leaks & Unhandled Async**:
   - `useEffect` có thiết lập Event Listener, `setInterval`, `setTimeout` nhưng **thiếu hàm cleanup**.
   - Promises/Async calls không được xử lý lỗi (`try...catch`), dẫn đến Unhandled Rejection gây treo app.

3. **Bảo Mật & Đột Biến State Trực Tiếp**:
   - Sử dụng `dangerouslySetInnerHTML` với dữ liệu đầu vào chưa được làm sạch (Sanitize) nguy cơ XSS.
   - Mutate trực tiếp props hoặc state (ví dụ: `recipes.push(newItem)` thay vì `setRecipes([...recipes, newItem])`).

---

### ⚠️ P1 - High (SEO, Kiến Trúc SSR & Core Web Vitals)

1. **Ranh Giới Server vs Client Component**:
   - Đặt `"use client"` tràn lan ở trang gốc (`page.tsx`) thay vì tách nhỏ Client Component xuống lá cây UI.
   - Fetch dữ liệu hoàn toàn ở phía Client (`useEffect`) làm cho Googlebot cào trang HTML chỉ thấy Skeleton/Trắng.

2. **SEO & Structured Data (Schema.org)**:
   - Thiếu Metadata (`title`, `description`, `canonical`, `openGraph`, `twitter`).
   - Thiếu dữ liệu cấu trúc Schema.org (như `Recipe`, `ItemList`, `BreadcrumbList` dạng JSON-LD).
   - Thẻ `<h1>` không duy nhất hoặc cấu trúc thẻ tiêu đề (`<h1>` -> `<h2>` -> `<h3>`) bị nhảy cấp.

3. **Crawlable Links & Semantic HTML**:
   - Sử dụng `onClick` chuyển hướng JS (`router.push`) thay vì thẻ `<Link href="...">` có thuộc tính `href` thực sự cho Googlebot theo vết.
   - Thiếu các thẻ HTML5 Semantic: `<main>`, `<article>`, `<section>`, `<nav>`, `<ul>`, `<li>`.

4. **Tối Ưu Ảnh & Tránh Giật Khung Hình (CLS)**:
   - Thẻ `<img>` thường thiếu thuộc tính `alt` chi tiết, thiếu `width`/`height` hoặc không dùng `next/image` làm tăng chỉ số CLS (Cumulative Layout Shift).

---

### ⚡ P2 - Medium (Hiệu Năng & Quản Lý State)

1. **Re-render Thừa & Tối Ưu Bộ Nhớ**:
   - Lưu trữ state dẫn xuất (Derived State) vào `useState` thay vì tính toán trực tiếp trong hàm hoặc bọc `useMemo`.
   - Tạo hàm inline handler truyền xuống component con mà không dùng `useCallback` (nếu component con được bọc `React.memo`).
   - Re-fetch dữ liệu client không cần thiết ngay khi vừa mount mặc dù đã có SSR data.

2. **Monolithic Component (> 200 lines)**:
   - Viết component quá dài, ôm xôm nhiều trách nhiệm thay vì tách nhỏ theo quy tắc **Zero-Refactor UI** (`components/` subfolder).

3. **Fetch Waterfall**:
   - Sử dụng `await` tuần tự nhiều API độc lập trong Server Component thay vì gộp lại với `Promise.all()`.

---

### 💡 P3 - Low (Clean Code, TypeScript & Trải Nghiệm Developer)

1. **TypeScript Strictness**:
   - Sử dụng kiểu `any`, gõ thiếu type cho props, params hoặc response API.
   - Thiếu interface/type định nghĩa rõ ràng.

2. **Đặt Tên & Hằng Số (Magic Values)**:
   - Magic numbers / strings nằm rải rác trong code (ví dụ `8`, `"approved"`) chưa được đưa vào hằng số (`PAGE_SIZE`, `STATUS_ENUM`).

3. **Xử Lý Lỗi & Thông Báo UI**:
   - Câu thông báo lỗi cứng nhắc, chưa tối ưu i18n hoặc thiếu nút "Thử lại" (Retry action) cho người dùng.

---

## 📝 Quy Trình & Form Báo Cáo Code Review

Khi nhận được yêu cầu review file hoặc toàn bộ tính năng, hãy thực hiện theo 3 bước:

### Bước 1: Đọc và Phân Tích Toàn Bộ File Code

- Kiểm tra ranh giới `"use client"`, luồng truyền dữ liệu (Props/SSR), state và lifecycle hooks.

### Bước 2: Tổng Hợp Báo Cáo Review

Trình bày kết quả đánh giá theo mẫu bên dưới:

```markdown
# 📋 Kết Quả Code Review: [Tên Component/File]

## 🌟 Đánh Giá Tổng Quan

- **Điểm mạnh**: [Tóm tắt 1-2 điểm làm tốt]
- **Tình trạng chung**: [Xuất sắc / Cần cải thiện / Có lỗi nghiêm trọng]

---

## 🚨 P0: Lỗi Nghiêm Trọng & Security (Cần Sửa Ngay)

- [Mô tả lỗi hoặc "✅ Không phát hiện lỗi P0"]

## ⚠️ P1: SEO, SSR & Kiến Trúc Core Web Vitals

- [Nhận xét về SSR, Meta, Schema.org, Semantic HTML...]

## ⚡ P2: Hiệu Năng & State Management

- [Nhận xét về Re-render, Derived State, Component Decomposition...]

## 💡 P3: Clean Code & TypeScript

- [Nhận xét về Type safety, Naming, Magic values...]

---
```
