# Nexus API Documentation

A marketplace API for browsing products, managing shops, and handling orders.

## Quick Navigation

- [🛍️ Shopping Experience](#shopping-experience) - Browse products and manage cart
- [📦 Order Management](#order-management) - Place and track orders  
- [🏪 Shop Management](#shop-management) - Manage your shop and inventory
- [👤 User Setup](#user-setup) - Initial user and shop creation
- [🔧 Utilities](#utilities) - Health checks and testing

---

## 🛍️ Shopping Experience

### Browse Products
```http
GET /products
```
**Purpose:** Browse all available products across the marketplace  
**Auth:** Not required  
**Query Parameters:**
- `page` - Page number for pagination
- `limit` - Items per page  
- `category` - Filter by product category
- `minPrice` / `maxPrice` - Price range filtering
- `search` - Search product names/descriptions

**Response:**
```json
{
  "products": [
    {
      "id": "uuid",
      "name": "Product Name",
      "description": "Product description",
      "price": 29.99,
      "stock": 100,
      "category": "Electronics"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalProducts": 50,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### Cart Management

#### Get Current Cart
```http
GET /carts
```
**Purpose:** View current cart contents and total  
**Auth:** Not required

**Response:**
```json
{
  "cart": [
    {
      "id": "product-uuid",
      "name": "Product Name", 
      "price": 29.99,
      "quantity": 2,
      "subtotal": 59.98
    }
  ],
  "cartTotal": 59.98
}
```

#### Add to Cart
```http
POST /carts
```
**Purpose:** Add a product to the shopping cart  
**Auth:** Not required  
**Body:**
```json
{
  "id": "product-uuid",
  "quantity": 2
}
```

#### Update Cart Item
```http
PUT /carts/:productId
```
**Purpose:** Change quantity of an item in cart  
**Auth:** Not required  
**Body:**
```json
{
  "quantity": 3
}
```

#### Remove from Cart
```http
DELETE /carts/:productId
```
**Purpose:** Remove an item completely from cart  
**Auth:** Not required

---

## 📦 Order Management

### Place Order
```http
POST /users/orders
```
**Purpose:** Convert current cart into an order  
**Auth:** Required  
**Body:** None (uses current cart)

**Success Response:**
```json
{
  "success": true,
  "orderId": "order-uuid",
  "message": "Order created successfully"
}
```

**Common Errors:**
- `"Cart cannot be empty"` - Add items to cart first
- `"Insufficient stock for product <name>"` - Product out of stock

### View My Orders
```http
GET /users/orders
```
**Purpose:** Get all orders placed by the current user  
**Auth:** Required

**Response:**
```json
{
  "orders": [
    {
      "id": "order-uuid",
      "status": "pending",
      "total": 59.98,
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-15T10:30:00Z",
      "ShopId":"shop-uuid",
      "UserId":"user-uuid"
    }
  ]
}
```

### View Order Details
```http
GET /users/orders/:orderId
```
**Purpose:** Get detailed information about a specific order  
**Auth:** Required

**Response:**
```json
{
  "order": {
    "id": "order-uuid",
    "status": "pending",
    "total": 59.98,
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-15T10:30:00Z",
    "ShopId":"shop-uuid",
    "UserId":"user-uuid"
  },
  "products": [
    {
      "id": "product-uuid",
      "name": "Product Name",
      "quantity": 2,
      "priceAtTime": 29.99
    }
  ]
}
```

---

## 🏪 Shop Management

### Inventory Management

#### View My Products
```http
GET /shops/products
```
**Purpose:** Get all products in your shop  
**Auth:** Required  
**Query Parameters:** Same as global product browsing

#### Get Single Product
```http
GET /shops/products/:productId
```
**Purpose:** Get details of one of your products  
**Auth:** Required

#### Add New Product
```http
POST /shops/products
```
**Purpose:** Create a new product in your shop  
**Auth:** Required  
**Body:**
```json
{
  "product": {
    "name": "New Product",
    "description": "Product description",
    "price": 29.99,
    "stock": 100,
    "category": "Electronics"
  }
}
```

#### Update Product
```http
PUT /shops/products/:productId
```
**Purpose:** Edit an existing product  
**Auth:** Required  
**Body:** Same as create product

#### Delete Product
```http
DELETE /shops/products/:productId
```
**Purpose:** Remove a product from your shop  
**Auth:** Required

### Shop Settings

#### Update Shop Info
```http
PUT /shops
```
**Purpose:** Update your shop's name and description  
**Auth:** Required  
**Body:**
```json
{
  "shop": {
    "name": "My Awesome Shop",
    "description": "We sell the best products!"
  }
}
```

### Order Fulfillment

#### View Shop Orders
```http
GET /shops/orders
```
**Purpose:** See all orders placed at your shop  
**Auth:** Required

**Response:**
```json
{
  "orders": [
    {
      "id": "order-uuid",
      "status": "pending",
      "total": 59.98,
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-15T10:30:00Z",
      "ShopId":"shop-uuid",
      "UserId":"user-uuid"
    }
  ]
}
```

#### View Order Details
```http
GET /shops/orders/:orderId
```
**Purpose:** Get detailed information about an order at your shop  
**Auth:** Required

#### Update Order Status
```http
PUT /shops/orders/:orderId
```
**Purpose:** Update the fulfillment status of an order  
**Auth:** Required  
**Body:**
```json
{
  "status": "shipped"
}
```

**Common Statuses:** `pending`, `processing`, `shipped`, `delivered`, `cancelled`

---

## 👤 User Setup

### Initialize User & Shop
```http
POST /users
```
**Purpose:** Create user profile and associated shop (first-time setup)  
**Auth:** Required  
**Body:**
```json
{
  "user": {
    "sub": "auth0-user-id",
    "name": "John Doe"
  }
}
```

**Response:**
```json
{
  "user": {
    "id": "user-uuid",
    "username": "john_doe"
  },
  "userShop": {
    "id": "shop-uuid", 
    "name": "John's Shop",
    "description": "My marketplace shop"
  }
}
```

---

## 🔧 Utilities

### Health Check
```http
GET /
```
**Purpose:** Test API connectivity and authentication  
**Auth:** Required

**Response:**
```json
{
  "message": "Correctly authenticated app!"
}
```

---

## Authentication

Most endpoints require JWT authentication. Include your token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

All endpoints return consistent error responses:
```json
{
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created successfully  
- `400` - Bad request (validation error)
- `401` - Unauthorized (missing/invalid auth)
- `404` - Resource not found
- `500` - Internal server error