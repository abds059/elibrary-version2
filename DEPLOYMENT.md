# eLibrary — Production Deployment Guide

> **Architecture**
> - **Frontend** → Vercel or Netlify (React/Vite SPA)
> - **Backend** → Railway (Node/Express API)
> - **Database** → Railway MySQL plugin
> - **File storage** → Railway Persistent Volume (`/data/uploads`)

---

## 1. Backend on Railway

### 1.1 Create a new Railway project
1. Go to [railway.app](https://railway.app) → **New Project**.
2. Choose **Deploy from GitHub repo** → select your repo.
3. Set the **root directory** to `backend`.

### 1.2 Add a MySQL database
1. In the Railway project dashboard click **+ New** → **Database** → **MySQL**.
2. Railway automatically injects `DATABASE_URL` into your backend service. No extra config needed — `database.js` reads it automatically.

### 1.3 Add a Persistent Volume (for PDF/cover uploads)
1. In your backend service, go to **Settings** → **Volumes**.
2. Add a volume mounted at `/data/uploads`.
3. This path must match the `UPLOAD_DIR` env var below.

### 1.4 Set environment variables
In your Railway backend service go to **Variables** and add:

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | *(auto-injected by Railway MySQL plugin — reference as `${{MySQL.DATABASE_URL}}`)* |
| `JWT_SECRET` | *(64-char random hex — `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)* |
| `COOKIE_SECRET` | *(another 64-char random hex)* |
| `JWT_EXPIRES_IN` | `7d` |
| `GEMINI_API_KEY` | *(your Google AI Studio key)* |
| `GEMINI_MODEL` | `gemini-1.5-flash` |
| `CLIENT_ORIGIN` | *(your Vercel/Netlify frontend URL, e.g. `https://elibrary.vercel.app`)* |
| `UPLOAD_DIR` | `/data/uploads` |
| `MAX_FILE_SIZE_MB` | `20` |

> **Tip:** To reference the MySQL plugin's URL use Railway's variable reference syntax:  
> `DATABASE_URL` = `${{MySQL.DATABASE_URL}}`

### 1.5 Deploy
Railway will:
1. Run `npm install`
2. Run `npm run migrate` (syncs Sequelize models to DB)
3. Start with `npm start`

Health check endpoint: `GET /api/health`

Once deployed, note your Railway URL — you'll need it for the frontend:
```
https://<your-service>.up.railway.app
```

---

## 2. Frontend on Vercel

### 2.1 Import project
1. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your repo.
2. Set **Root Directory** to `frontend`.
3. Framework preset: **Vite** (auto-detected).

### 2.2 Environment variables
In Vercel project settings → **Environment Variables**:

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://<your-service>.up.railway.app` *(no trailing slash)* |

### 2.3 Deploy
Click **Deploy**. The `vercel.json` at `frontend/vercel.json` handles SPA routing rewrites automatically.

---

## 2. Frontend on Netlify (alternative)

### 2.1 Import project
1. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**.
2. The `netlify.toml` in the repo root configures build settings automatically:
   - Base: `frontend`
   - Publish: `dist`
   - Build: `npm install && npm run build`

### 2.2 Environment variables
In Netlify site settings → **Environment variables**:

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://<your-service>.up.railway.app` *(no trailing slash)* |

### 2.3 Deploy
Trigger a deploy — Netlify will build and publish automatically.

---

## 3. Update CORS after deployment

Once both services are deployed, go back to Railway and update the `CLIENT_ORIGIN` variable to your actual frontend URL:

```
CLIENT_ORIGIN=https://your-app.vercel.app
```

Redeploy the backend (Railway does this automatically on variable change).

---

## 4. Local development (unchanged)

```bash
# Terminal 1 — backend
cd backend
cp .env.example .env   # fill in local DB creds
npm install
npm run dev            # migrates + seeds + starts with nodemon

# Terminal 2 — frontend
cd frontend
cp .env.example .env.local
# Leave VITE_API_URL unset (or empty) — Vite proxy forwards /api → localhost:5000
npm install
npm run dev
```

---

## 5. File storage notes

Railway volumes are **persistent across deploys** but scoped to a single region. If you ever need to migrate to a different Railway region or scale to multiple replicas, consider switching to an object store (e.g. Cloudflare R2, AWS S3). The `multer.js` config reads `UPLOAD_DIR` from env, so swapping storage backends only requires updating that config file.

---

## 6. Checklist before going live

- [ ] `NODE_ENV=production` set on Railway
- [ ] `CLIENT_ORIGIN` matches your exact frontend URL (no trailing slash)
- [ ] `JWT_SECRET` and `COOKIE_SECRET` are strong random values (not the defaults)
- [ ] `GEMINI_API_KEY` is valid
- [ ] Railway volume mounted at `/data/uploads`
- [ ] `VITE_API_URL` set in Vercel/Netlify (no trailing slash)
- [ ] HTTPS on both services (Railway and Vercel/Netlify provide this automatically)
