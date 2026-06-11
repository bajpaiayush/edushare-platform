# 📚 EduShare — Step-by-Step Setup Guide

Follow these steps IN ORDER to get the project running.

---

## ✅ STEP 1 — Set Up Neon PostgreSQL (Database)

1. Go to 👉 https://console.neon.tech and sign up (free)
2. Create a new project
3. Copy the **Connection String** — it looks like:
   `postgresql://username:password@host/dbname?sslmode=require`
4. In the Neon console, click **SQL Editor** on the left sidebar
5. Paste and run this SQL to create all tables:

```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'student'
);

CREATE TABLE IF NOT EXISTS resources (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS downloads (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMP DEFAULT NOW()
);
```

6. Click ▶ Run → You should see "Success" ✅

---

## ✅ STEP 2 — Set Up Cloudinary (File Storage)

1. Go to 👉 https://cloudinary.com and sign up (free)
2. On your dashboard, copy these 3 values:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

---

## ✅ STEP 3 — Create the Backend .env File

1. Open a terminal and run:
   ```
   cd "d:\Projects\SE LAB PROJECT\backend"
   copy .env.example .env
   ```

2. Open the `.env` file and fill in all values:
   ```
   PORT=5000
   JWT_SECRET=anyrandomlongstring123abc

   DATABASE_URL=postgresql://your_neon_connection_string?sslmode=require

   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

   ⚠️ Make sure DATABASE_URL ends with ?sslmode=require

---

## ✅ STEP 4 — Run the Backend Server

Open a terminal:
```
cd "d:\Projects\SE LAB PROJECT\backend"
npm run dev
```

You should see:
```
Server running on port 5000
Connected to PostgreSQL database successfully!
```

---

## ✅ STEP 5 — Run the Frontend (React App)

Open a NEW terminal (keep backend running):
```
cd "d:\Projects\SE LAB PROJECT\frontend"
npm start
```

Browser will open at 👉 http://localhost:3000

---

## ✅ STEP 6 — Make Yourself an Admin

After registering with any email, go to Neon SQL Editor and run:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```
Then login again — you'll see the Admin Panel in the navbar.

---

## 🌐 STEP 7 — Deploy Backend to Render

1. Go to 👉 https://render.com → New → Web Service
2. Connect your GitHub repo
3. Settings:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add all your .env variables in the "Environment" section
5. Deploy → Copy your Render URL (e.g. https://edushare-api.onrender.com)

---

## 🌐 STEP 8 — Deploy Frontend to Vercel

1. Go to 👉 https://vercel.com → New Project → Import repo
2. Settings:
   - Framework: Create React App
   - Root Directory: `frontend`
3. Add Environment Variable:
   - Key: `REACT_APP_API_URL`
   - Value: `https://your-render-url.onrender.com`
4. Deploy → Your app is live! 🎉

---

## 🎭 Who Can Do What?

| Feature           | Student | Teacher | Admin |
|-------------------|---------|---------|-------|
| Register & Login  | ✅      | ✅      | ✅    |
| View Resources    | ✅      | ✅      | ✅    |
| Download Files    | ✅      | ✅      | ✅    |
| Search Resources  | ✅      | ✅      | ✅    |
| Upload Resources  | ❌      | ✅      | ✅    |
| Admin Panel       | ❌      | ❌      | ✅    |
| Delete Resources  | ❌      | ❌      | ✅    |

---

## ⚠️ Common Problems & Fixes

| Problem | Fix |
|---------|-----|
| `Cannot connect to database` | Check DATABASE_URL has `?sslmode=require` at the end |
| `CORS error` in browser | Make sure cors() is in server.js (it already is) |
| File upload fails | Double check Cloudinary credentials in .env |
| Admin panel not showing | Set role to 'admin' in Neon SQL editor |
| Render app is slow first time | Free tier sleeps after 15 min — first request wakes it up |

---
