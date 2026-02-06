# E-Shop Backend System

A complete e-shop backend system built with Spring Boot, featuring multi-vendor support, JWT authentication, and comprehensive product management.

## Features

### Core Functionality
- **User Management**: Customer and Store registration with JWT authentication
- **Product Management**: Full CRUD operations for store products
- **Product Search**: Advanced filtering by title, type, brand, price, and store
- **Shopping Cart**: Add, update, remove items with stock validation
- **Order Processing**: Multi-store checkout with automatic stock updates
- **Order History**: View orders for customers and stores

### Key Highlights
- **Multi-Vendor**: Separate orders created per store
- **Stock Management**: Real-time inventory tracking and validation
- **Role-Based Security**: CUSTOMER and STORE permissions
- **Dynamic Search**: Flexible product filtering
- **Transaction Safety**: Atomic operations with rollback

## Getting Started

### Prerequisites
- Java 17 or higher
- PostgreSQL database
- Maven 3.6+

### Configuration

Update `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/eshop
spring.datasource.username=your_username
spring.datasource.password=your_password

jwt.secret=your-secret-key-min-256-bits
jwt.expiration=86400000
```

### Build & Run

```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run

# Run with database seeding (dev/demo profile)
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

Application will start on `http://localhost:8080`

### Database Seeding

For development and demo purposes, the application includes a database seeder that populates the database with sample data.

Seeding is done automatically when the application starts.

The seeder will automatically:
- Create 3 sample customers with shopping carts
- Create 3 sample stores
- Create 15 sample products (5 per store) across different categories

**Test Credentials:**
- **Customers:**
  - `john_doe` / `password123`
  - `jane_smith` / `password123`
  - `bob_wilson` / `password123`
- **Stores:**
  - `tech_store` / `password123`
  - `fashion_boutique` / `password123`
  - `home_depot` / `password123`

**Note:** The seeder only runs if the database is empty. To re-seed, you'll need to clear the database first (or change `spring.jpa.hibernate.ddl-auto` to `create-drop` temporarily).

### Access Swagger UI
Open in browser: `http://localhost:8080/swagger-ui.html`