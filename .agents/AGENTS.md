# Project Context & AI Guidelines

This document serves as the single source of truth for the codebase architecture, conventions, database schema, and workflows. AI agents and developers should reference this guide before implementing or refactoring any feature.

---

## 1. Project Overview & Tech Stack

The workspace is a monorepo containing:
- **/api**: Backend REST API built with Node.js, Express 5, TypeScript, and PostgreSQL.
- **/web**: Frontend web application built with Next.js (App Router) and TypeScript.

### Backend Tech Stack (`/api`)
- **Runtime / Framework**: Node.js (ES Modules), Express `^5.2.1`
- **Language**: TypeScript (`target: ES2022`, `module: NodeNext`, `moduleResolution: NodeNext`)
- **Database**: PostgreSQL using raw SQL via `pg` (`Pool`)
- **Dev Runner**: `tsx watch src/server.ts`
- **Port**: `process.env.PORT || 3000`

> [!IMPORTANT]
> **ESM Import Convention (NodeNext)**:
> In TypeScript files under `/api/src`, all relative imports **MUST** remove `.js` file extension.
> Example: `import { query } from "./config/db"` (NOT `./config/db.js`).

---

## 2. Backend Architecture (`/api/src`)

The backend follows a strict **3-Tier / Layered Architecture**:

