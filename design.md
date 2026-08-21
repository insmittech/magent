# Magnet Vapi Official — Design

## Product Goal
Create a trustworthy, mobile-first digital storefront that converts Instagram/local traffic into product discovery, WhatsApp conversations, store visits, and online orders.

Reference: https://www.instagram.com/magnet_vapi_officialll/

Do not scrape or automatically copy Instagram content.

## Visual Direction
- Clean
- Modern
- Youthful
- Product-focused
- Premium but approachable
- Mobile-first
- Fast
- Strong photography

Use a neutral base plus one configurable brand accent. Keep brand colors centralized.

## Customer Navigation
Desktop:
```text
Logo | Home | Shop | Categories | New Arrivals | Best Sellers | About
Search | Wishlist | Account | Cart
```

Mobile:
```text
Home | Shop | Categories | Wishlist | Account
```

Keep Cart visible with a badge.

## Homepage
1. Announcement bar
2. Header
3. Hero/offer
4. Shop by category
5. Trending products
6. New arrivals
7. Clothing collection
8. Mobile accessories
9. Offers
10. Why choose us
11. Reviews
12. Instagram CTA
13. WhatsApp CTA
14. Footer

Avoid unnecessary sections.

## Shop
- Search
- Category filter
- Price filter
- Availability
- Sort
- Pagination

Desktop: filter sidebar + product grid.  
Mobile: filter drawer + two-column grid.

## Product Card
Show image, name, price, discount, rating when available, stock status, wishlist, add to cart.

## Product Page
Above fold:
- Gallery
- Title
- Price/discount
- Stock
- Required variants
- Quantity
- Add to Cart
- Buy Now

Below:
- Description
- Specifications
- Delivery
- Returns
- Reviews
- Related products

Mobile gets sticky purchase actions.

## Clothing UX
Prioritize:
- Size
- Color
- Material
- Fit
- Size guide
- Multiple photos
- Model photography

## Mobile Accessories UX
Prioritize:
- Compatible model
- Connector
- Wattage/power
- Color
- Warranty where applicable

Compatibility must be obvious before purchase.

## Cart & Checkout
Keep checkout short:
- Name
- Phone
- Email
- Address
- City
- State
- Pincode
- Notes

Prioritize COD and relevant Indian payment options.

## Trust
Display:
- Secure payment
- Return policy
- Delivery information
- Store location
- Phone
- WhatsApp
- Reviews
- Store pickup if offered

## Admin
Professional business dashboard:
```text
Sidebar: Dashboard / Products / Categories / Inventory / Orders /
Customers / Coupons / Reviews / Settings
Top bar: Search / Notifications / Admin
Main: KPIs / Charts / Tables
```

Product table:
```text
Image | Product | Category | Price | Stock | Status | Actions
```

Actions: View, Edit, Disable, Delete.

Add/Edit sections:
1. Basic information
2. Images
3. Pricing
4. Inventory
5. Variants
6. Specifications
7. SEO
8. Visibility

Use delete confirmation; prefer disable/soft-delete when recovery is useful.

## Responsive
Support 320px, 375px, 425px, 768px, 1024px, 1440px+.

Instagram traffic makes mobile performance a priority.

## Accessibility
Keyboard access, visible focus, semantic HTML, alt text, contrast, clear form errors, large touch targets.

## Performance
Lazy images, WebP/AVIF where supported, compression, pagination, minimal API calls, skeleton loading.

## Avoid
Excessive gradients, excessive animation, huge text, cluttered navigation, tiny mobile buttons, fake reviews, fake business claims, stock photos presented as real inventory.
