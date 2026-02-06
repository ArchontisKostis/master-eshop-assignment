## Frontend Architecture & Structure

This document covers:

- Folder structure.
- Routing and layouts.
- Global contexts and domain hooks.
- UI/theming and patterns.

Root: `frontend/src/`

---

## Folder Structure

Under `frontend/src`:

- `api/`
  - `axios.config.ts` - configures the Axios instance (base URL, interceptors, auth headers).
  - `setup.ts` - shared API client bootstrap.
  - `generated.schemas.ts` - Orval‑generated types (do **not** edit manually).
  - `auth-controller/` - generated functions for auth endpoints.
  - `customer-controller/`, `store-controller/`, `product-controller/`,
    `shopping-cart-controller/`, `order-controller/` - generated REST clients per backend controller.
  - `api-error.ts` - helpers to normalize backend error responses.
  - `blob-utils.ts` - helpers like `parseJsonFromBlob` for `Blob` responses.

- `components/`
  - `layout/`
    - `MainLayout` - public layout (landing, auth, about, etc.) with header/footer.
    - `DashboardLayout` - authenticated layout (sidebar + top app bar + main content).
    - `Header`, `Footer` - shared building blocks.
  - `common/`
    - `FeatureCard`, `StatCard` - reusable cards for landing/dashboard.
    - `ErrorBoundary` - React error boundary used as router `errorElement`.
  - `auth/`
    - `CustomerRegisterForm`, `StoreRegisterForm` - forms embedded in `RegisterPage`.
  - `modals/`
    - `EditProductModal`, `UpdateStockModal` - dialogs for store product management.
  - `guards/`
    - `ProtectedRoute` - enforces authentication.
    - `RoleGuard` - enforces role (`UserRole.CUSTOMER` vs `UserRole.STORE`).

- `constants/`
  - `routes.ts` - central definition of route paths and names.

- `contexts/`
  - `AuthContext.tsx` - authentication state and actions.
  - `ToastContext.tsx` - global toast/notification provider.

- `hooks/`
  - `useCart.ts` - shared hook for retrieving and refreshing cart data and counts.

- `pages/`
  - Public: `LandingPage`, `LoginPage`, `RegisterPage`, `AboutPage`, `NotFoundPage`, `UnauthorizedPage`.
  - Customer: `CustomerDashboard`, `MarketplacePage`, `ProductsPage`, `CartPage`,
    `CheckoutPage`, `OrdersPage`, `StoresPage`, `StoreDetailPage`.
  - Store owner: `StoreDashboard`, `StoreProductsPage`, `AddProductPage`, `StoreOrdersPage`.

- `router/`
  - `index.tsx` - defines the route tree using `createBrowserRouter` & `RouterProvider`.

- `theme/`
  - `index.tsx`, `components.ts`, `palette.ts`, `tokens.ts`, `typography.ts` - MUI theme configuration and design tokens.

- `types/`
  - `auth.ts` - shared auth types, including the `UserRole` enum.

- `utils/`
  - `navigation.ts` - helpers like computing dashboard routes by role.

Entry points:

- `main.tsx` - React root, providers, and router.
- `App.tsx` - optional top‑level shell; routing lives in `router/index.tsx`.

---

## Routing & Layout

Routing is defined in `src/router/index.tsx` using React Router v6 `createBrowserRouter`.

### Main Layout (Public)

Mounted under `MainLayout`:

- `/` (`ROUTES.HOME`) → `LandingPage`
- `/stores` → `StoresPage`
- `/about` → `AboutPage`
- `/login` → `LoginPage`
- `/register` → `RegisterPage`
- `/unauthorized` → `UnauthorizedPage`
- `*` → `NotFoundPage`

These routes are public; protected pages redirect here when unauthenticated or unauthorized.

### Dashboard Layout (Authenticated)

Mounted under `DashboardLayout`, wrapped by `ProtectedRoute`:

- **Customer routes** (`RoleGuard` with `UserRole.CUSTOMER`):
  - `ROUTES.CUSTOMER_DASHBOARD` → `CustomerDashboard`
  - `ROUTES.MARKETPLACE` → `MarketplacePage`
  - `ROUTES.PRODUCTS` → `ProductsPage`
  - `ROUTES.CART` → `CartPage`
  - `ROUTES.ORDERS` → `OrdersPage`
  - `ROUTES.CHECKOUT` → `CheckoutPage`

