'use strict';

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { URL } = require('url');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ─── Utilities ────────────────────────────────────────────────────────────────

function normalizeUrl(rawUrl) {
  try {
    const withScheme = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
    const parsed = new URL(withScheme);
    const path = (parsed.pathname + parsed.search).replace(/\/$/, '');
    return (parsed.hostname.replace(/^www\./, '') + path).toLowerCase();
  } catch {
    return rawUrl.toLowerCase();
  }
}

function getDomain(rawUrl) {
  try {
    const withScheme = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
    return new URL(withScheme).hostname.replace(/^www\./, '');
  } catch {
    return rawUrl;
  }
}

function ago(ms) {
  return new Date(Date.now() - ms).toISOString();
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

let trails = [
  { id: 't1', name: 'Dog Lovers',        emoji: '🐶', isPublic: true,  memberCount: 24, createdAt: ago(7 * 86400000) },
  { id: 't2', name: 'Travel Ideas',      emoji: '✈️', isPublic: true,  memberCount: 18, createdAt: ago(5 * 86400000) },
  { id: 't3', name: 'Memes',             emoji: '😂', isPublic: true,  memberCount: 31, createdAt: ago(3 * 86400000) },
  { id: 't4', name: 'Music',             emoji: '🎵', isPublic: false, memberCount: 8,  createdAt: ago(10 * 86400000) },
  { id: 't5', name: 'Food & Restaurants', emoji: '🍕', isPublic: true,  memberCount: 15, createdAt: ago(2 * 86400000) },
  { id: 't6', name: 'News',              emoji: '📰', isPublic: false, memberCount: 12, createdAt: ago(86400000) },
];

let crumbs = [
  // ── Dog Lovers ──
  {
    id: 'c1', trailId: 't1',
    url: 'https://www.akc.org/expert-advice/dog-breeds/most-popular-dog-breeds/',
    normalizedUrl: 'akc.org/expert-advice/dog-breeds/most-popular-dog-breeds',
    title: 'Most Popular Dog Breeds of 2024',
    description: 'The AKC reveals the most popular dog breeds — French Bulldogs top the list for the third year running.',
    thumbnail: 'https://picsum.photos/seed/dogs1/600/400',
    domain: 'akc.org',
    savedByCount: 3,
    reactions: { '❤️': 12, '😂': 2, '🔥': 5 },
    commentCount: 4,
    createdAt: ago(2 * 3600000),
  },
  {
    id: 'c2', trailId: 't1',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    normalizedUrl: 'youtube.com/watch?v=dqw4w9wgxcq',
    title: 'Golden Retriever Puppy First Day at Home',
    description: 'Watch as this adorable golden retriever explores its new home for the very first time!',
    thumbnail: 'https://picsum.photos/seed/dogs2/600/400',
    domain: 'youtube.com',
    savedByCount: 7,
    reactions: { '❤️': 24, '😂': 8, '🔥': 11 },
    commentCount: 9,
    createdAt: ago(5 * 3600000),
  },
  // ── Travel Ideas ──
  {
    id: 'c3', trailId: 't2',
    url: 'https://www.lonelyplanet.com/articles/best-places-to-visit',
    normalizedUrl: 'lonelyplanet.com/articles/best-places-to-visit',
    title: 'Best Places to Visit in 2025',
    description: "Lonely Planet's pick of the world's most exciting destinations — from hidden gems to classic icons.",
    thumbnail: 'https://picsum.photos/seed/travel1/600/400',
    domain: 'lonelyplanet.com',
    savedByCount: 5,
    reactions: { '❤️': 18, '😂': 0, '🔥': 14 },
    commentCount: 7,
    createdAt: ago(3 * 3600000),
  },
  {
    id: 'c4', trailId: 't2',
    url: 'https://www.airbnb.com/rooms/123456',
    normalizedUrl: 'airbnb.com/rooms/123456',
    title: 'Stunning Cliffside Villa in Santorini',
    description: 'Wake up to breathtaking caldera views in this whitewashed villa with a private infinity pool.',
    thumbnail: 'https://picsum.photos/seed/travel2/600/400',
    domain: 'airbnb.com',
    savedByCount: 11,
    reactions: { '❤️': 31, '😂': 1, '🔥': 22 },
    commentCount: 13,
    createdAt: ago(8 * 3600000),
  },
  // ── Memes ──
  {
    id: 'c5', trailId: 't3',
    url: 'https://www.reddit.com/r/memes/top',
    normalizedUrl: 'reddit.com/r/memes/top',
    title: 'Top Memes This Week',
    description: 'The funniest, most upvoted memes from r/memes this week.',
    thumbnail: 'https://picsum.photos/seed/memes1/600/400',
    domain: 'reddit.com',
    savedByCount: 9,
    reactions: { '❤️': 8, '😂': 45, '🔥': 17 },
    commentCount: 22,
    createdAt: ago(3600000),
  },
  {
    id: 'c10', trailId: 't3',
    url: 'https://www.ifunny.co/trending',
    normalizedUrl: 'ifunny.co/trending',
    title: 'iFunny Trending — When you try to explain memes to your parents',
    description: 'The struggle is real and everyone on iFunny is losing it.',
    thumbnail: 'https://picsum.photos/seed/memes2/600/400',
    domain: 'ifunny.co',
    savedByCount: 2,
    reactions: { '❤️': 3, '😂': 61, '🔥': 8 },
    commentCount: 17,
    createdAt: ago(1800000),
  },
  // ── Music ──
  {
    id: 'c6', trailId: 't4',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M',
    normalizedUrl: 'open.spotify.com/playlist/37i9dqzf1dxcbwigoybm5m',
    title: "Today's Top Hits — Spotify",
    description: 'The biggest songs right now. Updated every Friday.',
    thumbnail: 'https://picsum.photos/seed/music1/600/400',
    domain: 'open.spotify.com',
    savedByCount: 4,
    reactions: { '❤️': 15, '😂': 0, '🔥': 9 },
    commentCount: 3,
    createdAt: ago(4 * 3600000),
  },
  {
    id: 'c11', trailId: 't4',
    url: 'https://pitchfork.com/reviews/albums/best-albums-2024/',
    normalizedUrl: 'pitchfork.com/reviews/albums/best-albums-2024',
    title: 'The Best Albums of 2024 So Far',
    description: "Our critics' picks for the most essential listens of the year — from indie to hip-hop.",
    thumbnail: 'https://picsum.photos/seed/music2/600/400',
    domain: 'pitchfork.com',
    savedByCount: 1,
    reactions: { '❤️': 7, '😂': 0, '🔥': 5 },
    commentCount: 2,
    createdAt: ago(9 * 3600000),
  },
  // ── Food & Restaurants ──
  {
    id: 'c7', trailId: 't5',
    url: 'https://www.nytimes.com/2024/best-new-restaurants',
    normalizedUrl: 'nytimes.com/2024/best-new-restaurants',
    title: 'The 50 Best New Restaurants in America',
    description: "Our critics ate at hundreds of new restaurants to bring you this definitive list of the year's best openings.",
    thumbnail: 'https://picsum.photos/seed/food1/600/400',
    domain: 'nytimes.com',
    savedByCount: 6,
    reactions: { '❤️': 22, '😂': 1, '🔥': 19 },
    commentCount: 8,
    createdAt: ago(6 * 3600000),
  },
  {
    id: 'c8', trailId: 't5',
    url: 'https://www.bonappetit.com/recipes/easy-weeknight-dinners',
    normalizedUrl: 'bonappetit.com/recipes/easy-weeknight-dinners',
    title: '30 Easy Weeknight Dinner Recipes',
    description: 'Fast, delicious recipes for nights when you just need something simple and satisfying.',
    thumbnail: 'https://picsum.photos/seed/food2/600/400',
    domain: 'bonappetit.com',
    savedByCount: 13,
    reactions: { '❤️': 29, '😂': 0, '🔥': 16 },
    commentCount: 11,
    createdAt: ago(12 * 3600000),
  },
  // ── News ──
  {
    id: 'c9', trailId: 't6',
    url: 'https://www.bbc.com/news/technology',
    normalizedUrl: 'bbc.com/news/technology',
    title: 'Tech Giants Unveil New AI Features at Annual Summit',
    description: 'Major technology companies announce a wave of artificial intelligence integrations across their consumer products.',
    thumbnail: 'https://picsum.photos/seed/news1/600/400',
    domain: 'bbc.com',
    savedByCount: 2,
    reactions: { '❤️': 6, '😂': 3, '🔥': 8 },
    commentCount: 15,
    createdAt: ago(1800000),
  },
  {
    id: 'c12', trailId: 't6',
    url: 'https://www.theguardian.com/world/latest',
    normalizedUrl: 'theguardian.com/world/latest',
    title: 'The Guardian — World News Live Updates',
    description: 'Follow the latest breaking world news with live updates and analysis from The Guardian.',
    thumbnail: 'https://picsum.photos/seed/news2/600/400',
    domain: 'theguardian.com',
    savedByCount: 4,
    reactions: { '❤️': 9, '😂': 0, '🔥': 12 },
    commentCount: 21,
    createdAt: ago(3600000),
  },
];

let breadbox = [];
let nextId = 200;

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Trails
app.get('/api/trails', (_req, res) => res.json(trails));

app.post('/api/trails', (req, res) => {
  const { name, emoji, isPublic } = req.body;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'name is required' });
  }
  const trail = {
    id: `t${++nextId}`,
    name: name.trim(),
    emoji: (emoji && typeof emoji === 'string') ? emoji : '🔗',
    isPublic: isPublic !== false,
    memberCount: 1,
    createdAt: new Date().toISOString(),
  };
  trails.push(trail);
  res.status(201).json(trail);
});

