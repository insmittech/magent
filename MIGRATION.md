# Magnet Vapi Official — Data Migration Guide

This guide details how to migrate from the simulated client-side localStorage database to the production Mongoose database.

---

## 1. Prerequisites
- **Node.js**: v18 or higher installed.
- **MongoDB**: Active MongoDB Atlas cluster or local database instance.
- **Environment config**: Ensure `server/.env` is set with your `MONGODB_URI` string.

---

## 2. Migration Execution (Seeding)

To make it easy to transition, a seeding script has been programmed that populates the MongoDB collections with initial mock categories, products, administrative accounts, and promo banners.

### Run Seeding Script
Execute the following commands in your shell from the project root:

```bash
# Navigate to the server folder
cd server

# Run the DB seed script
npm run seed
```

### Expected Output
Upon running, the script connects to your MongoDB cluster and prints:

```text
Connected to MongoDB for seeding...
Admin user seeded: admin@magnet.com / admin123
Customer user seeded: josh@ecommerce.com / customer123
Categories seeded.
Hero Banners seeded.
Store Settings seeded.
Products seeded.
Database seeding successfully finished!
```

---

## 3. Production Admin Account Credentials

The seeding script generates a default administrative user account:
- **Email**: `admin@magnet.com`
- **Password**: `admin123`
- **Role**: `admin`

Log in via the customer login route inside the storefront using these credentials to get full administrative access.

---

## 4. Frontend LocalStorage Cleanup

The frontend is built to dynamically sync state from the backend API first, falling back to local storage only if the API is offline.
If you need to clear old simulated data from your browser session to test the clean backend connection:
1. Open browser developer console.
2. Run command:
   ```javascript
   localStorage.clear();
   ```
3. Refresh the page to load fresh collections from your Node database API.
