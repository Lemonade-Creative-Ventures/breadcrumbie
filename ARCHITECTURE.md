# Breadcrumbie — Architecture Overview

## What is Breadcrumbie?

Breadcrumbie is a link and media saving app built around the concept of **trails** — curated collections of saved items called **crumbs**. Users drop crumbs into trails directly from the iOS share sheet, the iOS app, or the web.

---

## System Components

### 1. Next.js Web App

The web app is the main browsing and management experience. It runs in the browser and lets users:

- Sign up and log in
- Create, view, and manage trails
- Browse their home feed (recent crumbs from all trails they follow or belong to)
- Drop crumbs manually by pasting a URL
- Follow public trails or join private trails with an invite code

The web app talks directly to Supabase for auth and data.

**Location in repo:** `web/`

---

### 2. iOS App (SwiftUI)

The iOS app is a lightweight native app distributed through TestFlight. It lets users:

- Log in with their Supabase account
- View their trails and home feed
- Drop crumbs from within the app
- Act as the host container for the Share Extension

The iOS app is required to appear in the iOS share sheet — Apple requires that a Share Extension be bundled inside a full iOS app.

**Location in repo:** `ios/`

---

### 3. iOS Share Extension

The Share Extension is the core mobile feature. It appears in the native iOS share sheet when a user shares a link or text from any app (Safari, Notes, Twitter, etc.).

When triggered, the Share Extension:

1. Receives the shared URL or text from iOS
2. Shows a small UI for selecting a trail and optionally adding a note
3. Sends the crumb to Supabase via the REST API
4. Dismisses and returns the user to whatever app they were using

The Share Extension runs in its own process but shares a Supabase API key and auth token with the main iOS app via a shared App Group.

**Location in repo:** `ios/ShareExtension/`

---

### 4. Supabase (Backend)

Supabase provides everything the backend needs for this MVP:

- **Auth** — Email/password login and session management
- **Database** — PostgreSQL tables for users, trails, and crumbs
- **Row Level Security (RLS)** — Enforces that users can only read/write data they are allowed to access
- **REST API** — Used directly by both the iOS app and the Share Extension to read and write data without a custom server

No custom backend server is needed for the MVP.

---

## Recommended Folder Structure

```
breadcrumbie/
├── ARCHITECTURE.md       ← this file
├── SETUP.md              ← beginner setup guide
├── README.md
│
├── web/                  ← Next.js web app
│   ├── app/              ← Next.js App Router pages and layouts
│   ├── components/       ← Shared UI components
│   ├── lib/              ← Supabase client and helpers
│   ├── public/
│   ├── package.json
│   └── ...
│
└── ios/                  ← Xcode project
    ├── Breadcrumbie/     ← Main iOS app (SwiftUI)
    ├── ShareExtension/   ← Share Extension target
    └── Breadcrumbie.xcodeproj
```

---

## Full User Flow: Share Sheet to Saved Crumb

Here is how a crumb gets saved when a user shares a link from Safari:

```
1. User taps "Share" in Safari
        ↓
2. iOS share sheet appears — user taps "Breadcrumbie"
        ↓
3. Share Extension activates
   - Reads the URL from the share payload
   - Loads the user's trail list from Supabase
        ↓
4. User picks a trail (and optionally adds a note)
        ↓
5. Share Extension calls Supabase REST API
   - POST to the `crumbs` table with: url, trail_id, user_id, note
        ↓
6. Supabase saves the crumb and enforces RLS
        ↓
7. Share Extension dismisses — user is returned to Safari
        ↓
8. Crumb appears in the trail on the web app and iOS app
```

---

## Data Model (MVP)

| Table    | Key Columns                                                                 |
|----------|-----------------------------------------------------------------------------|
| `users`  | id, email (managed by Supabase Auth)                                        |
| `trails` | id, name, owner_id, is_public, is_anonymous, invite_code, created_at        |
| `crumbs` | id, trail_id, user_id, url, note, created_at                                |
| `follows`| user_id, trail_id (tracks who follows which public trail)                   |

---

## Auth Strategy

- Web app uses the Supabase JavaScript client (`@supabase/supabase-js`) with cookie-based sessions via `@supabase/ssr`
- iOS app stores the Supabase JWT in the iOS Keychain
- Share Extension reads the JWT from a shared App Group keychain so it can make authenticated API calls without re-logging in
