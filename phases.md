# Magnet Vapi Official — Development Phases

## Strategy
Do not build a Shopify competitor. Prove that a digital storefront increases sales and improves operations, then expand.

## Phase 0 — Validation
Goal: prove customers will use the digital storefront.

Work:
- Confirm real categories
- Collect 10–30 real products
- Get real images
- Confirm prices/stock
- Define delivery area
- Confirm payment preference
- Confirm return/exchange policy
- Confirm real contact details
- Define Instagram-to-website journey

Success:
- Product visits
- WhatsApp inquiries
- Store visits
- Add-to-cart activity
- Real orders

## Phase 1 — True MVP
Goal: launch a usable digital shop.

Customer:
- Home
- Categories
- Product listing/details
- Search
- Cart
- Checkout
- COD or one payment method
- Order confirmation
- WhatsApp CTA

Admin:
- Login
- Add/edit/disable/delete product
- Update stock
- Manage categories
- View/update orders

Product:
- Name
- Images
- Category
- Price
- Discount
- Stock
- SKU
- Description
- Basic variants

Expected solo-dev effort: roughly 3–5 weeks part-time depending on polish, payments, and deployment.

Do not build AI, POS, advanced analytics, advanced returns, multi-vendor, mobile app, or microservices yet.

## Phase 2 — Operational Digital Store
Add:
- Customer accounts
- Order history
- Wishlist
- Reviews
- Coupons
- Better inventory
- Low-stock alerts
- Sales dashboard
- Product analytics
- Store pickup
- Local delivery
- WhatsApp notifications

Success: business can manage most online operations without spreadsheets.

## Phase 3 — Physical Store Integration
Add:
- POS
- Barcode scanning
- Central inventory
- Inventory movements
- Purchase records
- Supplier management
- Stock adjustments
- Returns/exchanges
- GST invoices

Architecture:
```text
Physical POS ─┐
              ├──> Central Inventory ──> Website
Online Orders ┘
```

## Phase 4 — Growth & Automation
Add:
- Abandoned-cart recovery
- WhatsApp automation
- Email/SMS
- Customer segmentation
- Repeat-customer offers
- Recommendations
- Frequently bought together
- Marketing attribution

Measure:
```text
Visitor -> Product View -> Add to Cart -> Checkout -> Purchase
```

## Phase 5 — Smart Commerce
Only after enough real data:
- AI product search
- Recommendations
- Sales/demand forecasting
- Customer support assistant
- Personalized offers

AI must solve a demonstrated problem.

## Phase 6 — Scale
Only when justified:
- Background jobs
- Queues
- Caching
- CDN
- Advanced observability
- Service separation

Do not introduce microservices just because the app grows.

## Phase Priorities
| Phase | Objective |
|---|---|
| 0 | Validate demand |
| 1 | Launch storefront |
| 2 | Improve operations |
| 3 | Unify physical + online inventory |
| 4 | Increase conversion/repeat sales |
| 5 | Add intelligence |
| 6 | Scale |

Every phase must answer: what business problem is solved and how is success measured?
