## Backend Architecture & Packages

This document describes:

- Package structure.
- Layering and responsibilities.
- Key business rules and where they live.

Root package: `uom.eshop.backend`

---

## Package Overview

Under `src/main/java/uom/eshop/backend`:

- `config`
  - `CorsConfig` - CORS configuration for cross‑origin requests from the frontend.
  - `DataSeeder` - seeds the database with demo customers, stores, and products.
  - `JwtProperties` - strongly typed JWT configuration properties.
  - `PasswordEncoderConfig` - shared password encoder bean.
  - `SecurityConfig` - Spring Security filter chain and authorization rules.

- `controller`
  - `AuthController` - login and registration endpoints.
  - `CustomerController` - customer‑specific stats and data.
  - `OrderController` - order retrieval (and creation if not delegated).
  - `ProductController` - product search and store‑owner product CRUD.
  - `ShoppingCartController` - add/update/remove cart items, checkout entrypoint.
  - `StoreController` - store listing, store details, and store‑owner operations.

- `dto`
  - Request DTOs:
    - `LoginRequest`, `RegisterRequest`, `AddProductRequest`, `AddToCartRequest`,
      `PaymentRequest`, `ProductSearchRequest`, `UpdateProductStockRequest`, etc.
  - Response DTOs:
    - `LoginResponse`, `RegisterResponse`, `ProductResponse`, `StoreResponse`,
      `CartResponse`, `CheckoutResponse`, `OrderResponse`,
      `CustomerStatsResponse`, `StoreStatsResponse`, etc.
  - `ApiError` - common error response envelope used by `GlobalExceptionHandler`.

- `exceptions`
  - Base `EshopException` plus domain‑level exceptions:
    - `BadRequestException`, `ForbiddenException`, `ConflictException`, `NotFoundException`.
    - `BusinessRuleException`, `InsufficientStockException`, etc.
  - `GlobalExceptionHandler` - maps exceptions to `ApiError` HTTP responses.

- `model`
  - JPA entities:
    - `User`, `Customer`, `Store`, `Product`,
      `ShoppingCart`, `CartItem`,
      `Order`, `OrderItem`,
      `Role`, `OrderStatus`.

- `repository`
  - Spring Data JPA repositories:
    - `UserRepository`, `CustomerRepository`, `StoreRepository`, `ProductRepository`,
      `ShoppingCartRepository`, `CartItemRepository`,
      `OrderRepository`, `OrderItemRepository`.

- `security`
  - `JwtTokenProvider` - token creation/validation.
  - `JwtAuthenticationFilter` - extracts token, builds `Authentication`, sets `SecurityContext`.
  - `RestAccessDeniedHandler` - sends 403 JSON for access denied.
  - `RestAuthenticationEntryPoint` - sends 401 JSON for unauthenticated requests.

- `service`
  - `AuthService` - login, registration, token issuance.
  - `UserService` - user lookup and shared user logic.
  - `CustomerService` - customer‑specific operations and stats.
  - `StoreService` - store‑owner operations and stats.
  - `ProductService` - product search, CRUD, and stock handling.
  - `ShoppingCartService` - cart state, item add/update/remove.
  - `OrderService` - checkout logic, order creation, and history.

- `specification`
  - `ProductSpecification` - Spring Data `Specification` for dynamic product search
    (title, type, brand, price range, store).

---

## Layering & Responsibilities

The backend follows a fairly standard layered architecture:

- **Controller layer**
  - Accepts HTTP requests, validates input (optionally using Bean Validation).
  - Delegates business logic to services.
  - Returns DTOs or proper error responses.

- **Service layer**
  - Encapsulates domain/business logic.
  - Coordinates repositories, external services, and transactions.
  - Throws domain‑specific exceptions on rule violations.

- **Repository layer**
  - Handles persistence via Spring Data JPA repositories.
  - Contains no business rules, just data access.

Guidelines:

- Controllers should work exclusively with DTOs, not entities.
- Services should be the only place where entities are created/modified.
- Repositories should not be called from controllers directly.

---

## Key Business Rules

### Multi‑Vendor Checkout

- A customer’s cart may contain items from multiple stores.
- At checkout time:
  - `OrderService` creates **one order per store** represented in the cart.
  - Stock is validated and decremented as part of a transactional operation.
- This ensures:
  - Each store sees only orders relevant to them.
  - All orders for a single checkout are created atomically.

### Stock Validation

- On add/update cart operations:
  - Requested quantity may not exceed current product stock.
  - If it does, `InsufficientStockException` is thrown.
- On checkout:
  - Stock is re‑validated before confirming the order.
  - If there is insufficient stock, the operation is aborted and the client receives an error.

### Role Constraints

- **Customers**
  - Can browse all products/stores.
  - Operate on a single shopping cart.
  - View only their own orders.

- **Store Owners**
  - Manage only the products and orders of their own store.
  - Cannot access customer‑only endpoints.

Role restrictions are enforced both via:

- Spring Security configuration (see `SecurityConfig`), and
- Service‑level guards where necessary to avoid cross‑store access.

---

## Conventions

- **DTOs vs Entities**
  - Use DTOs for controller input/output.
  - Map DTOs to entities within services or mappers.

- **Transactions**
  - Annotate service methods that span multiple writes with `@Transactional`
    (e.g. checkout, cascading deletes or updates).

- **Exception‑driven Control Flow**
  - Throw domain exceptions from services for business rule violations.
  - Let `GlobalExceptionHandler` translate them into consistent HTTP responses.

Adhering to these conventions keeps the backend cohesive, testable, and easier to evolve alongside the frontend.

