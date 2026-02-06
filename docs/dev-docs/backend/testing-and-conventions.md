## Testing & Conventions

This document covers:

- Test layout and how to run tests.
- Coding conventions and guidelines for new backend code.

Backend root: `backend/`

---

## 1. Testing

### 1.1 Test Layout

Tests live under:

- `backend/src/test/java/uom/eshop/backend`

Key areas:

- `EshopBackendApplicationTests`
  - Basic context‑load / smoke tests.

- `exceptions/GlobalExceptionHandlerTest`
  - Ensures that exceptions are translated into `ApiError` responses correctly.

- `service/*ServiceTest`
  - Focused unit or integration tests for core services:
    - `OrderServiceTest`
    - `ProductServiceTest`
    - `ShoppingCartServiceTest`
    - `UserServiceTest`
    - Others as needed.

### 1.2 Running Tests

From `backend/`:

```bash
mvn test
```

For CI or pre‑commit workflows, this is typically the canonical command.

### 1.3 Adding New Tests

When you add new functionality:

- If it is primarily in a service:
  - Add or extend a test class in `service/`, e.g. `MyNewServiceTest`.
  - Cover both “happy path” and common failure modes (including thrown exceptions).

- If you introduce new exception flows:
  - Extend `GlobalExceptionHandlerTest` or add dedicated tests, ensuring:
    - Correct HTTP status codes.
    - Proper `code` and `message` values in `ApiError`.

Aim to keep **business rules** well covered; controllers should be thin enough that most logic is exercised at the service layer.

---

## 2. Coding Conventions

### 2.1 Layering

- Respect the standard layering:
  - **Controller → Service → Repository → DB**
- Controllers:
  - Handle HTTP concerns (status codes, headers, path variables, etc.).
  - Delegate business logic to services.
- Services:
  - Contain business rules and orchestration.
  - Are typically the main focus of tests.
- Repositories:
  - Are thin data access abstractions, without business logic.

### 2.2 DTOs vs Entities

- Controllers should use **DTOs** (`dto` package) for:
  - Request bodies.
  - Response payloads.
- Entities should:
  - Model only persistence concerns and domain invariants.
  - Not be exposed directly to clients.
- Mapping:
  - Do mapping between DTOs and entities in services or dedicated mapper helpers.

### 2.3 Transactions

- Operations that span multiple database writes (e.g. checkout) should be marked **transactional**:
  - Annotate the service method with `@Transactional`.
- This guarantees:
  - Either all writes succeed, or all are rolled back on failure.

### 2.4 Validation

- Use **Bean Validation** annotations on DTOs when appropriate:
  - e.g. `@NotNull`, `@Size`, `@Email`, etc.
- Combine with:
  - Explicit business checks in services.
  - Domain exceptions when invariants are violated.

### 2.5 Exceptions & Error Handling

- Throw domain‑specific exceptions rather than generic ones.
- Keep exception messages meaningful but not overly detailed (avoid leaking sensitive internals).
- Ensure new exception types are handled in `GlobalExceptionHandler`.

---

## 3. General Guidelines

- Keep methods small and focused; prefer composition in services over large “god methods”.
- Avoid tight coupling between controllers and persistence; use services as the integration point.
- Align naming between:
  - DTOs.
  - Entities.
  - API endpoints.
  - Frontend types (generated via Orval), to keep mental mapping simple.
- Document non‑obvious behavior and business rules either in:
  - Service Javadoc, or
  - The developer docs (`architecture.md`, etc.).

Following these practices keeps the backend robust, maintainable, and in sync with the frontend and documentation.

