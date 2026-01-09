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

## API Endpoints

### Authentication (2 endpoints)
- `POST /api/auth/register` - Register customer or store
- `POST /api/auth/login` - Login and receive JWT token

### Products (7 endpoints)
- `POST /api/products` - Create product (STORE)
- `PUT /api/products/{id}` - Update product (STORE)
- `PATCH /api/products/{id}/stock` - Update stock (STORE)
- `DELETE /api/products/{id}` - Delete product (STORE)
- `GET /api/products/store` - List store products (STORE)
- `GET /api/products/search` - Search products (PUBLIC)
- `GET /api/products/{id}` - Get product details (PUBLIC)

### Shopping Cart (4 endpoints)
- `POST /api/cart/items` - Add to cart (CUSTOMER)
- `GET /api/cart` - View cart (CUSTOMER)
- `PUT /api/cart/items/{productId}` - Update quantity (CUSTOMER)
- `DELETE /api/cart/items/{productId}` - Remove from cart (CUSTOMER)

### Orders (4 endpoints)
- `POST /api/orders` - Complete purchase (CUSTOMER)
- `GET /api/orders` - View customer orders (CUSTOMER)
- `GET /api/orders/store` - View store orders (STORE)
- `GET /api/orders/{id}` - Get order details (CUSTOMER/STORE)

**Total: 17 endpoints**

## Architecture

### Domain Model
```
User (authentication)
  ↓ OneToOne
Customer OR Store (profile)
  ↓
Customer → ShoppingCart → CartItems → Products
Store → Products
Customer + Store → Orders → OrderItems → Products
```

### Technology Stack
- **Framework**: Spring Boot 4.0.0
- **Security**: Spring Security + JWT
- **Database**: Spring Data JPA + PostgreSQL
- **Validation**: Jakarta Validation
- **Documentation**: SpringDoc OpenAPI 3.0
- **Java**: 17

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

**To seed the database:**

1. **Using Maven command:**
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=dev
   ```

2. **Or set profile in application.properties:**
   ```properties
   spring.profiles.active=dev
   ```

3. **Or using environment variable:**
   ```bash
   export SPRING_PROFILES_ACTIVE=dev
   mvn spring-boot:run
   ```

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