# 🍞 Breadcrumbie

A mobile-first social sharing app where users collect and share things they find online.
Users create **Trails** (group feeds for links) and share **Crumbs** (posts with rich URL previews).

## Features

- 🕵️ **Anonymous sharing** — drop crumbs without anyone knowing it's you
- 🔁 **Duplicate detection** — see "Saved by N people" when a link is popular
- 📦 **Bread Box** — save links for later
- 🔍 **Explore** — browse public trails and create new ones
- 🔔 **Activity** — reactions, comments, and trail invites
- 🍞 **Drop a Crumb** — polished share sheet with URL preview

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | React Native + Expo (TypeScript) |
| Navigation | Expo Router (file-based) |
| State | React Context + useReducer |
| Backend | Node.js + Express |
| Data | In-memory store (MVP) |

## Project Structure

```
breadcrumbie/
├── backend/               # Express API server
│   ├── server.js          # All routes + seed data
│   └── package.json
└── app/                   # React Native / Expo app
    ├── app/               # Expo Router pages
    │   ├── _layout.tsx    # Root layout
    │   ├── (tabs)/        # Tab screens
    │   │   ├── index.tsx      # Home feed
    │   │   ├── explore.tsx    # Explore trails
    │   │   ├── share.tsx      # Drop a Crumb
    │   │   ├── activity.tsx   # Notifications
    │   │   └── profile.tsx    # You / profile
    │   └── trail/[id].tsx # Individual trail feed
    ├── components/        # Shared components
    │   ├── CrumbCard.tsx  # Content card with reactions
    │   ├── TrailSlice.tsx # Horizontal trail bubbles
    │   ├── ShareSheet.tsx # Drop a Crumb modal
    │   └── BreadBox.tsx   # Saved links drawer
    ├── store/
    │   └── AppContext.tsx  # Global state + API calls
    ├── constants/Colors.ts
    ├── types/index.ts
    └── utils/
        ├── time.ts
        └── url.ts
```

## Requirements

- **Node.js** ≥ 20.18.1 (required by the cheerio dependency for Open Graph metadata fetching)

## Getting Started

### 1. Start the Backend

```bash
cd backend
npm install
npm start
# → 🍞 Breadcrumbie API running on http://localhost:3001
```

### 2. Test the API

```bash
curl http://localhost:3001/api/health
curl http://localhost:3001/api/trails
curl http://localhost:3001/api/feed
```

### 3. Run the Mobile App

```bash
cd app
npm install
npm start          # Expo dev server
# Press i for iOS simulator, a for Android, w for web
```

> **Note:** The app works in "demo mode" with mock data if the backend is offline.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/trails` | List all trails |
| POST | `/api/trails` | Create a trail |
| GET | `/api/trails/:id/crumbs` | Get crumbs for a trail |
| POST | `/api/trails/:id/crumbs` | Add a crumb to a trail |
| GET | `/api/feed` | Combined feed (all trails) |
| GET | `/api/breadbox` | Get bread box items |
| POST | `/api/breadbox` | Save to bread box |
| POST | `/api/crumbs/:id/react` | Add reaction to crumb |
| GET | `/api/metadata?url=` | Fetch Open Graph metadata |

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#F5A623` | Amber gold — CTAs, active states |
| Background | `#FAFAF8` | Warm white screen background |
| Card | `#FFFFFF` | Card surfaces |
| Text | `#1A1A1A` | Primary text |
| Muted | `#8E8E8E` | Secondary text, timestamps |

## Seed Data

The app comes with 6 pre-seeded trails:
- 🐶 Dog Lovers (public, 24 members)
- ✈️ Travel Ideas (public, 18 members)
- 😂 Memes (public, 31 members)
- 🎵 Music (invite-only, 8 members)
- 🍕 Food & Restaurants (public, 15 members)
- 📰 News (invite-only, 12 members)

## Deployment to GitHub Pages

The repository includes a GitHub Actions workflow (`.github/workflows/deploy-pages.yml`) that automatically builds and deploys the Expo web app to GitHub Pages.

### Setup Instructions

1. **Enable GitHub Pages** in your repository settings:
   - Go to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**

2. **Push to the `main` branch** to trigger the deployment workflow

3. **Access your deployed app** at: `https://<username>.github.io/<repository-name>/`

### Important Notes

- **Backend API**: The deployed web app will run in "demo mode" with mock data since GitHub Pages only hosts static files. To use the full backend API:
  - Deploy the backend separately (e.g., on Heroku, Railway, Render, or Vercel)
  - Update the `API_BASE` constant in `app/store/AppContext.tsx` to point to your deployed backend URL
  
- **Manual Deployment**: You can also trigger the workflow manually from the **Actions** tab in your GitHub repository

- **Build Output**: The workflow exports the Expo web app to a static bundle in the `app/dist/` directory
