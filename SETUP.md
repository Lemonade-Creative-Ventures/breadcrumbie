# Breadcrumbie — Setup Guide

This guide explains how to get the Breadcrumbie project running from scratch. It is written for beginners who may not be familiar with all the tools involved.

---

## Quick Start (Web App with Mock Data)

**Want to run the web app locally right now?** Follow these steps:

1. **Install Node.js** (v18 or higher) from [nodejs.org](https://nodejs.org)

2. **Clone the repository:**
   ```bash
   git clone https://github.com/Lemonade-Creative-Ventures/breadcrumbie.git
   cd breadcrumbie/web
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser** and go to [http://localhost:3000](http://localhost:3000)

That's it! The web app is now running with mock data. No database or authentication setup required yet.

---

## What you will need for full setup

To set up the complete system (including database and iOS app), install the following:

| Tool | Why you need it | Install |
|------|----------------|---------|
| [Node.js](https://nodejs.org) (v18+) | Runs the Next.js web app | Download from nodejs.org |
| [npm](https://npmjs.com) | Installs JavaScript packages (comes with Node.js) | Included with Node.js |
| [Xcode](https://developer.apple.com/xcode/) (v15+) | Builds the iOS app and Share Extension | Mac App Store |
| [Git](https://git-scm.com) | Downloads and tracks the code | `xcode-select --install` |
| A [Supabase](https://supabase.com) account | Provides the database and auth | Free at supabase.com |
| An [Apple Developer](https://developer.apple.com) account | Required for TestFlight distribution | $99/year |

---

## Part 1 — Set up Supabase (Optional - for production)

1. Go to [supabase.com](https://supabase.com) and create a free account.
2. Create a new project. Give it a name like `breadcrumbie`.
3. Once the project is ready, go to **Settings → API**.
4. Copy the **Project URL** and the **anon public key** — you will need these in the next steps.
5. In the Supabase dashboard, go to the **SQL Editor** and create the following tables:

```sql
-- Trails
create table trails (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid references auth.users(id),
  is_public boolean default true,
  is_anonymous boolean default false,
  invite_code text,
  created_at timestamptz default now()
);

-- Crumbs
create table crumbs (
  id uuid primary key default gen_random_uuid(),
  trail_id uuid references trails(id),
  user_id uuid references auth.users(id),
  url text not null,
  note text,
  created_at timestamptz default now()
);

-- Follows
create table follows (
  user_id uuid references auth.users(id),
  trail_id uuid references trails(id),
  primary key (user_id, trail_id)
);
```

6. Enable Row Level Security (RLS) on each table and add policies as needed. For a quick start, you can allow authenticated users to read and write their own data.

---

## Part 2 — Run the Next.js web app (with database - optional)

**Note:** The web app currently runs with mock data only. Database integration is not yet implemented.

For the current version with mock data, see the Quick Start section above.

Once Supabase is configured (future step), you will:

1. Open a terminal and clone the repository:

```bash
git clone https://github.com/Lemonade-Creative-Ventures/breadcrumbie.git
cd breadcrumbie/web
```

2. Install dependencies:

```bash
npm install
```

3. Create a file called `.env.local` in the `web/` folder with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and go to `http://localhost:3000`. The web app should be running.

---

## Part 3 — Build the iOS app

1. Open the `ios/` folder in Xcode:

```bash
open ios/Breadcrumbie.xcodeproj
```

2. In Xcode, select your Apple Developer team under **Signing & Capabilities** for both the main app target (`Breadcrumbie`) and the Share Extension target (`ShareExtension`).

3. Add your Supabase URL and anon key to the iOS app. The simplest place to put them for an MVP is in a `Config.swift` file:

```swift
// ios/Breadcrumbie/Config.swift
enum Config {
    static let supabaseURL = "https://your-project.supabase.co"
    static let supabaseAnonKey = "your-anon-key"
}
```

4. Make sure both the main app and the Share Extension belong to the same **App Group** (e.g. `group.com.yourname.breadcrumbie`). This lets them share the auth token. You set this up in Xcode under **Signing & Capabilities → App Groups**.

5. Connect a physical iPhone (or use the Simulator) and press the **Run** button (▶) in Xcode to build and run the app.

---

## Part 4 — Test the Share Extension

1. Build and run the app on your iPhone at least once so iOS registers the Share Extension.
2. Open Safari and navigate to any webpage.
3. Tap the **Share** button (the box with an arrow pointing up).
4. Scroll through the share sheet and look for **Breadcrumbie**. If you do not see it, tap **More** and enable it.
5. Tap **Breadcrumbie**. The Share Extension UI should appear, letting you pick a trail and save the crumb.

---

## Part 5 — Distribute via TestFlight

1. In Xcode, set the **Scheme** to your main app target and choose **Any iOS Device** as the destination.
2. Go to **Product → Archive**. This builds a release version of the app.
3. When the archive is ready, the **Organizer** window opens. Click **Distribute App** and follow the steps to upload it to App Store Connect.
4. In [App Store Connect](https://appstoreconnect.apple.com), go to your app, then **TestFlight**, and add testers by email.
5. Testers will receive an email invite and can install the app via the TestFlight app on their iPhone.

---

## Quick Reference

| Command | What it does |
|---------|-------------|
| `npm install` | Install all dependencies (run this first) |
| `npm run dev` | Start the Next.js dev server at localhost:3000 |
| `npm run build` | Build the Next.js app for production |
| `npm start` | Run the production build locally |
| `npm run lint` | Check code for style issues |

---

## Folder Reference

| Folder | Contents |
|--------|----------|
| `web/` | Next.js web app |
| `ios/Breadcrumbie/` | Main SwiftUI iOS app |
| `ios/ShareExtension/` | iOS Share Extension |

---

## Need help?

- [Supabase docs](https://supabase.com/docs)
- [Next.js docs](https://nextjs.org/docs)
- [Apple Share Extension guide](https://developer.apple.com/documentation/foundation/app_extension_support/creating_an_app_extension)
- [TestFlight documentation](https://developer.apple.com/testflight/)
