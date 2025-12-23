# Deployment Guide

## Push to GitHub

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository named `beyondchats-assignment`
3. **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click "Create repository"

### Step 2: Push Your Code

```powershell
# Add your GitHub repository as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/beyondchats-assignment.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Deploy Frontend to Vercel

### Option 1: Deploy via Vercel CLI (Recommended)

```powershell
# Install Vercel CLI globally
npm install -g vercel

# Navigate to frontend directory
cd D:\BeyondChatAssessment\frontend

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# Deploy to production
vercel --prod
```

**Configuration during deployment:**
- Project name: `beyondchats-frontend`
- Root directory: `.` (current directory)
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

### Option 2: Deploy via Vercel Website

1. Go to [Vercel](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Add Environment Variable:
   - Name: `VITE_API_URL`
   - Value: Your backend URL (see below)
6. Click "Deploy"

---

## Deploy Backend to Railway

### Step 1: Prepare Backend for Deployment

Create `backend/Procfile`:
```
web: php artisan serve --host=0.0.0.0 --port=$PORT
```

### Step 2: Deploy via Railway

1. Go to [Railway](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `beyondchats-assignment` repository
5. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `composer install --no-dev --optimize-autoloader`
   - **Start Command:** `php artisan serve --host=0.0.0.0 --port=$PORT`

### Step 3: Add Environment Variables in Railway

Go to your project → Variables tab, add:

```
APP_NAME=BeyondChatsAssignment
APP_ENV=production
APP_KEY=<run: php artisan key:generate --show>
APP_DEBUG=false
APP_URL=https://your-app.railway.app

DB_CONNECTION=sqlite
DB_DATABASE=/app/database/database.sqlite

SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync
```

### Step 4: Run Migrations

In Railway console:
```bash
php artisan migrate --force
```

---

## Alternative: Deploy Backend to Render

1. Go to [Render](https://render.com)
2. Create "New Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** beyondchats-api
   - **Root Directory:** `backend`
   - **Build Command:** `composer install --no-dev && php artisan migrate --force`
   - **Start Command:** `php artisan serve --host=0.0.0.0 --port=$PORT`
5. Add environment variables (same as Railway above)

---

## Update Frontend with Backend URL

After deploying backend, update your frontend:

**Option 1: Environment Variable (Vercel)**
Go to Vercel → Project Settings → Environment Variables:
- `VITE_API_URL` = `https://your-backend-url.railway.app/api`

**Option 2: Update Code**
Edit [frontend/src/App.jsx](frontend/src/App.jsx):
```javascript
const API = import.meta.env.VITE_API_URL || 'https://your-backend-url.railway.app/api'
```

Redeploy frontend:
```powershell
cd frontend
vercel --prod
```

---

## Quick Deploy Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed to Railway/Render
- [ ] Database migrated on production
- [ ] Backend URL obtained
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variable updated with backend URL
- [ ] Test live site works
- [ ] Update README.md with live demo link

---

## Testing Deployment

### Test Backend API
```powershell
curl https://your-backend-url.railway.app/api/articles
```

### Test Frontend
Visit your Vercel URL: `https://beyondchats-frontend.vercel.app`

---

## Troubleshooting Deployment

### Backend Issues

**Database errors:**
- Run migrations: `php artisan migrate --force` in Railway console

**500 errors:**
- Check logs in Railway dashboard
- Verify APP_KEY is set
- Set APP_DEBUG=false

### Frontend Issues

**Blank page:**
- Check browser console for errors
- Verify VITE_API_URL environment variable
- Check if backend is accessible from frontend

**CORS errors:**
- Laravel should have CORS enabled by default
- If not, install: `composer require fruitcake/laravel-cors`

---

## Update README with Live Link

After deployment, update [README.md](README.md):

```markdown
## 🌐 Live Demo

- **Frontend:** https://beyondchats-frontend.vercel.app
- **Backend API:** https://beyondchats-api.railway.app/api
```

---

## Cost Summary

All these services have free tiers:

- **GitHub:** Free (public repositories)
- **Vercel:** Free (hobby projects)
- **Railway:** $5 free credit/month
- **Render:** Free tier available

---

## Next Steps After Deployment

1. Test all features on live site
2. Update README with live links
3. Share repository link: `https://github.com/YOUR_USERNAME/beyondchats-assignment`
4. Submit to BeyondChats team

---

## Repository Link Format

Your submission should include:
```
Repository: https://github.com/YOUR_USERNAME/beyondchats-assignment
Live Demo: https://beyondchats-frontend.vercel.app
```
