// Node script: fetch latest article, search, scrape two refs, call OpenAI, update article via Laravel API

const axios = require('axios');
const Cheerio = require('cheerio');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const SERPAPI_KEY = process.env.SERPAPI_KEY;
const OPENAI_KEY = process.env.OPENAI_API_KEY;
const LARAVEL_API = process.env.LARAVEL_API_URL || 'http://127.0.0.1:8000/api';

if (!OPENAI_KEY) {
  console.error('Please set OPENAI_API_KEY in .env');
  process.exit(1);
}

const openai = new OpenAIApi(new Configuration({ apiKey: OPENAI_KEY }));

async function getLatestArticle() {
  const res = await axios.get(`${LARAVEL_API}/articles/latest`);
  return res.data;
}

async function searchGoogle(query) {
  if (!SERPAPI_KEY) {
    throw new Error('Set SERPAPI_KEY in .env to use SerpAPI for Google search');
  }
  
  // Use SerpAPI via HTTP GET request
  const params = new URLSearchParams({
    q: query,
    api_key: SERPAPI_KEY,
    num: 5
  });
  
  const res = await axios.get(`https://serpapi.com/search?${params}`);
  return res.data.organic_results || [];
}

async function scrapeMainContent(url) {
  try {
    const res = await axios.get(url, { timeout: 15000, headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = Cheerio.load(res.data);
    // Naive main content heuristics
    const selectors = ['article', 'main', '[role="main"]', '.post', '.entry-content', '#content'];
    for (const sel of selectors) {
      const node = $(sel);
      if (node && node.text().trim().length > 200) {
        return node.text().trim();
      }
    }
    // fallback to body text
    return $('body').text().trim().slice(0, 4000);
  } catch (err) {
    console.error('Scrape failed for', url, err.message);
    return null;
  }
}

async function callLLMToRewrite(originalTitle, originalContent, references) {
  const prompt = `You are an editor. Rewrite the article titled: "${originalTitle}" so its tone, structure, and formatting resemble the following two reference articles. Keep the meaning of the original content but reformat, improve clarity, and match typical blog style. Keep it under 1000 words. At the bottom include a "References" section listing the two URLs.

Original article:
${originalContent}

References:
${references.map(r=>r.url).join('\n')}

Provide the rewritten article content in plain text format with clear paragraphs.`;

  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'system', content: 'You are a helpful editor.' }, { role: 'user', content: prompt }],
    max_tokens: 1400,
    temperature: 0.7,
  });

  return completion.data.choices[0].message.content;
}

async function updateArticle(id, payload) {
  const res = await axios.put(`${LARAVEL_API}/articles/${id}`, payload, { headers: { 'Content-Type': 'application/json' } });
  return res.data;
}

async function run() {
  try {
    console.log('Fetching latest article from API...');
    const article = await getLatestArticle();
    console.log('Got:', article.title || article.id);

    console.log('Searching web for article title...');
    const results = await searchGoogle(article.title);
    const refs = (results || []).filter(r => r.link).slice(0, 5);
    
    // pick first two that look like blog/article
    const picked = [];
    for (const r of refs) {
      if (picked.length >= 2) break;
      const url = r.link || r.url;
      if (!url) continue;
      // simple filter: skip same domain
      if (article.url && url.includes(new URL(article.url).hostname)) continue;
      picked.push({ title: r.title, url });
    }

    console.log('Picked references:', picked.map(p=>p.url));

    if (picked.length === 0) {
      console.error('No references found. Exiting.');
      return;
    }

    const scraped = [];
    for (const p of picked) {
      const content = await scrapeMainContent(p.url);
      if (content) scraped.push({ url: p.url, title: p.title, content });
    }

    if (scraped.length === 0) {
      console.error('No references scraped. Exiting.');
      return;
    }

    console.log('Calling LLM to rewrite article...');
    const newContent = await callLLMToRewrite(article.title, article.content_original || article.content_updated || '', scraped);

    const updated = await updateArticle(article.id, { content_updated: newContent });
    console.log('✓ Article updated:', updated.id || updated.title);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

run();