// Crumbs per trail
app.get('/api/trails/:id/crumbs', (req, res) => {
  const trail = trails.find(t => t.id === req.params.id);
  if (!trail) return res.status(404).json({ error: 'Trail not found' });
  const result = crumbs
    .filter(c => c.trailId === req.params.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(result);
});

app.post('/api/trails/:id/crumbs', (req, res) => {
  const trail = trails.find(t => t.id === req.params.id);
  if (!trail) return res.status(404).json({ error: 'Trail not found' });

  const { url, title, description, thumbnail } = req.body;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'url is required' });
  }

  const normalizedUrl = normalizeUrl(url);
  const duplicates = crumbs.filter(c => c.normalizedUrl === normalizedUrl);
  const savedByCount = duplicates.length;

  const crumb = {
    id: `c${++nextId}`,
    trailId: req.params.id,
    url,
    normalizedUrl,
    title: (title && typeof title === 'string') ? title.trim() : url,
    description: (description && typeof description === 'string') ? description.trim() : '',
    thumbnail: (thumbnail && typeof thumbnail === 'string') ? thumbnail : `https://picsum.photos/seed/${nextId}/600/400`,
    domain: getDomain(url),
    savedByCount,
    reactions: { '❤️': 0, '😂': 0, '🔥': 0 },
    commentCount: 0,
    createdAt: new Date().toISOString(),
  };

  crumbs.push(crumb);

  // Update savedByCount for all existing duplicates
  if (savedByCount > 0) {
    crumbs.forEach(c => {
      if (c.normalizedUrl === normalizedUrl) c.savedByCount = savedByCount + 1;
    });
  }

  res.status(201).json(crumb);
});

