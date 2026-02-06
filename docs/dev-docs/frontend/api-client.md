## API Client & Error Handling

This document explains how the frontend talks to the backend:

- Orval‑generated client.
- Axios and Blob handling.
- Error handling helpers and conventions.

Root: `frontend/src/api/`

---

## Orval‑Generated Client

The backend exposes an OpenAPI specification used by **Orval** (see `orval.config.cjs`) to generate:

- Typed DTOs in `generated.schemas.ts`.
- Factory functions per controller:
  - `getAuthController()`
  - `getProductController()`
  - `getStoreController()`
  - `getOrderController()`
  - `getShoppingCartController()`
  - `getCustomerController()`

**Do not edit** generated files (`generated.schemas.ts` and the `*-controller` folders) manually.  
Instead, update the backend spec and regenerate.

### Example Usage

```ts
import { getOrderController } from '../api/order-controller/order-controller';
import { parseJsonFromBlob } from '../api/blob-utils';
import type { OrderResponse } from '../api/generated.schemas';

const orderController = getOrderController();
const response = await orderController.getCustomerOrders();
const orders = await parseJsonFromBlob<OrderResponse[]>(response.data);
```

Pattern:

1. Call the appropriate controller method.
2. Pass `response.data` through `parseJsonFromBlob<T>` (because many methods return `Blob`).
3. Use the typed result in components.

---

## Axios Configuration

`axios.config.ts` defines the shared Axios instance:

- Sets the **base URL** from environment (see `development.md`).
- Attaches the auth token (from `AuthContext` or storage) to `Authorization` headers.
- May define interceptors for:
  - Logging.
  - Redirecting on 401/403, if desired.

Orval is configured to use this Axios instance, so the same configuration is applied across all generated clients.

---

## Blob Handling

Because some Orval options use `responseType: 'blob'`, controller methods often return `Blob` instead of already‑parsed JSON.

`blob-utils.ts` contains helpers for this:

- `parseJsonFromBlob<T>(blob: Blob): Promise<T>`:
  - Reads the blob as text.
  - Parses JSON.
  - Returns strongly typed data.

Always use this helper when working with responses from Orval controllers, unless the controller has been explicitly configured to return plain JSON.

---

## API Error Helpers

File: `api-error.ts`

Provides a small set of functions to standardize backend errors:

- `getApiError(err)`
  - Takes an Axios/Orval error and returns a normalized `ApiError` object (if detectable):
    - Includes HTTP status, backend `code`, `message`, etc.

- `getApiErrorAsync(err)`
  - Async variant for blob responses; parses the backend error body before normalizing.

- `getErrorMessage(err, fallback)`
  - Extracts a human‑readable message or returns the provided fallback.

### Typical Usage Patterns

- **Login**
  - For 400/401:
    - Show “Invalid username or password” (using `getApiError` with code and/or status).
  - For other errors:
    - Show a generic “Login failed” or similar message.

- **Registration**
  - If `status === 409` and `code === 'ConflictException'`:
    - Show a targeted “Username/email/tax ID already exists” message.
  - For 400 validation errors:
    - Show detailed message from backend, if available.

- **Cart & Product Flows**
  - If `code === 'InsufficientStockException'`:
    - Show a specific stock warning and refresh the cart.
  - Otherwise:
    - Show a generic failure via `ToastContext`.

When you introduce new error codes or exception types in the backend, extend the frontend to:

- Interpret the `code` field from `ApiError`.
- Show user‑friendly messages tailored to the new error type.

---

## Conventions

- Always use **generated controllers** instead of raw `axios` calls.
- Prefer `parseJsonFromBlob<T>` for responses to keep typing strong.
- Handle errors at the **page** or **flow** level using:
  - `getApiError` / `getApiErrorAsync`.
  - `ToastContext` or inline error components.
- Keep user‑facing strings centralized or at least consistent (e.g. reusing wording for common failure states across different pages).

Following these patterns keeps backend/front‑end integration consistent, type‑safe, and easier to adjust when the API evolves.

