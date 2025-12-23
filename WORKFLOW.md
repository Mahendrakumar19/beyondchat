# Project Workflow Guide

## Complete Project Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    BEYONDCHATS ASSIGNMENT                        │
│                  Full Stack Implementation                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  PHASE 1: Scrape & Store Articles                               │
└─────────────────────────────────────────────────────────────────┘

    BeyondChats Blog
    (https://beyondchats.com/blogs/)
            │
            │ Scrape HTML
            ▼
    ┌──────────────────────┐
    │ scrape_beyondchats.js│
    │  - Find last page    │
    │  - Extract 5 oldest  │
    │  - Parse content     │
    └──────────┬───────────┘
               │ POST /api/articles
               ▼
    ┌──────────────────────┐
    │   Laravel API        │
    │  - ArticleController │
    │  - Validate & Store  │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │  SQLite Database     │
    │  articles table      │
    │  - id, title, slug   │
    │  - content_original  │
    │  - content_updated   │
    └──────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  PHASE 2: AI-Powered Article Rewriting                          │
└─────────────────────────────────────────────────────────────────┘

    ┌──────────────────────┐
    │ fetch_and_rewrite.js │
    └──────────┬───────────┘
               │
               │ 1. GET /api/articles/latest
               ▼
    ┌──────────────────────┐
    │   Laravel API        │
    │  Return latest       │
    │  article             │
    └──────────┬───────────┘
               │
               │ Article: "How to use AI..."
               ▼
    ┌──────────────────────┐
    │   SerpAPI            │
    │  Search Google for   │
    │  "How to use AI..."  │
    └──────────┬───────────┘
               │
               │ Returns top search results
               ▼
    ┌──────────────────────┐
    │  Web Scraper         │
    │  (Cheerio)           │
    │  - Scrape result #1  │
    │  - Scrape result #2  │
    └──────────┬───────────┘
               │
               │ 2 reference articles
               ▼
    ┌──────────────────────┐
    │   OpenAI GPT-4       │
    │  Prompt:             │
    │  "Rewrite article    │
    │   to match style of  │
    │   these 2 refs..."   │
    └──────────┬───────────┘
               │
               │ New formatted content
               ▼
    ┌──────────────────────┐
    │ fetch_and_rewrite.js │
    │  - Add references    │
    │  - Format HTML       │
    └──────────┬───────────┘
               │
               │ PUT /api/articles/{id}
               │ { content_updated: "..." }
               ▼
    ┌──────────────────────┐
    │   Laravel API        │
    │  Update article      │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │  SQLite Database     │
    │  Article updated!    │
    └──────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  PHASE 3: Frontend Display                                      │
└─────────────────────────────────────────────────────────────────┘

    ┌──────────────────────┐
    │   React App          │
    │  (Port 3000)         │
    └──────────┬───────────┘
               │
               │ useEffect on mount
               │ GET /api/articles
               ▼
    ┌──────────────────────┐
    │   Laravel API        │
    │  Return all articles │
    │  (paginated)         │
    └──────────┬───────────┘
               │
               │ JSON array of articles
               ▼
    ┌──────────────────────────────────────┐
    │   React Component Renders            │
    │                                       │
    │  ┌─────────────┬──────────────────┐  │
    │  │  Sidebar    │  Content Area    │  │
    │  │             │                  │  │
    │  │ • Article 1 │  ┌──────────────┐│  │
    │  │ • Article 2 │  │  Original    ││  │
    │  │ • Article 3 │  │  Content     ││  │
    │  │ • Article 4 │  └──────────────┘│  │
    │  │ • Article 5 │  ┌──────────────┐│  │
    │  │             │  │  Updated     ││  │
    │  │  (Click to  │  │  Content     ││  │
    │  │   view)     │  │  + Refs      ││  │
    │  │             │  └──────────────┘│  │
    │  └─────────────┴──────────────────┘  │
    └──────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  DATA FLOW SUMMARY                                              │
└─────────────────────────────────────────────────────────────────┘

1. SCRAPE:    BeyondChats → Script → API → Database
2. REWRITE:   Database → API → Script → Google → OpenAI → API → Database
3. DISPLAY:   Database → API → React → User Browser

┌─────────────────────────────────────────────────────────────────┐
│  DIRECTORY STRUCTURE                                            │
└─────────────────────────────────────────────────────────────────┘

BeyondChatAssessment/
│
├── backend/                    Laravel 10 API
│   ├── app/
│   │   ├── Models/
│   │   │   └── Article.php                ← Eloquent Model
│   │   └── Http/Controllers/
│   │       └── ArticleController.php      ← CRUD Logic
│   ├── database/
│   │   ├── migrations/
│   │   │   └── create_articles_table.php  ← Schema
│   │   └── database.sqlite                ← SQLite DB
│   ├── routes/
│   │   └── api.php                        ← API Routes
│   └── .env                               ← Config
│
├── node-scripts/               Automation Scripts
│   ├── scrape_beyondchats.js              ← Phase 1
│   ├── fetch_and_rewrite.js               ← Phase 2
│   ├── package.json
│   └── .env                               ← API Keys
│
├── frontend/                   React + Vite
│   ├── src/
│   │   ├── App.jsx                        ← Main UI
│   │   ├── main.jsx                       ← Entry
│   │   └── index.css                      ← Styles
│   ├── vite.config.js
│   └── package.json
│
├── README.md                   Project Overview
├── SETUP.md                    Complete Setup Guide
├── QUICK_REFERENCE.md          Commands Cheatsheet
└── WORKFLOW.md                 This File

┌─────────────────────────────────────────────────────────────────┐
│  RUNNING THE PROJECT (3 Terminals)                             │
└─────────────────────────────────────────────────────────────────┘

Terminal 1: Laravel Backend
───────────────────────────
cd D:\BeyondChatAssessment\backend
php artisan serve
→ Listening on http://127.0.0.1:8000

Terminal 2: React Frontend
───────────────────────────
cd D:\BeyondChatAssessment\frontend
npm run dev
→ Running on http://localhost:3000

Terminal 3: Node Scripts (as needed)
────────────────────────────────────
cd D:\BeyondChatAssessment\node-scripts

# First: Scrape articles
npm run scrape
→ Creates 5 articles in database

# Then: AI rewrite
npm run run
→ Updates latest article with AI content

┌─────────────────────────────────────────────────────────────────┐
│  VERIFICATION CHECKLIST                                         │
└─────────────────────────────────────────────────────────────────┘

□ Backend running on port 8000
  Test: curl http://127.0.0.1:8000/api/articles

□ Database has articles
  Test: Check backend/database/database.sqlite

□ Frontend running on port 3000
  Test: Open http://localhost:3000 in browser

□ Scraper successfully added articles
  Test: See articles in frontend sidebar

□ Rewriter updated article
  Test: Click article, see "Updated" section with references

┌─────────────────────────────────────────────────────────────────┐
│  TECHNOLOGIES USED                                              │
└─────────────────────────────────────────────────────────────────┘

Backend (Laravel):
  - PHP 8.1+
  - Laravel 10
  - SQLite
  - Eloquent ORM

Scripts (Node.js):
  - Node.js 18+
  - axios (HTTP)
  - cheerio (Scraping)
  - openai (AI)
  - google-search-results-nodejs (Search)

Frontend (React):
  - React 18
  - Vite
  - Axios

External APIs:
  - OpenAI GPT-4 (Content rewriting)
  - SerpAPI (Google search)

┌─────────────────────────────────────────────────────────────────┐
│  WHAT EACH FILE DOES                                            │
└─────────────────────────────────────────────────────────────────┘

Article.php
  → Defines database model (ORM)
  → Fields: title, slug, url, content_original, content_updated

ArticleController.php
  → Handles API requests
  → Methods: index(), show(), store(), update(), destroy(), latest()

api.php
  → Routes HTTP requests to controller
  → GET/POST/PUT/DELETE /api/articles

scrape_beyondchats.js
  → Fetches BeyondChats blog HTML
  → Parses articles
  → POSTs to Laravel API

fetch_and_rewrite.js
  → GETs latest article
  → Searches Google via SerpAPI
  → Scrapes 2 reference articles
  → Calls OpenAI API
  → PUTs updated content back

App.jsx
  → Main React component
  → Fetches articles from API
  → Renders sidebar + content view
  → Shows original vs updated side-by-side

┌─────────────────────────────────────────────────────────────────┐
│  SUCCESS CRITERIA                                               │
└─────────────────────────────────────────────────────────────────┘

✓ Phase 1: Articles scraped and stored in database
✓ Phase 2: AI successfully rewrites with references
✓ Phase 3: Frontend displays both versions clearly
✓ Documentation: Complete setup instructions provided
✓ Code Quality: Clean, commented, organized
✓ README: Architecture diagram included

