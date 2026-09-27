# V3 Itinerary - Production Deployment Package

This package contains everything needed to deploy the **V3 Itinerary** web application and backend API.

---

## 📁 Package Contents

```text
build_deployment/
├── dist/                     # Compiled Production Frontend (HTML, CSS, JS bundles)
│   ├── index.html
│   └── assets/
├── server/                   # Node.js / Express Backend & API
│   ├── server.js             # Main server entrypoint (serves API & dist)
│   ├── db.js                 # MySQL database connection & CRUD handlers
│   ├── emailService.js       # Gmail SMTP PDF itinerary delivery service
│   ├── schema.sql            # Database schema definitions
│   └── uploads/              # Destination images & media uploads folder
├── database/                 # MySQL Database Import Files
│   ├── hostinger_import.sql  # Clean MySQL dump ready for Hostinger / cPanel phpMyAdmin
│   └── v3_itinerary_dump.sql # Full database schema & seed data
├── .env                      # Production environment variables & DB credentials
├── .env.example              # Template environment variables
├── package.json              # Node.js dependencies & scripts
└── README_DEPLOY.md          # This deployment guide
```

---

## 🚀 Quick Deployment Guide

### Option 1: Unified Full-Stack Node.js Deployment (VPS / Hostinger / Render / Railway)
The backend `server/server.js` is pre-configured to automatically serve the frontend `dist/` files and handle all API / SSE requests on a single port.

1. **Extract the ZIP file** on your server.
2. **Install production dependencies**:
   ```bash
   npm install --omit=dev
   ```
3. **Verify `.env` settings**:
   Ensure `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and `PORT` (e.g. 5000 or 80) are correct.
4. **Import Database (if not already done)**:
   - In your database management tool (phpMyAdmin / MySQL CLI), import `database/hostinger_import.sql`.
5. **Start the application**:
   ```bash
   npm start
   ```
   *(Or using PM2 for production uptime: `pm2 start server/server.js --name "v3-itinerary"`)*

---

### Option 2: Hostinger / cPanel Shared Hosting

1. **Frontend**:
   - Upload the **contents of the `dist/` folder** directly into your `public_html/` directory.
2. **Backend**:
   - In cPanel / Hostinger, navigate to **Setup Node.js App**.
   - Create a new Node.js app pointing to `server/server.js`.
   - Run `npm install --omit=dev`.
3. **Database**:
   - Go to **phpMyAdmin** in your hosting control panel.
   - Select your database (`u762329739_v3db`).
   - Click **Import** and upload `database/hostinger_import.sql`.

---

## ⚙️ Environment Variables Summary (`.env`)

- `PORT`: Port for Express server (default `5000`).
- `DB_HOST`: Hostinger or local MySQL host (`srv1947.hstgr.io` or `localhost`).
- `DB_USER`: Database username.
- `DB_PASSWORD`: Database password.
- `DB_NAME`: Database name (`u762329739_v3db`).
- `VITE_RAZORPAY_KEY_ID`: Razorpay Public Key ID.
- `VITE_RAZORPAY_KEY_SECRET`: Razorpay Secret Key.
- `GMAIL_USER`: Gmail address for automated email dispatch.
- `GMAIL_APP_PASSWORD`: 16-character Google App Password.
