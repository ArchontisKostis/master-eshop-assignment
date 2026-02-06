## Frontend Development Workflow

This document covers:

- Local setup and environment variables.
- Running and building the app.
- Practical patterns and guidelines while developing.

Root: `frontend/`

---

## 1. Setup & Dependencies

### Node & Package Manager

- Recommended: **Node.js 18+**.
- Use `npm` (lockfile is `package-lock.json`).

### Install Dependencies

From `frontend/`:

```bash
npm install
```

---

## 2. Environment Configuration

Environment variables are loaded by Vite from `.env` files.

Initial setup:

```bash
cd frontend
cp .env.example .env
```

Typical variables:

- `VITE_API_BASE_URL` (or similar) - base URL for the backend API used by Axios/Orval.

After changing `.env`, restart `npm run dev` so Vite picks up the changes.

---

## 3. Running & Building

### Development Server

From `frontend/`:

```bash
npm run dev
```

- Vite prints the local dev URL, commonly `http://localhost:5173`.
- Ensure the backend is reachable at the configured API base URL; otherwise you will see “Failed to load products / stores / orders” type errors in the UI.

### Production Build

```bash
npm run build
npm run preview   # optional local preview of built assets
```

- Output: `frontend/dist/`
- In Docker deployments, `dist/` is served by Nginx using `frontend/Dockerfile` and `frontend/nginx.conf`.

---

## 4. Patterns & Guidelines

### Routing

- Declare routes in `src/constants/routes.ts`.
- Wire them in `src/router/index.tsx`.
- Use:
  - `ProtectedRoute` for any authenticated section.
  - `RoleGuard` for CUSTOMER vs STORE restrictions.

### State & Context

- Use `AuthContext` for:
  - Current user and role.
  - `login`, `logout`, `register`.
- Use `ToastContext` for global notifications.
- Use `useCart` to access cart data and item counts across pages.

### API Usage

- Use generated controllers from `src/api/*-controller` rather than direct Axios calls.
- Parse responses with `parseJsonFromBlob` when they are `Blob`s.
- Normalize errors via `api-error.ts` helpers and feed them into:
  - local `Alert` components, or
  - `ToastContext`.

### Type Safety

- Use types from:
  - `src/api/generated.schemas.ts` (backend DTOs).
  - `src/types/auth.ts` (auth‑related types).
- Avoid redefining backend shapes manually; this prevents drift from the API spec.

### UI & Theming

- Prefer MUI components and theme tokens:
  - Use `sx` for styling and responsive layouts.
  - Use `theme.palette` and `theme.spacing` from the configured theme instead of hard‑coded values where possible.
- Reuse `FeatureCard`, `StatCard`, and other shared components to maintain a consistent look.

Following these practices will keep the frontend codebase easy to extend and align well with backend and design changes.

