import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from 'react';
import { Trail, Crumb, BreadBoxItem, UrlMetadata, AppNotification } from '../types';

const API_BASE = 'http://localhost:3001/api';
const API_TIMEOUT_MS = 6000;

// ─── Mock data (fallback when backend is offline) ─────────────────────────────

function ago(ms: number) {
  return new Date(Date.now() - ms).toISOString();
}

const MOCK_TRAILS: Trail[] = [
  { id: 't1', name: 'Dog Lovers',         emoji: '🐶', isPublic: true,  memberCount: 24, createdAt: ago(7 * 86400000) },
  { id: 't2', name: 'Travel Ideas',       emoji: '✈️', isPublic: true,  memberCount: 18, createdAt: ago(5 * 86400000) },
  { id: 't3', name: 'Memes',              emoji: '😂', isPublic: true,  memberCount: 31, createdAt: ago(3 * 86400000) },
  { id: 't4', name: 'Music',              emoji: '🎵', isPublic: false, memberCount: 8,  createdAt: ago(10 * 86400000) },
  { id: 't5', name: 'Food & Restaurants', emoji: '🍕', isPublic: true,  memberCount: 15, createdAt: ago(2 * 86400000) },
  { id: 't6', name: 'News',               emoji: '📰', isPublic: false, memberCount: 12, createdAt: ago(86400000) },
];

