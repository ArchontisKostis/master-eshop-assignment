## API, Security & Error Handling

This document covers:

- REST API design and endpoint groups.
- Security model and JWT authentication.
- Error handling and `ApiError` responses.

Root package: `uom.eshop.backend`

---

## 1. REST API Design

Controllers live under `uom.eshop.backend.controller` and expose JSON REST endpoints.

Major endpoint groups (typical paths):

- `/api/auth`
  - Login and registration.

- `/api/products`
  - Product search and product CRUD for store owners.

- `/api/stores`
  - Store listing and store‑owner operations.

- `/api/cart`
  - Shopping cart operations (add, update, remove items, and checkout).

- `/api/orders`
  - Customer order history.
  - Store orders view for store owners.

All controllers use DTOs from the `dto` package for request and response shapes.  
The OpenAPI specification for these endpoints is used by the frontend to generate a typed client via Orval.

---

## 2. Error Handling

### GlobalExceptionHandler & ApiError

Package: `uom.eshop.backend.exceptions`

- `EshopException` is the base class for domain‑specific exceptions.
- Common subclasses:
  - `BadRequestException`
  - `NotFoundException`
  - `ForbiddenException`
  - `ConflictException` (e.g. duplicate username/email/tax ID)
  - `BusinessRuleException`
  - `InsufficientStockException`

`GlobalExceptionHandler`:

- Catches these exceptions and converts them to a standardized `ApiError` DTO:
  - HTTP status code.
  - Application error code (e.g. `InsufficientStockException`).
  - Human‑readable message.
- Ensures error responses are consistent and parseable by the frontend.

### Adding New Errors

When you introduce new error cases:

1. Create a new exception type extending `EshopException` if appropriate.
2. Throw it from services when a business rule is violated.
3. If needed, add/adjust a handler method in `GlobalExceptionHandler`.
4. Expose a clear `code` and `message` so the frontend can display specific messages.

The frontend’s `api-error.ts` uses this information to differentiate between, for example:

- Validation errors.
- Conflicts (duplicate fields).
- Stock issues.

---

## 3. Security & JWT Authentication

Package: `uom.eshop.backend.security`

### 3.1 JWT Flow

1. **Login**
   - Client calls the login endpoint with credentials (`LoginRequest`).
   - `AuthService` validates credentials and builds a `UserDetails`/domain user.
   - A JWT is generated via `JwtTokenProvider` containing:
     - User identifier (ID or username).
     - Role (CUSTOMER or STORE).
2. **Client Storage**
   - The frontend stores the token (e.g. in localStorage).
   - Subsequent requests include `Authorization: Bearer <token>`.
3. **Request Handling**
   - `JwtAuthenticationFilter` intercepts incoming requests:
     - Reads the `Authorization` header.
     - Validates the JWT signature and expiration.
     - Builds an `Authentication` object and populates `SecurityContext`.
4. **Authorization**
   - `SecurityConfig` checks:
     - Whether the request is authenticated.
     - Whether it has the correct role for the route.
   - On failures:
     - `RestAuthenticationEntryPoint` handles unauthenticated access (401).
     - `RestAccessDeniedHandler` handles forbidden access (403).

### 3.2 SecurityConfig

`SecurityConfig` controls:

- Which paths are public (e.g. `/api/auth/**`, swagger/health endpoints).
- Which paths require authentication.
- Role‑based constraints for:
  - Customer endpoints vs store‑owner endpoints.

When adding new endpoints:

- Decide whether they are:
  - Public.
  - Authenticated (any user).
  - Role‑restricted.
- Update the authorization rules accordingly.

---

## 4. Best Practices

- Prefer domain exceptions over generic `RuntimeException` for predictable error handling.
- Ensure every externally visible error flows through `GlobalExceptionHandler` to return `ApiError`.
- Keep JWT payload minimal (ID, role, basic claims) and use the database for additional lookups when needed.
- When adding new endpoints:
  - Define clear DTOs in `dto` package.
  - Document them in OpenAPI so the frontend can regenerate its client safely.

Following these patterns keeps the backend API stable, secure, and easy to consume from the frontend.

