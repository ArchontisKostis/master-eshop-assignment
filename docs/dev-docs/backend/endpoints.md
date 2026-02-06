## Backend Endpoints Reference

This document summarizes the main REST endpoints exposed by the backend, grouped by controller.  
For request/response schemas, see the DTOs in the `dto` package and the generated OpenAPI/Swagger UI.

Legend:

- **Auth**: whether authentication is required.
- **Role**: required Spring Security role (if any).

---

## AuthController (`/api/auth`)

| Method | Path             | Auth | Role      | Description                    |
|--------|------------------|------|-----------|--------------------------------|
| POST   | `/api/auth/login`    | No   | -         | Login with username/password, returns JWT and user info. |
| POST   | `/api/auth/register` | No   | -         | Register a new customer or store owner account.          |

---

## ProductController (`/api/products`)

| Method | Path                                | Auth | Role        | Description |
|--------|-------------------------------------|------|------------|-------------|
| GET    | `/api/products/recommendations`     | Yes  | CUSTOMER   | Get recommended products for the authenticated customer (optional `limit` query param). |
| POST   | `/api/products`                     | Yes  | STORE      | Add a new product for the authenticated store. |
| PUT    | `/api/products/{id}`                | Yes  | STORE      | Update an existing product by ID for the authenticated store. |
| PATCH  | `/api/products/{id}/stock`          | Yes  | STORE      | Update stock quantity for a product by ID. |
| DELETE | `/api/products/{id}`                | Yes  | STORE      | Delete a product by ID from the authenticated store. |
| GET    | `/api/products/store`               | Yes  | STORE      | Get all products belonging to the authenticated store. |
| GET    | `/api/products`                     | No   | -          | Search/filter products (query params: `title`, `type`, `brand`, `minPrice`, `maxPrice`, `storeId`). |
| GET    | `/api/products/{id}`                | No   | -          | Get a single product by ID. |

---

## StoreController (`/api/stores`)

| Method | Path                         | Auth | Role      | Description |
|--------|------------------------------|------|-----------|-------------|
| GET    | `/api/stores`                | No   | -         | List all stores with basic info and product counts. |
| GET    | `/api/stores/{id}`           | No   | -         | Get details for a specific store by ID. |
| GET    | `/api/stores/stats`          | Yes  | STORE     | Get statistics for the authenticated store (sales, orders, etc.). |
| GET    | `/api/stores/orders/recent`  | Yes  | STORE     | Get recent orders for the authenticated store (optional `limit` query param). |

---

## ShoppingCartController (`/api/cart`)

> Class‑level `@PreAuthorize("hasRole('CUSTOMER')")` - all endpoints require an authenticated **CUSTOMER**.

| Method | Path                          | Auth | Role      | Description |
|--------|-------------------------------|------|-----------|-------------|
| POST   | `/api/cart/items`             | Yes  | CUSTOMER  | Add a product to the cart (body: `AddToCartRequest`). |
| GET    | `/api/cart`                   | Yes  | CUSTOMER  | Get the current cart for the authenticated customer. |
| PUT    | `/api/cart/items/{productId}` | Yes  | CUSTOMER  | Update quantity of a product in the cart (`quantity` query param, must be ≥ 1). |
| DELETE | `/api/cart/items/{productId}` | Yes  | CUSTOMER  | Remove a product from the cart. |

---

## OrderController (`/api/orders`)

| Method | Path                    | Auth | Role      | Description |
|--------|-------------------------|------|-----------|-------------|
| POST   | `/api/orders/checkout`  | Yes  | CUSTOMER  | Simulate payment and complete checkout for the current cart (body: `PaymentRequest`), returns `CheckoutResponse`. |
| POST   | `/api/orders`           | Yes  | CUSTOMER  | Complete order(s) for the current cart without payment simulation, returns list of orders. |
| GET    | `/api/orders`           | Yes  | CUSTOMER  | Get all orders for the authenticated customer. |
| GET    | `/api/orders/recent`    | Yes  | CUSTOMER  | Get recent orders for the authenticated customer (optional `limit` query param, default 5). |
| GET    | `/api/orders/store`     | Yes  | STORE     | Get all orders for the authenticated store owner’s store. |
| GET    | `/api/orders/{id}`      | Yes  | CUSTOMER/STORE | Get a single order by ID if it belongs to the authenticated customer or is associated with the authenticated store. |

---

## CustomerController (`/api/customers`)

| Method | Path                     | Auth | Role      | Description |
|--------|--------------------------|------|-----------|-------------|
| GET    | `/api/customers/stats`   | Yes  | CUSTOMER  | Get statistics for the authenticated customer (orders, spend, etc.). |

---

For security rules (what’s public vs protected) and behavior details, see:

- `api-and-security.md` for auth and error handling.
- `architecture.md` for how controllers delegate to services and repositories.

