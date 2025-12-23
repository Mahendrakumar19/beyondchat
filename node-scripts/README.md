Node scripts — README

This folder contains `fetch_and_rewrite.js` which performs Phase 2:
- Fetch the latest article from the Laravel API (`/api/articles/latest`).
- Search the article title using SerpAPI (set `SERPAPI_KEY` in .env)
- Scrape the main content from top 2 reference articles.
- Call OpenAI to rewrite the original article and mimic formatting/tone of references.
- Update the article via `PUT /api/articles/{id}` with `content_updated`.

Setup
1) cd node-scripts
2) npm install
3) Create a `.env` file with:
   LARAVEL_API_URL=http://127.0.0.1:8000/api
   SERPAPI_KEY=your_serpapi_key
   OPENAI_API_KEY=your_openai_key
4) npm run

Notes
- The script uses heuristics to find main content; results vary by site. In a production system use a dedicated article extractor.
- You can replace SerpAPI search with Google Custom Search by editing `fetch_and_rewrite.js`.