```text
Request (e.g. GET /api/recipes)
   │
   ▼
[Routes] (`src/routes/*.router.ts` & `src/routes/index.ts`)
   │
   ▼
[Controllers] (`src/controllers/*.controller.ts`)
   │ (Handles req, res, next, and status codes)
   ▼
[Services] (`src/services/*.service.ts`)
   │ (Business logic, transformations, validations)
   ▼
[Repositories] (`src/repositories/*.repository.ts`)
   │ (Raw SQL database queries)
   ▼
[Database Config] (`src/config/db.ts`) -> PostgreSQL Pool
```

### Directory Structure & Responsibilities

```text
api/
├── db/
│   └── schema.sql              # Database DDL schema & table definitions
├── src/
│   ├── config/
│   │   ├── db.ts               # PostgreSQL Pool instance & query() helper
│   │   └── env.ts              # Environment variable parsing and validation
│   ├── controllers/
│   │   └── recipe.controller.ts# Handles HTTP requests/responses
│   ├── middlewares/
│   │   ├── errorHandler.ts     # Global error handling middleware
│   │   └── validate.ts         # Request validation middleware (schemas)
│   ├── repositories/
│   │   └── recipe.repository.ts# Data access layer (raw SQL queries)
│   ├── routes/
│   │   ├── index.ts            # Aggregated router mounted at /api
│   │   └── recipe.router.ts    # Route definitions for /recipes
│   ├── schemas/                # Validation schemas (e.g. Zod / Joi)
│   ├── services/
│   │   └── recipe.service.ts   # Business logic layer
│   ├── types/
│   │   ├── express.d.ts        # Custom Express type declarations
│   │   └── recipe.type.ts      # TypeScript interfaces matching DB models & DTOs
│   ├── utils/
│   │   ├── AppError.ts         # Custom error class with HTTP status codes
│   │   └── logger.ts           # Logging utilities
│   ├── app.ts                  # Express application setup & middleware mounting
│   └── server.ts               # Entry point: DB connection check & server listen
├── package.json
└── tsconfig.json
```

---

## 3. Database Schema (`api/db/schema.sql`)

```sql
-- Recipes table
CREATE TABLE IF NOT EXISTS recipes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    prep_time_minutes INT NOT NULL,
    cook_time_minutes INT NOT NULL,
    servings INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
    id SERIAL PRIMARY KEY,
    recipe_id INT REFERENCES recipes(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL
);

-- Instructions table
CREATE TABLE IF NOT EXISTS instructions (
    id SERIAL PRIMARY KEY,
    recipe_id INT REFERENCES recipes(id) ON DELETE CASCADE,
    step_number INT NOT NULL,
    instruction TEXT NOT NULL
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL
);

-- Recipes <-> Categories junction table
CREATE TABLE IF NOT EXISTS recipes_categories (
    recipe_id INT REFERENCES recipes(id) ON DELETE CASCADE,
    category_id INT REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (recipe_id, category_id)
);
```

---

## 4. Standard Flow for Implementing New APIs

When creating a new endpoint (e.g. for `recipes`, `categories`, `ingredients`):

1. **Define Types** in `src/types/<feature>.type.ts`:
   - Define domain model interfaces matching DB tables.
   - Define request payload/DTO interfaces (CreateDTO, UpdateDTO, QueryFilters).
2. **Implement Repository** in `src/repositories/<feature>.repository.ts`:
   - Import `query` from `../config/db.js`.
   - Write parameterized SQL queries (always use `$1, $2, ...` to prevent SQL injection).
3. **Implement Service** in `src/services/<feature>.service.ts`:
   - Coordinate repository calls, apply business validation, calculations, or slug generation.
4. **Implement Controller** in `src/controllers/<feature>.controller.ts`:
   - Extract parameters from `req.params`, `req.query`, `req.body`.
   - Call service methods.
   - Return standard JSON responses:
     ```json
     {
       "success": true,
       "data": ...,
       "count": 10 // optional for lists
     }
     ```
   - Forward unhandled errors to `next(error)`.
5. **Define Routes** in `src/routes/<feature>.router.ts`:
   - Setup route handlers on an Express `Router()`.
   - Mount router in `src/routes/index.ts` under `/api/<feature>`.

---

## 5. Standard Error Handling Pattern

- Use a custom `AppError` (extending `Error`) with `statusCode` and `isOperational` properties.
- Use global error middleware in `src/middlewares/errorHandler.ts` registered at the very bottom of `src/app.ts`.
- Standard error response format:
  ```json
  {
    "success": false,
    "error": "Error message description"
  }
  ```

---

## 6. Commands Reference

### Backend (`/api`)
- `npm run dev`: Starts the development server with hot-reload via `tsx watch src/server.ts`.
- `npm run build`: Compiles TypeScript to `dist/`.
- `npm start`: Runs the compiled app with `node dist/server.js`.

### Frontend (`/web`)
- `npm run dev`: Starts Next.js development server.
- `npm run build`: Builds the Next.js production bundle.
- `npm start`: Runs the Next.js production server.

---

## 7. Frontend Architecture & Zero-Refactor UI Guidelines (`/web`)

When creating or modifying frontend pages and UI components under `/web/app`:

1. **Zero-Refactor Principle**: Never generate monolithic `page.tsx` (> 200 lines). Every feature page must be decomposed into subcomponents located in `components/` subfolder.
2. **Component Hierarchy**:
   - **Global Shared Components** -> `web/app/components/` (`Toast.tsx`, `Tabs.tsx`, `RecipeCard.tsx`, etc.)
   - **Admin Domain Shared Components** -> `web/app/admin/components/` (`AdminPageHeader.tsx`, `AdminSearchBar.tsx`, `AdminToast.tsx`, `AdminEmptyState.tsx`, `AdminSidebar.tsx`)
   - **Feature Subcomponents** -> `web/app/admin/<feature>/components/` (`<Feature>Modal.tsx`, `Delete<Feature>Modal.tsx`, `<Feature>TableRow.tsx`, `<Feature>Skeleton.tsx`)
3. **Common Components Reuse**:
   - Always reuse `AdminPageHeader`, `AdminSearchBar`, `AdminToast`, and `AdminEmptyState`.
4. **TypeScript Strictness**:
   - Define exact interfaces for props, payloads, and response data (no `any`).
5. **Validation**:
   - Always verify compilation with `npm run build` in `/web` before concluding any UI task.


