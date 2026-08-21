# Magnet Vapi Official — Product Requirements Document

## 1. Product
**Name:** Magnet Vapi Official Digital Store  
**URL:** https://magnet.insmittech.com  
**Business:** Clothing + mobile accessories retail

Objective: digitize product discovery, customer communication, online ordering, and eventually inventory/physical-store operations.

## 2. Problem
Customers need an easy way to discover products, check availability, contact the store, and order online. Staff need a simple way to manage products, stock, and orders without editing code.

## 3. Users

### Customer
Instagram/local customer browsing or purchasing products.

### Admin
Store owner/authorized staff managing products, stock, categories, and orders.

## 4. MVP Customer Requirements

### Home
Must show:
- Store identity
- Main categories
- Featured/new products
- Offers
- WhatsApp/contact
- Instagram CTA

### Catalog
Customer must:
- Browse products
- Search
- Filter by category
- Sort
- Open product details

### Product Details
Must show:
- Name
- Images
- Price
- Discount
- Availability
- Required variants
- Description
- Add to Cart

### Cart
Customer must:
- Add
- Remove
- Change quantity
- Select required variants
- See totals

### Checkout
Fields:
- Name
- Phone
- Email
- Address
- City
- State
- Pincode

MVP may launch with COD and/or one payment provider.

### Orders
Customer receives confirmation and unique order ID.

## 5. MVP Admin Requirements

### Authentication
Admin must authenticate before management features.

### Product CRUD
Create:
- Add product
- Upload images
- Set price/stock/category/description/variants

Read:
- View/search/filter/sort products

Update:
- Edit product
- Change stock
- Enable/disable

Delete:
- Disable/remove product with confirmation

### Categories
Admin can create, edit, disable/delete, and reorder categories.

### Orders
Admin can view/search orders and change:
- Pending
- Confirmed
- Packed
- Shipped
- Delivered
- Cancelled

## 6. Product Requirements

### Clothing
Support:
- Size
- Color
- Material
- SKU
- Variant stock

### Mobile Accessories
Support:
- Compatible model
- Color
- Connector/specification
- SKU
- Variant stock

Allow additional attributes later.

## 7. Inventory
MVP:
- Stock quantity
- Variant stock
- Low-stock indication
- Out-of-stock handling
- Admin stock adjustment

A zero-stock product/variant must not be purchasable.

## 8. Security
Must:
- Use HTTPS
- Protect admin routes
- Hash passwords
- Validate inputs
- Restrict CORS
- Protect secrets
- Validate server-side prices/stock
- Verify payments
- Validate uploads

## 9. Non-Functional Requirements
- Mobile-first
- Fast load
- Optimized images
- Pagination
- Modular maintainable code
- Modular monolith architecture

## 10. Analytics
MVP should minimally track:
- Product views
- Add-to-cart
- Checkout
- Completed orders

Later:
```text
Visitors -> Product Views -> Add to Cart -> Checkout -> Purchase
```

## 11. Future Requirements
Not MVP:
- POS
- Online/offline inventory sync
- Supplier management
- GST invoices
- Advanced returns/exchanges
- WhatsApp automation
- Customer segmentation
- Loyalty
- Recommendations
- AI search
- Demand forecasting
- Mobile app

## 12. Acceptance Criteria

### Product CRUD
- Admin can create a product.
- Product appears in catalog.
- Admin can edit it.
- Customer sees updates.
- Admin can disable/delete it.
- Disabled product is not purchasable.
- Stock updates affect purchasing.

### Checkout
- Unavailable variants cannot be purchased.
- Server calculates final price.
- Order is created only after validation.
- Order gets a unique ID.
- Stock is updated correctly.

### Security
- Non-admin cannot perform admin operations.
- Customer cannot manipulate product price through client requests.
- Secrets are never exposed to the browser.

## 13. Success Metrics
Primary:
- Product visitors
- Add-to-cart rate
- Checkout rate
- Completed orders
- WhatsApp inquiries
- Store visits generated

Secondary:
- Returning customers
- Best-selling products
- Category performance
- Average order value

## 14. Product Philosophy
Build the smallest system that proves digital commerce is useful.

A feature should be added only when it:
1. Solves a real customer/business problem.
2. Can be measured.
3. Is worth its maintenance cost.

Long term, the goal is a unified digital operating system for the physical and online Magnet business.
