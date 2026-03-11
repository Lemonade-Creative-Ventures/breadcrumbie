export interface Trail {
  id: string;
  name: string;
  emoji: string;
  isPublic: boolean;
  memberCount: number;
  createdAt: string;
}

export interface Crumb {
  id: string;
  trailId: string;
  url: string;
  title: string;
  description: string;
  thumbnail: string | null;
  domain: string;
  savedByCount: number;
  reactions: Record<string, number>;
  commentCount: number;
  createdAt: string;
  trail?: Trail;
}

export interface BreadBoxItem {
  id: string;
  url: string;
  title: string;
  description: string;
  thumbnail: string | null;
  domain: string;
  savedAt: string;
}

export interface UrlMetadata {
  url: string;
  title: string;
  description: string;
  thumbnail: string | null;
  domain: string;
  favicon: string | null;
}

export interface AppNotification {
  id: string;
  type: 'reaction' | 'comment' | 'invite';
  message: string;
  trailName: string;
  trailEmoji: string;
  createdAt: string;
  read: boolean;
}
