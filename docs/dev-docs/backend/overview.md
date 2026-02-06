## Backend Overview

The E‑Shop backend is a **Spring Boot** application that exposes a REST API for the frontend.

Its main responsibilities are:

- Manage users (customers and store owners) and authentication.
- Persist and query domain data in a PostgreSQL database.
- Provide endpoints for:
  - Products and stores.
  - Shopping carts and checkout.
  - Orders and statistics.
- Enforce core business rules:
  - Multi‑store (“multi‑vendor”) checkout.
  - Stock validation.
  - Role‑based access control.

---

## Tech Stack

- **Language**: Java 17+
- **Framework**: Spring Boot
- **Database**: PostgreSQL
- **Build Tool**: Maven
- **Auth**: JWT‑based, stateless authentication
- **API Style**: REST (JSON) - the OpenAPI spec is consumed by the frontend via Orval.

Backend root: `backend/`

---

## High‑Level Responsibilities

- **User & Auth**
  - Register customers and store owners.
  - Authenticate via username/password.
  - Issue and validate JWT tokens with user role information.

- **Domain**
  - Model `User`, `Customer`, `Store`, `Product`, `ShoppingCart`, `CartItem`, `Order`, `OrderItem`, `Role`, `OrderStatus`.
  - Implement business rules for cart operations, stock changes, and order creation.

- **API Contract**
  - Expose typed DTOs (`dto` package) for requests and responses.
  - Provide a stable contract for the Orval‑generated frontend client.

- **Operations**
  - Seed development data (customers, stores, products) for local testing.
  - Integrate cleanly with Docker Compose setups (DB only or full stack).

For deeper details:

- See `architecture.md` for packages and layering.
- See `configuration.md` for properties, profiles, and seeding.
- See `api-and-security.md` for endpoints, JWT, and error handling.

