# Nexus API

## Table of Contents

- [Nexus API](#nexus-api)
  - [Table of Contents](#table-of-contents)
  - [Users Routes (`/users`)](#users-routes-users)
  - [Shops Routes (`/shops`)](#shops-routes-shops)
  - [Products Routes (`/products`)](#products-routes-products)
  - [Carts Routes (`/carts`)](#carts-routes-carts)
  - [Root Route (`/`)](#root-route-)

---

## Users Routes (`/users`)

| Method | Endpoint         | Description                                         | Auth Required | Body / Params                  |
|--------|------------------|-----------------------------------------------------|---------------|--------------------------------|
| POST   | `/`              | Get or create user metadata and shop. Returns user and shop info. | ✅            | `{ user: { sub, name } }`      |
| GET    | `/orders`        | Get all orders for the user.                        | ✅            | -                              |
| GET    | `/orders/:orderId` | Get a single order for the user.                  | ✅            | `orderId` (URL param)          |
| POST   | `/orders`        | Place an order for the current cart.                | ✅            | -                              |

**POST `/users` Success Response (200):**
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
**GET `/users/orders` Success Response (200):**
```json
{
  "orders": [ /* array of order objects */ ]
}
```
**GET `/users/orders/:orderId` Success Response (200):**
```json
{
  "order": { /* order object */ },
  "products": [ /* array of product objects with quantity and priceAtTime */ ]
}
```
**POST `/users/orders` Success Response (201):**
```json
{
  "success": true,
  "orderId": "uuid",
  "message": "Order created successfully"
}
```
**Error Responses:**
```json
{ "message": "Internal server error" }
```
```json
{ "message": "No orders have been placed." }
```
```json
{ "message": "Order doesn't exist" }
```
```json
{ "message": "Cart cannot be empty" }
```
```json
{ "message": "Insufficient stock for product <productName>" }
```

---

## Shops Routes (`/shops`)

| Method | Endpoint                       | Description                                              | Auth Required | Body / Params                                 |
|--------|------------------------------- |----------------------------------------------------------|---------------|-----------------------------------------------|
| GET    | `/products`                    | Get all products for the authenticated user's shop (with pagination and filters). | ✅            | Query: `page`, `limit`, `category`, `minPrice`, `maxPrice`, `search` |
| GET    | `/products/:productId`         | Get a single product by ID from the user's shop.         | ✅            | `productId` (URL param)                       |
| POST   | `/products`                    | Create a new product in the user's shop.                 | ✅            | `{ product: { name, description, price, stock, category } }` |
| PUT    | `/products/:productId`         | Update a product in the user's shop.                     | ✅            | `{ product: { name, description, price, stock, category } }`, `productId` (URL param) |
| DELETE | `/products/:productId`         | Delete a product from the user's shop.                   | ✅            | `productId` (URL param)                       |
| PUT    | `/`                            | Update shop metadata (name, description).                | ✅            | `{ shop: { name, description } }`             |
| GET    | `/orders`                      | Get all orders for the shop.                             | ✅            | -                                             |
| GET    | `/orders/:orderId`             | Get a single order for the shop.                         | ✅            | `orderId` (URL param)                         |
| PUT    | `/orders/:orderId`             | Update the status of an order for the shop.              | ✅            | `{ status: "newStatus" }`, `orderId` (URL param) |

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
**GET `/shops/products/:productId` Success Response (200):**
```json
{
  "product": { /* product object */ }
}
```
**POST `/shops/products` Success Response (201):**
```json
{
  "product": {
    "id": "uuid",
    "name": "string",
    "description": "string",
    "category": "string",
    "price": 0,
    "stock": 0
  }
}
```
**PUT `/shops/products/:productId` Success Response (201):**
```json
{
  "product": { /* updated product object */ }
}
```
**DELETE `/shops/products/:productId` Success Response (200):**
```json
{ "message": "Product deleted" }
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
**GET `/shops/orders` Success Response (200):**
```json
{
  "orders": [ /* array of order objects */ ]
}
```
**GET `/shops/orders/:orderId` Success Response (200):**
```json
{
  "order": { /* order object with products */ }
}
```
**PUT `/shops/orders/:orderId` Success Response (200):**
```json
{
  "order": { /* updated order object */ }
}
```
**Error Responses:**
```json
{ "message": "Internal server error" }
```
```json
{ "message": "User not found" }
```
```json
{ "message": "Shop not found" }
```
```json
{ "message": "No orders have been placed." }
```
```json
{ "message": "Order not found" }
```
```json
{ "message": "Shop doesn't exist" }
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
| POST   | `/`              | Add a product to the cart.         | ❌            | `{ id, quantity }`    |
| PUT    | `/:productId`    | Edit quantity of a product in cart.| ❌            | `{ quantity }`, `productId` (URL param) |
| DELETE | `/:productId`    | Remove a product from the cart.    | ❌            | `productId` (URL param)      |

**GET `/carts` Success Response (200):**
```json
{
  "cart": [ /* array of cart items with details */ ],
  "cartTotal": 123.45
}
```
**POST `/carts` Success Response (200):**
```json
{
  "cart": [ /* updated array of cart items */ ]
}
```
**PUT `/carts/:productId` Success Response (200):**
```json
{
  "message": "Cart item updated successfully",
  "updatedCartItem": { /* updated cart item */ },
  "cart": [ /* updated array of cart items */ ]
}
```
**DELETE `/carts/:productId` Success Response (200):**
```json
{
  "message": "Product removed from cart successfully",
  "removedProduct": { /* removed product */ },
  "cart": [ /* updated array of cart items */ ]
}
```
**Error Responses:**
```json
{ "message": "Invalid product id" }
```
```json
{ "message": "Product not found in cart" }
```
```json
{ "message": "Cart is empty" }
```
```json
{ "message": "Quantity must be greater than zero" }
```
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
- Pagination and filtering are available on product listing endpoints via query parameters.