- **Store routes** (`RoleGuard` with `UserRole.STORE`):
  - `ROUTES.STORE_DASHBOARD` → `StoreDashboard`
  - `ROUTES.STORE_PRODUCTS` → `StoreProductsPage`
  - `ROUTES.STORE_ADD_PRODUCT` → `AddProductPage`
  - `ROUTES.STORE_ORDERS` → `StoreOrdersPage`

`ErrorBoundary` is set as `errorElement` for both top‑level route trees.

When adding new pages:

- Add a route constant to `constants/routes.ts`.
- Wire the component in `router/index.tsx`, ensuring:
  - `ProtectedRoute` wraps authenticated sections.
  - `RoleGuard` wraps any role‑specific sections.

---

## Auth & Global State

### AuthContext

`src/contexts/AuthContext.tsx`:

- Stores:
  - Current user (including role).
  - Auth token (usually from backend login).
- Exposes:
  - `login(credentials)` - calls backend auth endpoints and sets user/token.
  - `logout()` - clears user and token, redirects to home.
  - `register(data)` - calls backend registration endpoint.
- Persists user in `localStorage` so sessions persist across refreshes.

Usage patterns:

- `LoginPage`:
  - Calls `login({ username, password })`.
  - On success, reads the persisted user and:
    - Computes target dashboard via `getDashboardRoute(user.role)`.
    - Navigates either to an originally requested route or to that dashboard.

- `RegisterPage`:
  - Uses `register(data)`.
  - On success, navigates to `ROUTES.LOGIN` with a success message in `location.state`.

### Route Guards

- `ProtectedRoute`
  - Checks for authenticated user from `AuthContext`.
  - If missing, redirects to `ROUTES.LOGIN` and preserves the attempted path in `state.from`.

- `RoleGuard`
  - Accepts `allowedRoles` and checks `user.role`.
  - If unauthorized, redirects to `ROUTES.UNAUTHORIZED`.

---

## Domain Hooks & Contexts

### useCart

`src/hooks/useCart.ts`:

- Fetches cart data from the backend.
- Exposes:
  - `cart` - structured response (items, totals).
  - `itemCount` - total items across all stores.
  - `loading` - loading state.
  - `refreshCart()` - to refetch when quantities change.

Used in:

- `CustomerDashboard` - for dashboard stats.
- `CartPage` - for main cart view and updates.
- `DashboardLayout` - for cart badges in sidebar and top app bar.

### ToastContext

`src/contexts/ToastContext.tsx`:

- Provides `useToast()` hook with:
  - `showToast(message, severity)` where severity is `'success' | 'error' | 'warning' | 'info'`.

Used broadly for:

- Add to cart success/failure.
- Cart quantity updates.
- Product CRUD actions.
- Generic error states from API calls.

---

## UI & Theming

The UI is built with **MUI** and a project‑specific theme.

- Theme configuration:
  - `src/theme/index.tsx` - main theme export and provider integration.
  - `components.ts` - component overrides.
  - `palette.ts` - color palette.
  - `typography.ts` - font sizes, weights, variants.
  - `tokens.ts` - design tokens shared across theme parts.

- Global CSS:
  - `App.css`, `index.css` - base styles applied on top of MUI.

Guidelines:

- Prefer MUI primitives (`Box`, `Typography`, `Card`, etc.) instead of raw HTML tags.
- Use design tokens and theme values (`theme.spacing`, `theme.palette`) rather than hard‑coded values where possible.
- Reuse shared components (`FeatureCard`, `StatCard`) for consistent look and feel.
- Maintain responsive design patterns already used across existing pages (e.g. `sx` props with `{ xs: ..., md: ... }`).

---

## Patterns & Guidelines

- **Centralized routing**
  - Define paths in `constants/routes.ts`.
  - Wire them in `router/index.tsx`.

- **Auth & roles**
  - Avoid manual role checks in pages for access control; rely on `ProtectedRoute` + `RoleGuard`.

- **State management**
  - Use Context for cross‑cutting state (auth, toasts).
  - Use hooks (`useCart`, future domain hooks) for reusable domain logic.

- **Type safety**
  - Prefer types from `generated.schemas.ts` and `types/auth.ts`.
  - Avoid duplicating backend DTO shapes manually.

These patterns keep the frontend maintainable, consistent, and resilient to backend contract changes.

