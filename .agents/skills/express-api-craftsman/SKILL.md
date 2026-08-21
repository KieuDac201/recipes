---
name: express-api-craftsman
description: >-
  Standard operating procedure and architectural best practices for building Node.js, Express 5, TypeScript,
  and PostgreSQL backend REST APIs. Enforces strict 3-tier layered architecture, raw SQL parameterized safety,
  Zod request validation, automatic OpenAPI/Swagger documentation, error handling standards, and ESM import rules.
---

# Express 5 & PostgreSQL API Craftsman Skill

Bộ quy chuẩn kiến trúc và phương pháp luận chuyên nghiệp giúp AI tạo code Backend (Node.js, Express 5, TypeScript, PostgreSQL) chuẩn chỉ ngay từ lần sinh mã đầu tiên, tuân thủ nghiêm ngặt mô hình 3 lớp (3-Tier Layered Architecture) và tự động đồng bộ tài liệu API OpenAPI/Swagger.

---

## 1. Triết Lý Cốt Lõi: Strict 3-Tier Layered Architecture

> **Nguyên tắc vàng**: "Mỗi tầng chỉ làm đúng một nhiệm vụ duy nhất (Single Responsibility) và chỉ giao tiếp với tầng liền kề bên dưới."

```text
HTTP Request (e.g. POST /api/categories)
   │
   ▼
[Routes] (`src/routes/*.router.ts` & `src/routes/index.ts`)
   │ ➔ Khai báo endpoint, gắn middleware (Auth, Validation)
   ▼
[Controllers] (`src/controllers/*.controller.ts`)
   │ ➔ Trích xuất req.body/params/query, gọi Service, trả response chuẩn (sendSuccess)
   ▼
[Services] (`src/services/*.service.ts`)
   │ ➔ Nghiệp vụ, kiểm tra ràng buộc, biến đổi dữ liệu, ném AppError
   ▼
[Repositories] (`src/repositories/*.repository.ts`)
   │ ➔ Truy vấn cơ sở dữ liệu PostgreSQL (Raw SQL parameterized queries)
   ▼
[Database Pool] (`src/config/db.ts`) -> PostgreSQL Connection
```

---

## 2. Quy Tắc Bắt Buộc Về TypeScript & ESM Imports

> [!IMPORTANT]
> **ESM Import Convention (NodeNext)**:
> - Trong toàn bộ source code TypeScript tại `/api/src`, tất cả các relative import **TUYỆT ĐỐI KHÔNG** dùng đuôi `.js` (dự án dùng `tsup` & `tsx` bundler).
> - **Đúng**: `import { query } from "../config/db"`
> - **Sai**: `import { query } from "../config/db.js"`

---

## 3. Quy Trình 6 Bước Triển Khai Endpoint Mới (Standard 6-Step Workflow)

Khi thêm hoặc cập nhật bất kỳ tính năng/endpoint nào trong Backend, AI **BẮT BUỘC** thực hiện tuần tự 6 bước sau:

### Bước 1: Định nghĩa Interface & DTOs (`src/types/<feature>.type.ts`)
- Định nghĩa Domain Model Interface tương ứng với bảng Database.
- Định nghĩa các DTOs: `Create<Feature>Body`, `Update<Feature>Body`, `Get<Feature>Query`.
```typescript
export interface Category {
  id: number
  name: string
  slug: string
}

export interface CreateCategoryBody {
  name: string
  slug?: string
}
```

### Bước 2: Triển khai Data Access Layer (`src/repositories/<feature>.repository.ts`)
- Sử dụng hàm `query` từ `../config/db`.
- **Bắt buộc dùng Parameterized Queries (`$1, $2, ...`)** để phòng chống 100% SQL Injection.
- Sử dụng `RETURNING *` khi `INSERT`, `UPDATE`, `DELETE` để nhận lại bản ghi đã thao tác.
- Luôn chỉ định kiểu trả về `Promise<T | null>` hoặc `Promise<T[]>`.
```typescript
import { query } from "../config/db"
import { Category, CreateCategoryBody } from "../types/category.type"

const createCategory = async (data: { name: string; slug: string }): Promise<Category> => {
  const sql = `INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING *`
  const result = await query(sql, [data.name, data.slug])
  return result.rows[0]
}
```

### Bước 3: Triển khai Business Logic Layer (`src/services/<feature>.service.ts`)
- Thực hiện kiểm tra tính hợp lệ nghiệp vụ, trùng lặp tên/slug, hoặc tính toán logic.
- Nếu không tìm thấy hoặc vi phạm nghiệp vụ, ném `AppError(message, statusCode)`.
```typescript
import { categoryRepository } from "../repositories/category.repository"
import { AppError } from "../utils/AppError"

const updateCategory = async (id: number, data: UpdateCategoryBody): Promise<Category> => {
  const updated = await categoryRepository.updateCategory(id, data)
  if (!updated) {
    throw new AppError("Category not found", 404)
  }
  return updated
}
```

### Bước 4: Triển khai Controller Layer (`src/controllers/<feature>.controller.ts`)
- Nhận `req`, `res`, `next`.
- Lấy dữ liệu từ `req.params`, `req.query`, `req.body`, hoặc `req.user`.
- Trả về response chuẩn thông qua helper `sendSuccess(res, data, statusCode, meta)`.
- Luôn bọc trong khối `try/catch` và chuyển lỗi về `next(error)`.
```typescript
import { Request, Response, NextFunction } from "express"
import { sendSuccess } from "../utils/response"
import { categoryService } from "../services/category.service"

const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newCategory = await categoryService.createCategory(req.body)
    return sendSuccess(res, newCategory, 201)
  } catch (error) {
    next(error)
  }
}
```

### Bước 5: Định nghĩa Zod Schema & Đăng ký OpenAPI (`src/schemas/<feature>.schema.ts`)
- Định nghĩa Schema validate cho Request Payload, Query, Path Parameters bằng `zod`.
- Đăng ký Schema vào `registry.register(...)` để sinh tài liệu Swagger tự động.
- Đăng ký Path `registry.registerPath(...)` với đầy đủ method, path, tags, description, security (`BearerAuth`), và các mã response (200/201, 400, 401, 403, 404, 500).
```typescript
export const CreateCategoryPayloadSchema = registry.register(
  "CreateCategoryPayload",
  z.object({
    name: z.string().min(1, "Category name is required"),
    slug: z.string().min(1).optional(),
  })
)

registry.registerPath({
  method: "post",
  path: "/categories",
  tags: ["Categories"],
  summary: "Create a new category",
  security: [{ BearerAuth: [] }],
  request: { body: { content: { "application/json": { schema: CreateCategoryPayloadSchema } } } },
  responses: {
    201: { description: "Created", content: { "application/json": { schema: CreateCategoryResponseSchema } } },
    ...
  },
})
```

### Bước 6: Khai báo Routes & Gắn Middleware (`src/routes/<feature>.router.ts`)
- Sử dụng `validateBody(...)`, `validateQuery(...)` hoặc `validateParams(...)` để chặn request không hợp lệ ngay tại cổng vào.
- Thêm `verifyToken` cho các route yêu cầu đăng nhập, `authAdmin` cho route yêu cầu quyền quản trị.
- Mount router vào `src/routes/index.ts`.
```typescript
router.post(
  "/",
  verifyToken,
  authAdmin,
  validateBody(createCategoryPayloadSchema),
  categoryController.createCategory
)
```

---

## 4. Chuẩn Định Dạng Dữ Liệu API (API Response Standards)

### Phản hồi thành công (Success Response):
```json
{
  "success": true,
  "data": { ... },
  "currentPage": 1,   // (Tùy chọn khi phân trang)
  "totalPage": 5,     // (Tùy chọn khi phân trang)
  "limit": 10,        // (Tùy chọn khi phân trang)
  "totalCount": 48    // (Tùy chọn khi phân trang)
}
```

### Phản hồi lỗi (Error Response):
```json
{
  "success": false,
  "error": "Mô tả nguyên nhân lỗi rõ ràng",
  "details": [ ... ]  // (Tùy chọn: danh sách lỗi validate từ Zod)
}
```

---

## 5. Security & Best Practices Checklist

1. **SQL Injection Prevention**: Không bao giờ nối chuỗi trực tiếp vào câu lệnh SQL (`${variable}` bên trong giá trị query). Luôn dùng mảng tham số `$1, $2, ...`.
2. **Transaction Management**: Khi thực hiện nhiều thao tác ghi liên quan (VD: tạo công thức + nguyên liệu + bước làm), luôn dùng Database Client Transaction:
   ```typescript
   const client = await pool.connect()
   try {
     await client.query("BEGIN")
     // ... các câu query
     await client.query("COMMIT")
   } catch (error) {
     await client.query("ROLLBACK")
     throw error
   } finally {
     client.release()
   }
   ```
3. **HTTP Status Codes Chuẩn**:
   - `200 OK`: Truy vấn, cập nhật hoặc xóa thành công.
   - `201 Created`: Tạo mới bản ghi thành công.
   - `400 Bad Request`: Dữ liệu đầu vào không hợp lệ hoặc vi phạm logic trùng lặp.
   - `401 Unauthorized`: Chưa đăng nhập hoặc token không hợp lệ/hết hạn.
   - `403 Forbidden`: Người dùng không có quyền (không phải admin).
   - `404 Not Found`: Không tìm thấy bản ghi theo ID/Slug.
   - `500 Internal Server Error`: Lỗi hệ thống ngoài dự kiến.

---

## 6. Checklist Tự Kiểm Tra Trước Khi Hoàn Tất Backend Code

Mỗi lần tạo hoặc cập nhật API, AI phải tự kiểm tra:
- [ ] Code có tuân thủ đủ 3 tầng: Route ➔ Controller ➔ Service ➔ Repository không?
- [ ] Toàn bộ relative imports có bỏ đuôi `.js` không?
- [ ] Các câu truy vấn SQL có dùng parameterized `$1, $2` và `RETURNING *` không?
- [ ] Đã có Zod validation schema cho request body/query/params chưa?
- [ ] Đã đăng ký OpenAPI path vào `registry.registerPath` để cập nhật Swagger UI `/docs` chưa?
- [ ] Đã cập nhật danh sách endpoint trong `README.md` chưa?
- [ ] Đã chạy `npm run build` trong thư mục `/api` để đảm bảo TypeScript compile 100% thành công không?