const MOCK_CRUMBS: (Crumb & { trail?: Trail })[] = [
  {
    id: 'c1', trailId: 't1',
    url: 'https://www.akc.org/expert-advice/dog-breeds/most-popular-dog-breeds/',
    title: 'Most Popular Dog Breeds of 2024',
    description: 'The AKC reveals the most popular dog breeds — French Bulldogs top the list for the third year running.',
    thumbnail: 'https://picsum.photos/seed/dogs1/600/400',
    domain: 'akc.org', savedByCount: 3,
    reactions: { '❤️': 12, '😂': 2, '🔥': 5 }, commentCount: 4,
    createdAt: ago(2 * 3600000), trail: MOCK_TRAILS[0],
  },
  {
    id: 'c2', trailId: 't1',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Golden Retriever Puppy First Day at Home',
    description: 'Watch as this adorable golden retriever explores its new home for the very first time!',
    thumbnail: 'https://picsum.photos/seed/dogs2/600/400',
    domain: 'youtube.com', savedByCount: 7,
    reactions: { '❤️': 24, '😂': 8, '🔥': 11 }, commentCount: 9,
    createdAt: ago(5 * 3600000), trail: MOCK_TRAILS[0],
  },
  {
    id: 'c3', trailId: 't2',
    url: 'https://www.lonelyplanet.com/articles/best-places-to-visit',
    title: 'Best Places to Visit in 2025',
    description: "Lonely Planet's pick of the world's most exciting destinations — from hidden gems to classic icons.",
    thumbnail: 'https://picsum.photos/seed/travel1/600/400',
    domain: 'lonelyplanet.com', savedByCount: 5,
    reactions: { '❤️': 18, '😂': 0, '🔥': 14 }, commentCount: 7,
    createdAt: ago(3 * 3600000), trail: MOCK_TRAILS[1],
  },
  {
    id: 'c4', trailId: 't2',
    url: 'https://www.airbnb.com/rooms/123456',
    title: 'Stunning Cliffside Villa in Santorini',
    description: 'Wake up to breathtaking caldera views in this whitewashed villa with a private infinity pool.',
    thumbnail: 'https://picsum.photos/seed/travel2/600/400',
    domain: 'airbnb.com', savedByCount: 11,
    reactions: { '❤️': 31, '😂': 1, '🔥': 22 }, commentCount: 13,
    createdAt: ago(8 * 3600000), trail: MOCK_TRAILS[1],
  },
  {
    id: 'c5', trailId: 't3',
    url: 'https://www.reddit.com/r/memes/top',
    title: 'Top Memes This Week',
    description: 'The funniest, most upvoted memes from r/memes this week.',
    thumbnail: 'https://picsum.photos/seed/memes1/600/400',
    domain: 'reddit.com', savedByCount: 9,
    reactions: { '❤️': 8, '😂': 45, '🔥': 17 }, commentCount: 22,
    createdAt: ago(3600000), trail: MOCK_TRAILS[2],
  },
  {
    id: 'c10', trailId: 't3',
    url: 'https://www.ifunny.co/trending',
    title: 'When you try to explain memes to your parents 😭',
    description: 'The struggle is real and everyone on iFunny is losing it.',
    thumbnail: 'https://picsum.photos/seed/memes2/600/400',
    domain: 'ifunny.co', savedByCount: 2,
    reactions: { '❤️': 3, '😂': 61, '🔥': 8 }, commentCount: 17,
    createdAt: ago(1800000), trail: MOCK_TRAILS[2],
  },
  {
    id: 'c6', trailId: 't4',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M',
    title: "Today's Top Hits — Spotify",
    description: 'The biggest songs right now. Updated every Friday.',
    thumbnail: 'https://picsum.photos/seed/music1/600/400',
    domain: 'open.spotify.com', savedByCount: 4,
    reactions: { '❤️': 15, '😂': 0, '🔥': 9 }, commentCount: 3,
    createdAt: ago(4 * 3600000), trail: MOCK_TRAILS[3],
  },
  {
    id: 'c11', trailId: 't4',
    url: 'https://pitchfork.com/reviews/albums/best-albums-2024/',
    title: 'The Best Albums of 2024 So Far',
    description: "Our critics' picks for the most essential listens of the year.",
    thumbnail: 'https://picsum.photos/seed/music2/600/400',
    domain: 'pitchfork.com', savedByCount: 1,
    reactions: { '❤️': 7, '😂': 0, '🔥': 5 }, commentCount: 2,
    createdAt: ago(9 * 3600000), trail: MOCK_TRAILS[3],
  },
  {
    id: 'c7', trailId: 't5',
    url: 'https://www.nytimes.com/2024/best-new-restaurants',
    title: 'The 50 Best New Restaurants in America',
    description: "Our critics ate at hundreds of new restaurants to bring you this definitive list.",
    thumbnail: 'https://picsum.photos/seed/food1/600/400',
    domain: 'nytimes.com', savedByCount: 6,
    reactions: { '❤️': 22, '😂': 1, '🔥': 19 }, commentCount: 8,
    createdAt: ago(6 * 3600000), trail: MOCK_TRAILS[4],
  },
  {
    id: 'c8', trailId: 't5',
    url: 'https://www.bonappetit.com/recipes/easy-weeknight-dinners',
    title: '30 Easy Weeknight Dinner Recipes',
    description: 'Fast, delicious recipes for nights when you need something simple and satisfying.',
    thumbnail: 'https://picsum.photos/seed/food2/600/400',
    domain: 'bonappetit.com', savedByCount: 13,
    reactions: { '❤️': 29, '😂': 0, '🔥': 16 }, commentCount: 11,
    createdAt: ago(12 * 3600000), trail: MOCK_TRAILS[4],
  },
  {
    id: 'c9', trailId: 't6',
    url: 'https://www.bbc.com/news/technology',
    title: 'Tech Giants Unveil New AI Features at Annual Summit',
    description: 'Major technology companies announce a wave of AI integrations across consumer products.',
    thumbnail: 'https://picsum.photos/seed/news1/600/400',
    domain: 'bbc.com', savedByCount: 2,
    reactions: { '❤️': 6, '😂': 3, '🔥': 8 }, commentCount: 15,
    createdAt: ago(1800000), trail: MOCK_TRAILS[5],
  },
  {
    id: 'c12', trailId: 't6',
    url: 'https://www.theguardian.com/world/latest',
    title: 'The Guardian — World News Live Updates',
    description: 'Follow the latest breaking world news with live updates and analysis.',
    thumbnail: 'https://picsum.photos/seed/news2/600/400',
    domain: 'theguardian.com', savedByCount: 4,
    reactions: { '❤️': 9, '😂': 0, '🔥': 12 }, commentCount: 21,
    createdAt: ago(3600000), trail: MOCK_TRAILS[5],
  },
];

const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', type: 'reaction', message: 'Someone reacted ❤️ to your crumb in Dog Lovers', trailName: 'Dog Lovers', trailEmoji: '🐶', createdAt: ago(1800000), read: false },
  { id: 'n2', type: 'reaction', message: 'Someone reacted 🔥 to your crumb in Travel Ideas', trailName: 'Travel Ideas', trailEmoji: '✈️', createdAt: ago(3600000), read: false },
  { id: 'n3', type: 'invite', message: 'You were invited to join the Music trail', trailName: 'Music', trailEmoji: '🎵', createdAt: ago(7200000), read: true },
  { id: 'n4', type: 'comment', message: 'Someone commented on your crumb in Food & Restaurants', trailName: 'Food & Restaurants', trailEmoji: '🍕', createdAt: ago(86400000), read: true },
  { id: 'n5', type: 'reaction', message: 'Someone reacted 😂 to your crumb in Memes', trailName: 'Memes', trailEmoji: '😂', createdAt: ago(2 * 86400000), read: true },
];

