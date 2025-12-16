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
```

Application will start on `http://localhost:8080`

### Access Swagger UI
Open in browser: `http://localhost:8080/swagger-ui.html`