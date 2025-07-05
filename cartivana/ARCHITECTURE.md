# Cartivana Project Architecture & Feature Summary

## High-Level Architecture Diagram

```mermaid
architecture-beta
    group frontend(cloud)[Frontend]
    group backend(server)[Backend]
    group db(database)[Database]

    service userUI(cloud)[User UI] in frontend
    service adminUI(cloud)[Admin UI] in frontend
    service supplierUI(cloud)[Supplier UI] in frontend

    service api(server)[Node.js/Express API] in backend
    service auth(server)[Auth & JWT] in backend
    service product(server)[Product Service] in backend
    service order(server)[Order Service] in backend
    service cart(server)[Cart Service] in backend
    service admin(server)[Admin Service] in backend
    service supplier(server)[Supplier Service] in backend
    service upload(server)[Upload Service] in backend

    service users(database)[Users] in db
    service products(database)[Products] in db
    service orders(database)[Orders] in db
    service carts(database)[Carts] in db

    userUI:B -- T:api
    adminUI:B -- T:api
    supplierUI:B -- T:api
    api:B -- T:auth
    api:B -- T:product
    api:B -- T:order
    api:B -- T:cart
    api:B -- T:admin
    api:B -- T:supplier
    api:B -- T:upload
    auth:B -- T:users
    product:B -- T:products
    order:B -- T:orders
    cart:B -- T:carts
    admin:B -- T:users
    admin:B -- T:orders
    supplier:B -- T:products
    supplier:B -- T:orders
```

---

## Feature Summary

### 1. Authentication & User Management
- Handles registration, login, JWT authentication, and user roles (customer, supplier, admin).
- Frontend: Auth forms, guards, profile management.
- Backend: Auth routes/controllers, user model, role-based middleware.

### 2. Product Catalog
- Public product browsing, search, and filtering.
- Admin/supplier product management, approval, and featuring.
- Image upload support.

### 3. Cart & Checkout
- Customers can add/update/remove products in cart.
- Secure checkout and order placement.
- Cart persists in DB and is user-specific.

### 4. Order Management
- Users see order history and details.
- Admins/suppliers manage and update orders.
- Order status workflow (pending, confirmed, shipped, delivered, cancelled).

### 5. Admin Features
- Dashboard with stats and analytics.
- User, product, and order management.
- Role management and product approval.

### 6. Supplier Features
- Supplier dashboard with product/order stats.
- Manage own products and view order trends.

### 7. Shared Components & Utilities
- Navbar, footer, spinner, guards, interceptors, centralized models.
- Backend: error handler, token utility, config, role middleware.

### 8. API & Middleware
- RESTful API structure, protected endpoints, error handling, CORS, environment config.

---

**This document provides a foundation for onboarding, architecture discussions, and future improvements.**
