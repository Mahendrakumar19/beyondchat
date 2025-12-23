# Complete Setup Guide - BeyondChats Assignment

This guide walks you through setting up and running all three parts of the project: Laravel backend, Node.js scripts, and React frontend.

## Prerequisites

Before you begin, ensure you have the following installed:

- **PHP 8.1+** - [Download PHP](https://www.php.net/downloads.php)
- **Composer** - [Install Composer](https://getcomposer.org/download/)
- **Node.js 18+** - [Download Node.js](https://nodejs.org/)
- **Git** - [Download Git](https://git-scm.com/downloads)

### API Keys Required (for Phase 2)

- **OpenAI API Key** - Get from [OpenAI Platform](https://platform.openai.com/api-keys)
- **SerpAPI Key** - Get from [SerpAPI](https://serpapi.com/) (free tier available)

---

## Part 1: Laravel Backend Setup (Phase 1)

The backend provides CRUD APIs for managing articles.

### Step 1: Navigate to Backend Directory

```powershell
cd backend
```

### Step 2: Check if Laravel is Installed

If you see a `backend-app` folder, Laravel was already initialized. Otherwise, you need the Laravel framework files.

**Option A: If `composer.json` exists in `backend/`:**
```powershell
composer install
```

**Option B: If starting fresh:**
```powershell
composer create-project laravel/laravel temp-app
# Move contents from temp-app to backend/
```

### Step 3: Configure Environment

```powershell
# Copy the example env file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### Step 4: Configure Database

Edit `.env` file and set up SQLite (easiest option):

```env
DB_CONNECTION=sqlite
DB_DATABASE=D:\BeyondChatAssessment\backend\database\database.sqlite
```

**Create the SQLite database file:**
```powershell
# Create database directory if it doesn't exist
New-Item -Path database -ItemType Directory -Force

# Create empty database file
New-Item -Path database\database.sqlite -ItemType File -Force
```

### Step 5: Copy Model, Migration, Controller Files

Ensure these files are in place (they should already be created):

- `app/Models/Article.php`
- `database/migrations/2025_12_21_000000_create_articles_table.php`
- `app/Http/Controllers/ArticleController.php`
- `routes/api.php`

### Step 6: Run Database Migration

```powershell
php artisan migrate
```

You should see output like:
```
Migration table created successfully.
Migrating: 2025_12_21_000000_create_articles_table
Migrated:  2025_12_21_000000_create_articles_table
```

### Step 7: Start Laravel Server

```powershell
php artisan serve --host=127.0.0.1 --port=8000
```

The API will be available at: `http://127.0.0.1:8000`

### Step 8: Test the API

Open a new terminal and test:

```powershell
# Test GET request (should return empty array initially)
curl http://127.0.0.1:8000/api/articles

# Test POST request (create an article)
curl -X POST http://127.0.0.1:8000/api/articles `
  -H "Content-Type: application/json" `
  -d '{\"title\":\"Test Article\",\"content_original\":\"This is test content\"}'
```

**API Endpoints Available:**
- `GET /api/articles` - List all articles (paginated)
- `GET /api/articles/latest` - Get most recent article
- `GET /api/articles/{id}` - Get single article
- `POST /api/articles` - Create article
- `PUT /api/articles/{id}` - Update article
- `DELETE /api/articles/{id}` - Delete article

---

## Part 2: Scrape BeyondChats Articles

Now let's populate the database with real articles from BeyondChats.

### Step 1: Navigate to Node Scripts

```powershell
cd ..\node-scripts
```

### Step 2: Install Dependencies

```powershell
npm install
```

### Step 3: Configure Environment

Create a `.env` file in `node-scripts/` directory:

```powershell
# Create .env file
New-Item -Path .env -ItemType File
```

Add this content to `.env`:

```env
LARAVEL_API_URL=http://127.0.0.1:8000/api
SERPAPI_KEY=your_serpapi_key_here
OPENAI_API_KEY=your_openai_key_here
```

**Note:** You can run the scraper without SERPAPI_KEY and OPENAI_API_KEY for now.

### Step 4: Run the Scraper

```powershell
npm run scrape
```

This will:
1. Visit https://beyondchats.com/blogs/
2. Find the last page of blogs
3. Scrape 5 oldest articles
4. Save them to your Laravel database via API

**Expected Output:**
```
Last page URL: https://beyondchats.com/blogs?page=X
Found article links: XX
Saved: 1
Saved: 2
...
```

### Step 5: Verify Articles Were Saved

```powershell
curl http://127.0.0.1:8000/api/articles
```

You should see the scraped articles in JSON format.

---

## Part 3: Run Article Rewriter (Phase 2)

This script searches Google for similar articles and uses AI to rewrite them.

### Step 1: Get Required API Keys

**OpenAI API Key:**
1. Go to https://platform.openai.com/api-keys
2. Create a new secret key
3. Copy it to your `.env` file

**SerpAPI Key:**
1. Go to https://serpapi.com/
2. Sign up for free account (100 searches/month free)
3. Copy your API key to `.env` file

Update your `node-scripts/.env`:

```env
LARAVEL_API_URL=http://127.0.0.1:8000/api
SERPAPI_KEY=your_actual_serpapi_key
OPENAI_API_KEY=sk-your_actual_openai_key
```

### Step 2: Run the Rewriter Script

```powershell
npm run run
```

This will:
1. Fetch the latest article from your Laravel API
2. Search Google for the article title
3. Scrape content from top 2 search results
4. Call OpenAI to rewrite the article with similar formatting
5. Update the article in database with `content_updated` field
6. Add references to the bottom

**Expected Output:**
```
Fetching latest article from API...
Got: Article Title Here
Searching web for article title...
Picked references: [url1, url2]
Calling LLM to rewrite article...
Article updated: 5
```

---

## Part 4: React Frontend Setup (Phase 3)

Display articles in a nice UI.

### Step 1: Navigate to Frontend

```powershell
cd ..\frontend
```

### Step 2: Install Dependencies

```powershell
npm install
```

### Step 3: Configure API URL (Optional)

Create `.env` file in `frontend/` directory:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Or just use the default (which is already set to http://127.0.0.1:8000/api).

### Step 4: Install Vite Plugin for React

The project needs `@vitejs/plugin-react` to work. Create `vite.config.js`:

```powershell
# This file should already exist, but if not:
New-Item -Path vite.config.js -ItemType File
```

Add this content to `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
})
```

Install the plugin:

```powershell
npm install -D @vitejs/plugin-react
```

### Step 5: Start Development Server

```powershell
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### Step 6: Open Browser

Visit: `http://localhost:3000`

You should see:
- Left sidebar with list of articles
- Click any article to view original and updated content side-by-side

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                  React Frontend (Port 3000)              │
│  - Lists all articles                                    │
│  - Shows original vs updated content                     │
└────────────────┬────────────────────────────────────────┘
                 │ GET /api/articles
                 │
┌────────────────▼────────────────────────────────────────┐
│              Laravel API (Port 8000)                     │
│  - CRUD operations for articles                          │
│  - SQLite database                                       │
└─────────────┬──────────────────────────┬────────────────┘
              │                          │
      ┌───────▼─────────┐       ┌───────▼─────────────┐
      │  scrape_        │       │  fetch_and_         │
      │  beyondchats.js │       │  rewrite.js         │
      │                 │       │                     │
      │ - Scrapes       │       │ - Searches Google   │
      │   BeyondChats   │       │ - Scrapes refs      │
      │ - POSTs to API  │       │ - Calls OpenAI      │
      └─────────────────┘       │ - Updates via API   │
                                └──────────┬──────────┘
                                           │
                                ┌──────────▼──────────┐
                                │  External Services  │
                                │  - SerpAPI          │
                                │  - OpenAI GPT-4     │
                                └─────────────────────┘
```

---

## Running All Services Together

**Terminal 1 - Laravel Backend:**
```powershell
cd D:\BeyondChatAssessment\backend
php artisan serve --host=127.0.0.1 --port=8000
```

**Terminal 2 - React Frontend:**
```powershell
cd D:\BeyondChatAssessment\frontend
npm run dev
```

**Terminal 3 - Run Scripts (as needed):**
```powershell
cd D:\BeyondChatAssessment\node-scripts

# First time: scrape articles
npm run scrape

# Then: rewrite latest article
npm run run
```

---

## Troubleshooting

### Laravel Issues

**Error: "could not find driver"**
- Install PHP SQLite extension: `php -m | findstr sqlite`
- Edit `php.ini` and uncomment `extension=sqlite3`

**Error: "No application encryption key"**
```powershell
php artisan key:generate
```

**Migration fails**
```powershell
# Reset database
php artisan migrate:fresh
```

### Node Script Issues

**Error: "ECONNREFUSED"**
- Make sure Laravel server is running on port 8000
- Check `LARAVEL_API_URL` in `.env`

**Error: "Invalid API key" (OpenAI/SerpAPI)**
- Verify your API keys are correct
- Check if you have credits/quota remaining

**Scraping returns empty content**
- The BeyondChats site structure may have changed
- Check console output for specific errors
- You may need to adjust selectors in `scrape_beyondchats.js`

### Frontend Issues

**Blank page or "Cannot GET /"**
```powershell
# Reinstall dependencies
rm -r node_modules
npm install
```

**CORS errors**
- Add CORS middleware to Laravel (usually included by default)
- Or use a proxy in `vite.config.js`

**API not loading**
- Check browser console for errors
- Verify `VITE_API_URL` or default URL in `App.jsx`

---

## Testing the Complete Flow

1. **Start Laravel:** Backend should be running on port 8000
2. **Scrape articles:** Run `npm run scrape` to get 5 articles
3. **Verify in API:** `curl http://127.0.0.1:8000/api/articles`
4. **Run rewriter:** `npm run run` to update latest article
5. **Check frontend:** Open http://localhost:3000 and view articles
6. **Compare content:** Click an article to see original vs updated

---

## Project Structure

```
BeyondChatAssessment/
├── backend/                    # Laravel API
│   ├── app/
│   │   ├── Models/
│   │   │   └── Article.php    # Article model
│   │   └── Http/Controllers/
│   │       └── ArticleController.php
│   ├── database/
│   │   ├── migrations/
│   │   │   └── 2025_12_21_000000_create_articles_table.php
│   │   └── database.sqlite    # SQLite database file
│   ├── routes/
│   │   └── api.php           # API routes
│   ├── .env                  # Environment config
│   └── README.md
│
├── node-scripts/              # Node.js automation scripts
│   ├── scrape_beyondchats.js # Phase 1: Scrape articles
│   ├── fetch_and_rewrite.js  # Phase 2: AI rewriter
│   ├── package.json
│   ├── .env                  # API keys
│   └── README.md
│
├── frontend/                  # React app
│   ├── src/
│   │   ├── App.jsx           # Main component
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Styles
│   ├── index.html
│   ├── vite.config.js        # Vite configuration
│   ├── package.json
│   └── README.md
│
├── README.md                  # Project overview
└── SETUP.md                   # This file
```

---

## What Each Phase Does

### Phase 1: Scrape & Store Articles
- Scrapes last page of BeyondChats blogs
- Extracts 5 oldest articles
- Stores in database via Laravel API
- **Files:** `scrape_beyondchats.js`, Laravel backend

### Phase 2: AI Article Rewriter
- Fetches latest article from API
- Searches Google for similar articles
- Scrapes top 2 results
- Uses OpenAI to rewrite with similar formatting
- Updates article with new content + references
- **Files:** `fetch_and_rewrite.js`

### Phase 3: Frontend Display
- Fetches all articles from API
- Displays in responsive sidebar layout
- Shows both original and updated content
- **Files:** React app in `frontend/`

---

## Next Steps

- **Deploy Frontend:** Use Vercel, Netlify, or GitHub Pages
- **Deploy Backend:** Use Railway, Render, or AWS
- **Improve Scraping:** Use Puppeteer for JavaScript-rendered sites
- **Better Content Extraction:** Use specialized libraries like Readability or Mercury
- **Add Authentication:** Protect API endpoints
- **Add Caching:** Use Redis for better performance
- **Schedule Rewrites:** Use cron jobs to automatically rewrite articles

---

## Contact

For questions about this assignment, contact: support@beyondchats.com
