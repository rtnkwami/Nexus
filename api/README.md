# Nexus API

## Table of Contents

- [Nexus API](#nexus-api)
  - [Table of Contents](#table-of-contents)
  - [Users Routes (`/users`)](#users-routes-users)
  - [Shops Routes (`/shops`)](#shops-routes-shops)
  - [Products Routes (`/products`)](#products-routes-products)
  - [Carts Routes (`/carts`)](#carts-routes-carts)
  - [Orders Routes (`/orders`)](#orders-routes-orders)
  - [Root Route (`/`)](#root-route-)

---

## Users Routes (`/users`)

| Method | Endpoint      | Description                   | Auth Required | Body / Params         |
|--------|--------------|-------------------------------|---------------|-----------------------|
| POST   | `/`          | Get or create user metadata and shop. Returns user and shop info. | ✅            | `{ user: { sub, name } }` |

**Success Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "username": "string"
  },
  "userShop": {
    "id": "uuid",
    "name": "string",
    "description": "string"
  }
}
```
**Error Response (500):**
```json
{ "message": "Internal server error" }
```

---

## Shops Routes (`/shops`)

| Method | Endpoint                  | Description                                   | Auth Required | Body / Params         |
|--------|---------------------------|-----------------------------------------------|---------------|-----------------------|
| GET    | `/products`               | Get all products for the authenticated user's shop (with pagination and filters). | ✅            | Query: `page`, `limit`, `category`, `minPrice`, `maxPrice`, `search` |
| GET    | `/products/:productId`    | Get a single product by ID from the user's shop. | ✅            | `productId` (URL param) |
| POST   | `/products`               | Create a new product in the user's shop.      | ✅            | `{ product: { name, description, price, stock, category } }` |
| PUT    | `/products/:productId`    | Update a product in the user's shop.          | ✅            | `{ product: { name, description, price, stock, category } }`, `productId` (URL param) |
| DELETE | `/products/:productId`    | Delete a product from the user's shop.        | ✅            | `productId` (URL param) |
| PUT    | `/`                       | Update shop metadata (name, description).     | ✅            | `{ shop: { name, description } }` |

**GET `/shops/products` Success Response (200):**
```json
{
  "products": [ /* array of product objects */ ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalProducts": 50,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```
**Error Response (500):**
```json
{ "message": "Internal server error" }
```

**PUT `/shops` Success Response (201):**
```json
{
  "userShop": {
    "id": "uuid",
    "name": "string",
    "description": "string"
  }
}
```

---

## Products Routes (`/products`)

| Method | Endpoint | Description                                   | Auth Required | Query Params                  |
|--------|----------|-----------------------------------------------|---------------|-------------------------------|
| GET    | `/`      | Get all products (with pagination and filters). | ❌            | `page`, `limit`, `category`, `minPrice`, `maxPrice`, `search` |

**Success Response (200):**
```json
{
  "products": [ /* array of product objects */ ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalProducts": 50,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```
**Error Response (500):**
```json
{ "message": "Internal server error" }
```

---

## Carts Routes (`/carts`)

| Method | Endpoint         | Description                       | Auth Required | Body / Params         |
|--------|------------------|-----------------------------------|---------------|-----------------------|
| GET    | `/`              | Get current cart with details.     | ❌            | -                     |
| POST   | `/items`         | Add a product to the cart.         | ❌            | `{ id, quantity }`    |
| DELETE | `/items/:id`     | Remove a product from the cart.    | ❌            | `id` (URL param)      |
| POST   | `/checkout`      | Place an order for the cart items. | ✅            | -                     |

**GET `/carts` Success Response (200):**
```json
{
  "cart": [ /* array of cart items */ ],
  "cartTotal": 123.45
}
```
**POST `/carts/items` Success Response (200):**
```json
{
  "cart": [ /* updated array of cart items */ ]
}
```
**DELETE `/carts/items/:id` Success Response (200):**
```json
{
  "cart": [ /* updated array of cart items */ ]
}
```
**POST `/carts/checkout` Success Response (201):**
```json
{
  "order": { /* order details */ }
}
```
**Error Response (500):**
```json
{ "message": "Internal server error" }
```

---

## Orders Routes (`/orders`)

| Method | Endpoint | Description                       | Auth Required | Body / Params         |
|--------|----------|-----------------------------------|---------------|-----------------------|
| GET    | `/`      | Get all orders for the user.      | ✅            | -                     |

**Success Response (200):**
```json
{
  "orders": [ /* array of order objects */ ]
}
```
**Error Response (404):**
```json
{ "message": "No orders have been placed." }
```
**Error Response (500):**
```json
{ "message": "Internal server error" }
```

---

## Root Route (`/`)

| Method | Endpoint | Description                       | Auth Required | Body / Params         |
|--------|----------|-----------------------------------|---------------|-----------------------|
| GET    | `/`      | Test route, returns auth payload. | ✅            | -                     |

**Success Response (200):**
```json
{
  "message": "Correctly authenticated app!"
}
```

---

**Notes:**
- ✅ = Requires JWT authentication
- All endpoints expect and return JSON.
- Pagination and filtering are available on product listing endpoints