// Combined feed
app.get('/api/feed', (_req, res) => {
  const sorted = [...crumbs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const enriched = sorted.map(c => ({
    ...c,
    trail: trails.find(t => t.id === c.trailId) || null,
  }));
  res.json(enriched);
});

// Bread Box
app.get('/api/breadbox', (_req, res) => res.json(breadbox));

app.post('/api/breadbox', (req, res) => {
  const { url, title, description, thumbnail } = req.body;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'url is required' });
  }
  const item = {
    id: `bb${++nextId}`,
    url,
    title: (title && typeof title === 'string') ? title.trim() : url,
    description: (description && typeof description === 'string') ? description.trim() : '',
    thumbnail: (thumbnail && typeof thumbnail === 'string') ? thumbnail : `https://picsum.photos/seed/${nextId}/600/400`,
    domain: getDomain(url),
    savedAt: new Date().toISOString(),
  };
  breadbox.push(item);
  res.status(201).json(item);
});

// Reactions
app.post('/api/crumbs/:id/react', (req, res) => {
  const crumb = crumbs.find(c => c.id === req.params.id);
  if (!crumb) return res.status(404).json({ error: 'Crumb not found' });
  const { emoji } = req.body;
  if (!emoji || typeof emoji !== 'string') {
    return res.status(400).json({ error: 'emoji is required' });
  }
  if (!crumb.reactions[emoji]) crumb.reactions[emoji] = 0;
  crumb.reactions[emoji]++;
  res.json(crumb);
});

// URL metadata (Open Graph scraper)
app.get('/api/metadata', async (req, res) => {
  const { url } = req.query;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'url query param is required' });
  }

  let targetUrl = url;
  if (!targetUrl.startsWith('http')) targetUrl = `https://${targetUrl}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Breadcrumbie/1.0; +https://breadcrumbie.app)',
        'Accept': 'text/html,application/xhtml+xml',
      },
      signal: controller.signal,
      redirect: 'follow',
    });
    clearTimeout(timeoutId);

    const html = await response.text();
    const $ = cheerio.load(html);

    const og = (prop) => $(`meta[property="${prop}"]`).attr('content') || '';
    const tw = (name) => $(`meta[name="${name}"]`).attr('content') || '';
    const meta = (name) => $(`meta[name="${name}"]`).attr('content') || '';

    const title = og('og:title') || tw('twitter:title') || $('title').first().text().trim() || '';
    const description = og('og:description') || meta('description') || tw('twitter:description') || '';
    const thumbnail = og('og:image') || tw('twitter:image') || '';
    const domain = getDomain(targetUrl);

    res.json({
      url: targetUrl,
      title: title.substring(0, 200),
      description: description.substring(0, 500),
      thumbnail: thumbnail || null,
      domain,
      favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
    });
  } catch (err) {
    res.status(502).json({ error: 'Failed to fetch URL metadata', details: err.message });
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🍞 Breadcrumbie API running on http://localhost:${PORT}`);
  console.log(`   GET  /api/health`);
  console.log(`   GET  /api/trails`);
  console.log(`   GET  /api/feed`);
  console.log(`   GET  /api/breadbox`);
  console.log(`   GET  /api/metadata?url=<url>`);
  console.log('');
});

module.exports = app;
