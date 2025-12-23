// Simple scraper to fetch the last page of BeyondChats blogs and POST 5 oldest articles to Laravel API

const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

const LARAVEL_API = process.env.LARAVEL_API_URL || 'http://127.0.0.1:8000/api';
const BLOGS_URL = 'https://beyondchats.com/blogs/';

async function fetchLastPage() {
  const res = await axios.get(BLOGS_URL, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const $ = cheerio.load(res.data);
  // Heuristic: find pagination links and click the last one
  const pages = $('a[href*="/blogs?page="]');
  let lastHref = null;
  pages.each((i, el) => { lastHref = $(el).attr('href'); });
  if (!lastHref) {
    // No pagination found, use base page
    return BLOGS_URL;
  }
  if (!lastHref.startsWith('http')) lastHref = new URL(lastHref, BLOGS_URL).href;
  return lastHref;
}

async function parseArticles(pageUrl) {
  const res = await axios.get(pageUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const $ = cheerio.load(res.data);
  const articles = [];
  // Heuristic: find article links on the page
  $('a').each((i, el) => {
    const href = $(el).attr('href');
    const text = $(el).text().trim();
    if (href && text && href.includes('/blogs/')) {
      const url = href.startsWith('http') ? href : new URL(href, pageUrl).href;
      articles.push({ title: text, url });
    }
  });
  // dedupe by url
  const seen = new Set();
  const dedup = articles.filter(a => { if (seen.has(a.url)) return false; seen.add(a.url); return true; });
  return dedup.slice(0, 10);
}

async function fetchArticleContent(url) {
  try {
    const res = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(res.data);
    const selectors = ['article', 'main', '[role="main"]', '.post', '.entry-content', '#content'];
    for (const sel of selectors) {
      const node = $(sel);
      if (node && node.text && node.text().trim().length > 200) return node.text().trim();
    }
    return $('body').text().trim().slice(0, 4000);
  } catch (err) {
    console.error('Failed to fetch article', url, err.message);
    return null;
  }
}

async function postArticle(article) {
  try {
    const res = await axios.post(`${LARAVEL_API}/articles`, article);
    return res.data;
  } catch (err) {
    console.error('Failed to POST article', article.title, err.message);
    return null;
  }
}

async function run() {
  const lastPage = await fetchLastPage();
  console.log('Last page URL:', lastPage);
  const list = await parseArticles(lastPage);
  console.log('Found article links:', list.length);
  // We'll fetch oldest 5 (assume page is oldest-first)
  const toSave = list.slice(-5);
  for (const item of toSave) {
    const content = await fetchArticleContent(item.url);
    if (!content) continue;
    const payload = {
      title: item.title,
      url: item.url,
      content_original: content
    };
    const saved = await postArticle(payload);
    if (saved) console.log('Saved:', saved.id || saved.title);
  }
}

run().catch(err => { console.error(err); process.exit(1); });
