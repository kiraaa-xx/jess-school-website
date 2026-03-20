# Jaycees Everest Secondary School – Website v2
**Persistent cloud storage: MongoDB Atlas + Cloudinary**

---

## What changed from v1?
| v1 (broken on Render) | v2 (works permanently) |
|---|---|
| SQLite database (local file) | MongoDB Atlas (cloud database) |
| Images saved on server disk | Images saved on Cloudinary (cloud) |
| Data wiped on every restart | Data persists forever |

---

## Before you start — Sign up for 2 free services

### 1. MongoDB Atlas (free cloud database)
1. Go to https://mongodb.com/cloud/atlas → Sign Up (free)
2. Create a free cluster (M0 Free Tier)
3. Click **Connect** → **Drivers** → copy the connection string
4. It looks like: `mongodb+srv://username:password@cluster.mongodb.net/jessdb`

### 2. Cloudinary (free image storage)
1. Go to https://cloudinary.com → Sign Up (free)
2. Go to your Dashboard
3. Copy: Cloud Name, API Key, API Secret

---

## Setup Steps

### Step 1 — Create your .env file
Copy `.env.example` and rename it to `.env`
Fill in your real values:
```
MONGODB_URI=mongodb+srv://...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
SESSION_SECRET=any-long-random-text
ADMIN_PASSWORD=admin123
```

### Step 2 — Install packages
```bash
npm install
```

### Step 3 — Seed the database (run ONCE)
```bash
node database/setup.js
```

### Step 4 — Start the server
```bash
npm start
```

---

## Deploy on Render

1. Push this project to GitHub
2. Go to https://render.com → New Web Service
3. Connect your GitHub repo
4. Fill in:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Go to **Environment** tab → Add these variables:
   ```
   MONGODB_URI = your mongodb connection string
   CLOUDINARY_CLOUD_NAME = your cloud name
   CLOUDINARY_API_KEY = your api key
   CLOUDINARY_API_SECRET = your api secret
   SESSION_SECRET = any long random text
   ADMIN_PASSWORD = admin123
   ```
6. Click Deploy
7. After deploy, open the Render shell and run:
   ```bash
   node database/setup.js
   ```

### Admin Panel
- URL: `https://your-site.onrender.com/admin`
- Username: `admin`
- Password: whatever you set in ADMIN_PASSWORD

---

## Project Structure
```
/jess
  server.js          → Main entry point
  /models            → MongoDB schemas (Notice, Event, Gallery, SchoolInfo, Admin)
  /controllers       → Business logic
  /routes            → URL routing
  /middleware        → Auth + Cloudinary upload
  /views             → EJS HTML templates
  /public            → CSS, JS, Images
  /database          → setup.js (run once to seed data)
  .env.example       → Copy this to .env and fill in your values
```
