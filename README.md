# 🍳 Recipes Platform

A modern, full-stack recipe sharing and management platform built with a decoupled architecture featuring an **Express 5 + TypeScript + PostgreSQL** REST API backend and a **Next.js 16 (App Router) + Tailwind CSS** frontend.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Project Structure](#-project-structure)
- [Key Features](#-key-features)
- [Database Schema](#-database-schema)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup (`/api`)](#1-backend-setup-api)
  - [Frontend Setup (`/web`)](#2-frontend-setup-web)
- [API Documentation](#-api-documentation)
- [Environment Variables](#-environment-variables)
- [Automation & CI/CD](#-automation--cicd)

---

## 🌟 Overview

The **Recipes Platform** allows home cooks and food enthusiasts to discover, submit, and manage cooking recipes. The platform supports community submissions with an administrative review workflow (pending, approved, rejected), full-text search with Vietnamese diacritic-insensitive matching (`unaccent`), step-by-step cooking guides with images, secure OTP password reset, and cloud image uploads.

---

## 🛠️ Architecture & Tech Stack

### 🔙 Backend (`/api`)
- **Runtime & Framework**: [Node.js](https://nodejs.org/) (ES Modules), [Express 5](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via raw parameterized SQL with `pg` Pool)
- **API Documentation**: [Swagger UI Express](https://github.com/scottie1984/swagger-ui-express) & [Zod to OpenAPI](https://github.com/asteasolutions/zod-to-openapi)
- **Validation**: [Zod](https://zod.dev/)
- **Authentication & Security**: [JWT](https://jwt.io/), [bcrypt](https://github.com/kelektiv/node.bcrypt.js), `express-rate-limit`
- **File Uploads**: [Multer](https://github.com/expressjs/multer) & [Cloudinary](https://cloudinary.com/)
- **Emails / Password Reset**: [Resend](https://resend.com/)
- **Scheduled Jobs**: [node-cron](https://github.com/node-cron/node-cron)
- **Build Tool**: [tsup](https://tsup.egoist.dev/) & [tsx](https://github.com/privatenumber/tsx)

### 🎨 Frontend (`/web`)
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server & Client Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/), [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Components & Forms**: React Select, Lucide Icons

---

## 📂 Project Structure

```text
recipes/
├── .github/
│   └── workflows/
│       └── db-backup.yml        # Automated daily PostgreSQL backup workflow
├── api/                         # Backend REST API
│   ├── db/
│   │   └── schema.sql           # PostgreSQL DDL schema & extensions
│   ├── src/
│   │   ├── config/              # DB pool, Cloudinary, and Resend configs
│   │   ├── controllers/         # HTTP request/response handlers
│   │   ├── docs/                # OpenAPI / Swagger specification generator
│   │   ├── jobs/                # Cron background jobs (e.g. OTP cleanup)
│   │   ├── middlewares/         # Auth, Rate Limiter, Error handling, Validation
│   │   ├── repositories/        # Data access layer (parameterized raw SQL)
│   │   ├── routes/              # Express route definitions (/api/...)
│   │   ├── schemas/             # Zod validation schemas
│   │   ├── services/            # Business logic layer
│   │   ├── types/               # TypeScript interfaces and DB models
│   │   ├── utils/               # AppError, logger, helper functions
│   │   ├── app.ts               # Express app initialization & middleware stack
│   │   └── server.ts            # Entry point & server listener
│   ├── package.json
│   └── tsconfig.json
├── web/                         # Frontend Web App
│   ├── app/
│   │   ├── (site)/              # Public routes (Home, Recipes, My Recipes)
│   │   ├── admin/               # Admin dashboard & recipe review panel
│   │   ├── login/               # Authentication pages
│   │   ├── register/
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   └── layout.tsx           # Root layout & global styling
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── services/            # Frontend API client (Axios)
│   │   └── types/               # Shared frontend types
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

---

## ✨ Key Features

- **Recipe Management**:
  - Full CRUD operations on recipes with ingredients, preparation times, cooking times, servings, and step-by-step instructions.
  - Category tagging and categorization.
  - Image uploads for recipe headers and individual cooking step images via Cloudinary.
- **Search & Filtering**:
  - Fast diacritic-insensitive search (`unaccent`) for recipe titles.
  - Category and status filters.
- **Recipe Moderation Workflow**:
  - Community submissions enter `pending` state.
  - Admin dashboard to approve or reject recipes with rejection reasons.
- **Authentication & Authorization**:
  - Secure JWT authentication with role-based access control (`user`, `admin`).
  - Forgot password flow using secure, time-limited OTP sent via Resend email.
- **API Documentation**:
  - Interactive Swagger UI documentation available directly at `/docs`.
- **Automated Operations**:
  - Background cron tasks for database maintenance.
  - Daily automated PostgreSQL backup via GitHub Actions (stored in GitHub Releases & Artifacts).

---

## 🗄️ Database Schema

The database uses PostgreSQL with the `unaccent` extension for flexible search:

- **`users`**: User credentials, roles (`user`, `admin`), and OTP reset states.
- **`recipes`**: Main recipe metadata, status (`pending`, `approved`, `rejected`), author reference, and prep/cook times.
- **`ingredients`**: Granular ingredient details per recipe (amount, unit, name).
- **`instructions`**: Step-by-step cooking steps with optional step images.
- **`categories`**: Recipe categories (e.g. Breakfast, Dessert, Main Course).
- **`recipes_categories`**: Many-to-many junction table connecting recipes and categories.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ or v20+ recommended)
- [PostgreSQL](https://www.postgresql.org/) database (local or cloud instance like Neon)
- [Cloudinary](https://cloudinary.com/) account for image uploads
- [Resend](https://resend.com/) account for transactional emails

---

### 1. Backend Setup (`/api`)

1. **Navigate to the `api` folder**:
   ```bash
   cd api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in `/api` (refer to [.env reference](#backend-environment-variables-api)):
   ```env
   PORT=3000
   DATABASE_URL=postgresql://user:password@localhost:5432/recipes_db
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   RESEND_EMAIL_API_KEY=your_resend_api_key
   RESEND_EMAIL_FROM=onboarding@resend.dev
   ACCESS_CONTROL_ALLOW_ORIGIN=http://localhost:8888
   ```

4. **Initialize the database**:
   Run the SQL script from [`api/db/schema.sql`](file:///Users/kiennt2/recipes/api/db/schema.sql) in your PostgreSQL database instance.

5. **Start the API server**:
   ```bash
   # Development mode with hot-reload
   npm run dev

   # Build for production
   npm run build

   # Start production build
   npm start
   ```

The API will be available at `http://localhost:3000`.

---

### 2. Frontend Setup (`/web`)

1. **Navigate to the `web` folder**:
   ```bash
   cd ../web
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env.local` file in `/web`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

4. **Start the Next.js development server**:
   ```bash
   npm run dev
   ```

The web application will be accessible at `http://localhost:8888` (or `http://localhost:3000` depending on port config).

---

## 📖 API Documentation

Once the backend is running, you can access the interactive Swagger UI documentation at:
- **Interactive Swagger UI**: [http://localhost:3000/docs](http://localhost:3000/docs)
- **OpenAPI JSON Spec**: [http://localhost:3000/docs.json](http://localhost:3000/docs.json)

### Main Endpoint Groups:
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Log in and retrieve JWT token
- `POST /api/auth/forgot-password` — Request password reset OTP
- `POST /api/auth/reset-password` — Reset password using OTP
- `GET /api/recipes` — List & search approved recipes (with pagination & category filters)
- `GET /api/recipes/:slug` — Get recipe details with ingredients and instructions
- `POST /api/recipes` — Create a new recipe (requires auth)
- `PUT /api/recipes/:id` — Update recipe (author / admin)
- `DELETE /api/recipes/:id` — Delete recipe
- `PATCH /api/recipes/:id/status` — Approve/Reject recipe (admin only)
- `POST /api/upload` — Upload image to Cloudinary

---

## 🔐 Environment Variables

### Backend Environment Variables (`/api/.env`)

| Variable | Required | Description | Default |
| :--- | :--- | :--- | :--- |
| `PORT` | No | Port on which the API server listens | `3000` |
| `DATABASE_URL` | Yes | PostgreSQL connection string URL | - |
| `JWT_SECRET` | Yes | Secret key for signing and verifying JWT tokens | - |
| `ACCESS_CONTROL_ALLOW_ORIGIN` | No | CORS allowed origin header | `*` |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary account cloud name | - |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API access key | - |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret key | - |
| `RESEND_EMAIL_API_KEY` | Yes | Resend API key for sending emails | - |
| `RESEND_EMAIL_FROM` | No | Sender email address for outgoing emails | `onboarding@resend.dev` |

### Frontend Environment Variables (`/web/.env.local`)

| Variable | Required | Description | Default |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Yes | Base URL to the backend API | `http://localhost:3000/api` |

---

## ⚙️ Automation & CI/CD

- **Automated Database Backups**:
  - Located in [`.github/workflows/db-backup.yml`](file:///Users/kiennt2/recipes/.github/workflows/db-backup.yml).
  - Triggers every day at `00:00 UTC` and supports manual triggers (`workflow_dispatch`).
  - Dumps PostgreSQL using `pg_dump`, compresses with `gzip`, uploads an artifact (retained 30 days), and publishes a permanent release under GitHub Releases.

---

## 📜 License

This project is licensed under the [ISC License](LICENSE).