// ─── State ────────────────────────────────────────────────────────────────────

interface AppState {
  trails: Trail[];
  feed: (Crumb & { trail?: Trail })[];
  breadbox: BreadBoxItem[];
  notifications: AppNotification[];
  trailCrumbs: Record<string, Crumb[]>;
  loading: boolean;
  error: string | null;
  usingMockData: boolean;
}

type Action =
  | { type: 'SET_TRAILS'; payload: Trail[] }
  | { type: 'SET_FEED'; payload: (Crumb & { trail?: Trail })[] }
  | { type: 'SET_BREADBOX'; payload: BreadBoxItem[] }
  | { type: 'SET_TRAIL_CRUMBS'; payload: { trailId: string; crumbs: Crumb[] } }
  | { type: 'ADD_TRAIL'; payload: Trail }
  | { type: 'PREPEND_FEED_CRUMB'; payload: Crumb & { trail?: Trail } }
  | { type: 'ADD_BREADBOX_ITEM'; payload: BreadBoxItem }
  | { type: 'UPDATE_CRUMB'; payload: Crumb }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USING_MOCK'; payload: boolean };

const initialState: AppState = {
  trails: MOCK_TRAILS,
  feed: [...MOCK_CRUMBS].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  breadbox: [],
  notifications: MOCK_NOTIFICATIONS,
  trailCrumbs: {},
  loading: false,
  error: null,
  usingMockData: true,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_TRAILS':
      return { ...state, trails: action.payload };
    case 'SET_FEED':
      return { ...state, feed: action.payload };
    case 'SET_BREADBOX':
      return { ...state, breadbox: action.payload };
    case 'SET_TRAIL_CRUMBS':
      return { ...state, trailCrumbs: { ...state.trailCrumbs, [action.payload.trailId]: action.payload.crumbs } };
    case 'ADD_TRAIL':
      return { ...state, trails: [...state.trails, action.payload] };
    case 'PREPEND_FEED_CRUMB':
      return { ...state, feed: [action.payload, ...state.feed] };
    case 'ADD_BREADBOX_ITEM':
      return { ...state, breadbox: [action.payload, ...state.breadbox] };
    case 'UPDATE_CRUMB':
      return {
        ...state,
        feed: state.feed.map(c => c.id === action.payload.id ? { ...action.payload, trail: c.trail } : c),
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_USING_MOCK':
      return { ...state, usingMockData: action.payload };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppContextType {
  state: AppState;
  fetchTrails: () => Promise<void>;
  fetchFeed: () => Promise<void>;
  fetchTrailCrumbs: (trailId: string) => Promise<void>;
  fetchBreadBox: () => Promise<void>;
  createTrail: (data: { name: string; emoji: string; isPublic: boolean }) => Promise<Trail>;
  addCrumb: (trailId: string, data: { url: string; title?: string; description?: string; thumbnail?: string | null }) => Promise<Crumb>;
  addToBreadBox: (data: { url: string; title?: string; description?: string; thumbnail?: string | null }) => Promise<BreadBoxItem>;
  reactToCrumb: (crumbId: string, emoji: string) => Promise<void>;
  fetchMetadata: (url: string) => Promise<UrlMetadata>;
  markNotificationRead: (id: string) => void;
  getTrailById: (id: string) => Trail | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  async function apiFetch(path: string, options?: RequestInit) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
      });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch {
      clearTimeout(timeout);
      throw new Error('Network unavailable');
    }
  }

  const fetchTrails = useCallback(async () => {
    try {
      const data = await apiFetch('/trails');
      dispatch({ type: 'SET_TRAILS', payload: data });
      dispatch({ type: 'SET_USING_MOCK', payload: false });
    } catch {
      dispatch({ type: 'SET_USING_MOCK', payload: true });
    }
  }, []);

  const fetchFeed = useCallback(async () => {
    try {
      const data = await apiFetch('/feed');
      dispatch({ type: 'SET_FEED', payload: data });
      dispatch({ type: 'SET_USING_MOCK', payload: false });
    } catch {
      dispatch({ type: 'SET_USING_MOCK', payload: true });
    }
  }, []);

  const fetchTrailCrumbs = useCallback(async (trailId: string) => {
    try {
      const data = await apiFetch(`/trails/${trailId}/crumbs`);
      dispatch({ type: 'SET_TRAIL_CRUMBS', payload: { trailId, crumbs: data } });
    } catch {
      const fallback = MOCK_CRUMBS.filter(c => c.trailId === trailId);
      dispatch({ type: 'SET_TRAIL_CRUMBS', payload: { trailId, crumbs: fallback } });
    }
  }, []);

  const fetchBreadBox = useCallback(async () => {
    try {
      const data = await apiFetch('/breadbox');
      dispatch({ type: 'SET_BREADBOX', payload: data });
    } catch {
      // keep empty
    }
  }, []);

  const createTrail = useCallback(async (data: { name: string; emoji: string; isPublic: boolean }): Promise<Trail> => {
    try {
      const trail = await apiFetch('/trails', { method: 'POST', body: JSON.stringify(data) });
      dispatch({ type: 'ADD_TRAIL', payload: trail });
      return trail;
    } catch {
      const trail: Trail = {
        id: `local-${Date.now()}`,
        name: data.name,
        emoji: data.emoji,
        isPublic: data.isPublic,
        memberCount: 1,
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_TRAIL', payload: trail });
      return trail;
    }
  }, []);

  const addCrumb = useCallback(async (
    trailId: string,
    data: { url: string; title?: string; description?: string; thumbnail?: string | null }
  ): Promise<Crumb> => {
    try {
      const crumb = await apiFetch(`/trails/${trailId}/crumbs`, { method: 'POST', body: JSON.stringify(data) });
      const trail = state.trails.find(t => t.id === trailId);
      dispatch({ type: 'PREPEND_FEED_CRUMB', payload: { ...crumb, trail } });
      return crumb;
    } catch {
      const trail = state.trails.find(t => t.id === trailId);
      const crumb: Crumb = {
        id: `local-${Date.now()}`,
        trailId,
        url: data.url,
        title: data.title ?? data.url,
        description: data.description ?? '',
        thumbnail: data.thumbnail ?? `https://picsum.photos/seed/${Date.now()}/600/400`,
        domain: data.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0],
        savedByCount: 0,
        reactions: { '❤️': 0, '😂': 0, '🔥': 0 },
        commentCount: 0,
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: 'PREPEND_FEED_CRUMB', payload: { ...crumb, trail } });
      return crumb;
    }
  }, [state.trails]);

  const addToBreadBox = useCallback(async (
    data: { url: string; title?: string; description?: string; thumbnail?: string | null }
  ): Promise<BreadBoxItem> => {
    try {
      const item = await apiFetch('/breadbox', { method: 'POST', body: JSON.stringify(data) });
      dispatch({ type: 'ADD_BREADBOX_ITEM', payload: item });
      return item;
    } catch {
      const item: BreadBoxItem = {
        id: `local-${Date.now()}`,
        url: data.url,
        title: data.title ?? data.url,
        description: data.description ?? '',
        thumbnail: data.thumbnail ?? null,
        domain: data.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0],
        savedAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_BREADBOX_ITEM', payload: item });
      return item;
    }
  }, []);

  const reactToCrumb = useCallback(async (crumbId: string, emoji: string) => {
    try {
      const crumb = await apiFetch(`/crumbs/${crumbId}/react`, { method: 'POST', body: JSON.stringify({ emoji }) });
      dispatch({ type: 'UPDATE_CRUMB', payload: crumb });
    } catch {
      const crumb = state.feed.find(c => c.id === crumbId);
      if (crumb) {
        const updated = {
          ...crumb,
          reactions: { ...crumb.reactions, [emoji]: (crumb.reactions[emoji] ?? 0) + 1 },
        };
        dispatch({ type: 'UPDATE_CRUMB', payload: updated });
      }
    }
  }, [state.feed]);

  const fetchMetadata = useCallback(async (url: string): Promise<UrlMetadata> => {
    try {
      const data = await apiFetch(`/metadata?url=${encodeURIComponent(url)}`);
      return data as UrlMetadata;
    } catch {
      const domain = url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
      return { url, title: url, description: '', thumbnail: null, domain, favicon: null };
    }
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  }, []);

  const getTrailById = useCallback((id: string) => {
    return state.trails.find(t => t.id === id);
  }, [state.trails]);

  return (
    <AppContext.Provider value={{
      state,
      fetchTrails, fetchFeed, fetchTrailCrumbs, fetchBreadBox,
      createTrail, addCrumb, addToBreadBox, reactToCrumb,
      fetchMetadata, markNotificationRead, getTrailById,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
