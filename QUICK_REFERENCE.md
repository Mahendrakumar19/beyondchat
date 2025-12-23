# Quick Reference Card

## Start All Services

```powershell
# Terminal 1 - Laravel Backend
cd D:\BeyondChatAssessment\backend
php artisan serve

# Terminal 2 - React Frontend  
cd D:\BeyondChatAssessment\frontend
npm run dev

# Terminal 3 - Node Scripts (as needed)
cd D:\BeyondChatAssessment\node-scripts
npm run scrape    # Scrape articles from BeyondChats
npm run run       # Rewrite latest article with AI
```

## URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://127.0.0.1:8000/api
- **Test API:** http://127.0.0.1:8000/api/articles

## Common Commands

### Backend (Laravel)
```powershell
php artisan migrate          # Run migrations
php artisan migrate:fresh    # Reset database
php artisan serve            # Start server
```

### Frontend (React)
```powershell
npm install                  # Install dependencies
npm run dev                  # Start dev server
npm run build                # Production build
```

### Scripts (Node.js)
```powershell
npm install                  # Install dependencies
npm run scrape              # Scrape BeyondChats articles
npm run run                 # AI rewrite pipeline
```

## File Locations

### Key Backend Files
- Model: `backend/app/Models/Article.php`
- Controller: `backend/app/Http/Controllers/ArticleController.php`
- Routes: `backend/routes/api.php`
- Migration: `backend/database/migrations/2025_12_21_000000_create_articles_table.php`
- Database: `backend/database/database.sqlite`

### Key Frontend Files
- Main App: `frontend/src/App.jsx`
- Entry: `frontend/src/main.jsx`
- Config: `frontend/vite.config.js`

### Node Scripts
- Scraper: `node-scripts/scrape_beyondchats.js`
- Rewriter: `node-scripts/fetch_and_rewrite.js`
- Config: `node-scripts/.env`

## Database Schema

### articles table
| Column | Type | Description |
|--------|------|-------------|
| id | integer | Primary key |
| title | string | Article title |
| slug | string | URL-friendly slug |
| url | string | Source URL |
| content_original | text | Original scraped content |
| content_updated | text | AI-rewritten content |
| source | string | Source identifier |
| published_at | timestamp | Publication date |
| created_at | timestamp | Record created |
| updated_at | timestamp | Record updated |

## API Testing

### Create Article
```powershell
curl -X POST http://127.0.0.1:8000/api/articles `
  -H "Content-Type: application/json" `
  -d '{\"title\":\"Test\",\"content_original\":\"Content here\"}'
```

### Get All Articles
```powershell
curl http://127.0.0.1:8000/api/articles
```

### Get Latest Article
```powershell
curl http://127.0.0.1:8000/api/articles/latest
```

### Update Article
```powershell
curl -X PUT http://127.0.0.1:8000/api/articles/1 `
  -H "Content-Type: application/json" `
  -d '{\"content_updated\":\"Updated content\"}'
```

## Environment Variables

### Backend (.env)
```env
DB_CONNECTION=sqlite
DB_DATABASE=D:\BeyondChatAssessment\backend\database\database.sqlite
```

### Node Scripts (.env)
```env
LARAVEL_API_URL=http://127.0.0.1:8000/api
SERPAPI_KEY=your_key
OPENAI_API_KEY=sk-your_key
```

### Frontend (.env)
```env
VITE_API_URL=http://127.0.0.1:8000/api
```

## Troubleshooting Quick Fixes

| Issue | Solution |
|-------|----------|
| Laravel "No key" error | `php artisan key:generate` |
| Database not found | Create file: `New-Item database\database.sqlite` |
| CORS errors | Check Laravel CORS config |
| Frontend blank page | Check browser console, verify API URL |
| Scraper empty results | Check BeyondChats site structure |
| OpenAI errors | Verify API key and credits |

## Project Flow

1. **Scrape** → BeyondChats blog → Laravel API → Database
2. **Rewrite** → Get article → Search Google → Scrape refs → OpenAI → Update API
3. **Display** → React fetches → Shows original + updated

## Next Steps After Setup

1. Run `npm run scrape` to get articles
2. Verify articles in frontend
3. Run `npm run run` to test AI rewriting
4. Check updated content in frontend
5. Deploy frontend for live demo (optional)
