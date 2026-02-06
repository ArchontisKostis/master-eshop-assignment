# Master E-Shop Assignment

A full-stack e-commerce application with Spring Boot backend and React frontend.

## Running with Docker

Start the entire application (database, backend, and frontend) with one command:

```bash
docker compose up
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **pgAdmin**: http://localhost:8088

To stop the application:
```bash
docker compose down
```

To rebuild after code changes:
```bash
docker compose up --build
```

### Development Mode

For local development, use [`docker-compose.dev.yml`](docker-compose.dev.yml) which runs only the database and pgAdmin:

```bash
docker compose -f docker-compose.dev.yml up
```

This allows to run the backend and frontend locally while using the containerized database.

## Services

- **PostgreSQL**: Database on port 5435
- **Spring Boot**: Backend API on port 8080
- **React + Nginx**: Frontend on port 3000
- **pgAdmin**: Database management on port 8088

## Project Structure

- [`/backend`](backend/) - Spring Boot REST API
- [`/frontend`](frontend/) - React + Vite application
- [`docker-compose.yml`](docker-compose.yml) - Full stack Docker orchestration
- [`docker-compose.dev.yml`](docker-compose.dev.yml) - Development mode (DB only)

## Backend Seeding
When running the application we have set up automatic seeding that fills the db with customers, stores and products data.
See backend's readme for more info.
