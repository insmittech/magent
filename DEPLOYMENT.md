# Magnet Vapi Official — Deployment Architecture

This document describes the production deployment pipeline and architecture configurations for the **Magnet Vapi Official** e-commerce app.

---

## 1. Top-level Architecture

```text
https://magnet.insmittech.com (Vite/Static Hosting CDN)
         ↓
https://api.insmittech.com (Express Backend Server)
         ├─→ MongoDB Atlas Cloud (Database)
         ├─→ Cloudinary Media Storage (Images Upload)
         └─→ Razorpay Gateway Sandbox (Payments)
```

---

## 2. Frontend Deployment (Static Hosting CDN)
- **Target URL**: `https://magnet.insmittech.com`
- **Hosting Providers**: Vercel, Netlify, or AWS S3+CloudFront.
- **Build Configurations**:
  - Run build command: `npm run build`
  - Output directory to serve: `dist/`
  - Add client side environment variable:
    ```text
    VITE_API_URL=https://api.insmittech.com/api
    ```

---

## 3. Backend Deployment (Node.js App Hosting)
- **Target API URL**: `https://api.insmittech.com`
- **Hosting Providers**: Render, Heroku, AWS EC2, or DigitalOcean Droplet.
- **Production Server Manager**:
  - Use `pm2` to monitor and run the server daemon:
    ```bash
    pm2 start src/app.js --name "magnet-api"
    ```
- **Environment Settings (`.env`)**:
  Ensure the following variables are configured in your production environment settings (do NOT commit to git):
  ```text
  NODE_ENV=production
  PORT=5000
  CLIENT_URL=https://magnet.insmittech.com
  MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/magnet
  JWT_SECRET=your_long_secure_production_jwt_secret
  CLOUDINARY_CLOUD_NAME=your_cloud_name
  CLOUDINARY_API_KEY=your_api_key
  CLOUDINARY_API_SECRET=your_api_secret
  RAZORPAY_KEY_ID=rzp_live_your_key_id
  RAZORPAY_KEY_SECRET=your_razorpay_key_secret
  ```

---

## 4. DNS Settings (Cloudflare or Domain Registrar)
Ensure the subdomains do not impact the parent site `insmittech.com`:
- **`magnet.insmittech.com`**: CNAME record pointing to your static hosting CDN provider.
- **`api.insmittech.com`**: A/AAAA record pointing to your Node.js application server.
