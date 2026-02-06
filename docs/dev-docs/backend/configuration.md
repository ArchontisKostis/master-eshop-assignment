## Configuration & Environments

This document describes:

- Application properties.
- Profiles and seeding.
- Running the backend (Maven and Docker Compose).

Backend root: `backend/`

---

## 1. Application Properties

Main configuration file:

- `backend/src/main/resources/application.properties`

Important properties (simplified):

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/eshop
spring.datasource.username=your_username
spring.datasource.password=your_password

jwt.secret=your-secret-key-min-256-bits
jwt.expiration=86400000
```

These can be overridden via:

- Environment variables.
- JVM system properties.
- Profile‑specific properties files (`application-dev.properties`, etc.), if defined.

---

## 2. Running with Maven

From the `backend/` folder:

```bash
mvn clean install
mvn spring-boot:run
```

- Application URL: `http://localhost:8080`
- Swagger/OpenAPI UI (if enabled): usually `http://localhost:8080/swagger-ui.html`

To run with a specific profile, e.g. `dev`:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

Ensure that:

- PostgreSQL is running and reachable at the configured `spring.datasource.url`.
- Credentials are correct for the target environment.

---

## 3. Running with Docker Compose

At the repository root:

- **Full stack** (database + backend + frontend + pgAdmin):

```bash
docker compose up
```

- **Dev DB only** (you run backend + frontend locally, only DB/pgAdmin in containers):

```bash
docker compose -f docker-compose.dev.yml up
```

Then:

- Start the backend via Maven (see above).
- Start the frontend via `npm run dev` in `frontend/`.

This setup allows:

- Consistent local database configuration.
- Running backend/frontend from the IDE with live reload, while DB and pgAdmin are containerized.

