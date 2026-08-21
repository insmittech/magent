# Magnet Vapi Official — REST API Documentation

The backend service runs a Node/Express API server exposing the REST endpoints listed below. All request and response bodies use JSON format.

---

## 1. Authentication (`/api/auth`)

### Register Customer/Admin
- **Endpoint**: `POST /api/auth/register`
- **Request Body**:
  ```json
  {
    "name": "QA User",
    "phone": "9999988888",
    "email": "qa@test.com",
    "password": "securepassword123"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "64dfac23...",
      "name": "QA User",
      "email": "qa@test.com",
      "phone": "9999988888",
      "role": "customer",
      "addresses": [],
      "wishlist": []
    }
  }
  ```

### Login
- **Endpoint**: `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "qa@test.com",
    "password": "securepassword123"
  }
  ```
- **Response (200 OK)**: Returns JWT token and user profile model.

### Get Current User Profile
- **Endpoint**: `GET /api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**: Returns current user's profile details.

---

## 2. Products Catalog (`/api/products`)

### List Products
- **Endpoint**: `GET /api/products`
- **Query Params**:
  - `category`: Filter by category slug (e.g. `clothing`)
  - `search`: Match text pattern in name, brand, or SKU
  - `activeOnly`: Load only active items (`true` / `false`)
- **Response (200 OK)**: Array of product models.

### Get Product Details
- **Endpoint**: `GET /api/products/:id`
- **Response (200 OK)**: Single product document.

### Create Product (Admin Only)
- **Endpoint**: `POST /api/products`
- **Headers**: `Authorization: Bearer <token>` (Admin required)
- **Content-Type**: `multipart/form-data`
- **Body Params**: Includes name, brand, price, sku, category, variants (JSON string), specifications (JSON string), and file field `image`.
- **Response (210 Created)**: Created product model.

### Update Product (Admin Only)
- **Endpoint**: `PUT /api/products/:id`
- **Headers**: `Authorization: Bearer <token>` (Admin required)
- **Content-Type**: `multipart/form-data`
- **Response (200 OK)**: Updated product document.

### Delete Product (Admin Only)
- **Endpoint**: `DELETE /api/products/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**: Success confirmation.

---

## 3. Categories Management (`/api/categories`)

### List Categories
- **Endpoint**: `GET /api/categories`
- **Response (200 OK)**: Category list sorted by `sortOrder`.

### Create Category (Admin Only)
- **Endpoint**: `POST /api/categories`
- **Response (201 Created)**: Created category model.

### Update Category (Admin Only)
- **Endpoint**: `PUT /api/categories/:id`
- **Response (200 OK)**: Updated category.

### Delete Category (Admin Only)
- **Endpoint**: `DELETE /api/categories/:id`
- **Response (200 OK)**: Confirmation.

---

## 4. User Profiles & Wishlists (`/api/users`)

### Save Address
- **Endpoint**: `POST /api/users/addresses`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "id": "adr-optional-for-edit",
    "name": "Josh",
    "type": "Home",
    "address": "B-102 Silicon Greens",
    "city": "Vapi",
    "state": "Gujarat",
    "pincode": "396191",
    "phone": "9876543210",
    "isDefault": true
  }
  ```
- **Response (200 OK)**: Array of updated address documents.

### Delete Address
- **Endpoint**: `DELETE /api/users/addresses/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**: Updated address list.

### Toggle Wishlist Product
- **Endpoint**: `POST /api/users/wishlist/:productId`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**: Array of populated products in customer wishlist.

---

## 5. Orders Processing (`/api/orders`)

### Place Order
- **Endpoint**: `POST /api/orders`
- **Headers**: `Authorization: Bearer <token>` (Optional - links order to profile if present)
- **Request Body**:
  ```json
  {
    "customer": {
      "name": "Josh",
      "phone": "9876543210",
      "email": "josh@test.com",
      "address": "123 Street",
      "city": "Vapi",
      "state": "Gujarat",
      "pincode": "396191"
    },
    "items": [
      {
        "productId": "64dfac2...",
        "quantity": 1,
        "variant": { "size": "M", "color": "Black" }
      }
    ],
    "paymentMethod": "COD"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "orderId": "MGT-7481",
    "order": { ... }
  }
  ```

### Get My Orders
- **Endpoint**: `GET /api/orders/my`
- **Headers**: `Authorization: Bearer <token>` (Or pass query parameter `phone` for guest orders)
- **Response (200 OK)**: List of matching customer orders.

### Get Admin Orders (Admin Only)
- **Endpoint**: `GET /api/orders/admin`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**: Complete orders list.

### Update Order Status (Admin Only)
- **Endpoint**: `PUT /api/orders/admin/:id/status`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "status": "Shipped",
    "paymentStatus": "Paid"
  }
  ```
- **Response (200 OK)**: Updated order.

---

## 6. Payments Integration (`/api/payments`)

### Create Razorpay Payment Order
- **Endpoint**: `POST /api/payments/razorpay/order`
- **Request Body**: `{"amount": 1499}`
- **Response (200 OK)**: Razorpay order model with `id` and `amount`.

### Verify Razorpay Payment Signature
- **Endpoint**: `POST /api/payments/razorpay/verify`
- **Request Body**:
  ```json
  {
    "orderId": "MGT-7481",
    "razorpayOrderId": "order_mock_...",
    "razorpayPaymentId": "pay_...",
    "razorpaySignature": "secure_hash..."
  }
  ```
- **Response (200 OK)**: Verification success confirmation.

---

## 7. Banners Config (`/api/banners`)

### Get Banners
- **Endpoint**: `GET /api/banners`
- **Response (200 OK)**: Active banners array.

---

## 8. Store Settings (`/api/settings`)

### Get Settings
- **Endpoint**: `GET /api/settings`
- **Response (200 OK)**: Store setting configurations object.
