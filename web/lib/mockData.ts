export interface Crumb {
  id: string
  trailId: string
  userId: string
  url: string
  note?: string
  createdAt: string
  userName: string
}

export interface Trail {
  id: string
  name: string
  ownerId: string
  ownerName: string
  isPublic: boolean
  isAnonymous: boolean
  inviteCode?: string
  createdAt: string
  crumbCount: number
}

export interface User {
  id: string
  email: string
  name: string
}

// Mock users
export const mockUsers: User[] = [
  { id: '1', email: 'alice@example.com', name: 'Alice' },
  { id: '2', email: 'bob@example.com', name: 'Bob' },
  { id: '3', email: 'charlie@example.com', name: 'Charlie' },
]

// Mock trails
export const mockTrails: Trail[] = [
  {
    id: '1',
    name: 'Design Inspiration',
    ownerId: '1',
    ownerName: 'Alice',
    isPublic: true,
    isAnonymous: false,
    createdAt: '2024-01-15T10:00:00Z',
    crumbCount: 12,
  },
  {
    id: '2',
    name: 'Weekend Recipes',
    ownerId: '1',
    ownerName: 'Alice',
    isPublic: false,
    isAnonymous: false,
    inviteCode: 'RECIPE2024',
    createdAt: '2024-02-01T14:30:00Z',
    crumbCount: 8,
  },
  {
    id: '3',
    name: 'Tech Articles',
    ownerId: '2',
    ownerName: 'Bob',
    isPublic: true,
    isAnonymous: false,
    createdAt: '2024-01-20T09:15:00Z',
    crumbCount: 24,
  },
  {
    id: '4',
    name: 'Anonymous Tips',
    ownerId: '3',
    ownerName: 'Anonymous',
    isPublic: true,
    isAnonymous: true,
    createdAt: '2024-02-10T16:45:00Z',
    crumbCount: 5,
  },
]

// Mock crumbs
export const mockCrumbs: Crumb[] = [
  {
    id: '1',
    trailId: '1',
    userId: '1',
    userName: 'Alice',
    url: 'https://dribbble.com/shots/12345',
    note: 'Beautiful color palette for our next project',
    createdAt: '2024-03-20T10:30:00Z',
  },
  {
    id: '2',
    trailId: '1',
    userId: '1',
    userName: 'Alice',
    url: 'https://www.awwwards.com/website/example',
    note: 'Amazing parallax effect',
    createdAt: '2024-03-19T14:20:00Z',
  },
  {
    id: '3',
    trailId: '3',
    userId: '2',
    userName: 'Bob',
    url: 'https://dev.to/article/react-best-practices',
    note: 'Must read for React developers',
    createdAt: '2024-03-21T09:15:00Z',
  },
  {
    id: '4',
    trailId: '3',
    userId: '2',
    userName: 'Bob',
    url: 'https://github.com/awesome/project',
    createdAt: '2024-03-21T11:00:00Z',
  },
  {
    id: '5',
    trailId: '2',
    userId: '1',
    userName: 'Alice',
    url: 'https://www.bonappetit.com/recipe/pasta',
    note: 'Try this for Sunday dinner',
    createdAt: '2024-03-18T16:30:00Z',
  },
  {
    id: '6',
    trailId: '4',
    userId: '3',
    userName: 'Anonymous',
    url: 'https://example.com/helpful-resource',
    note: 'This saved me hours of debugging',
    createdAt: '2024-03-22T08:45:00Z',
  },
]

// Current user for mock session
export const currentUser = mockUsers[0]

// Helper functions
export function getTrailById(id: string): Trail | undefined {
  return mockTrails.find(trail => trail.id === id)
}

export function getCrumbsByTrailId(trailId: string): Crumb[] {
  return mockCrumbs.filter(crumb => crumb.trailId === trailId)
}

export function getRecentCrumbs(limit: number = 10): Crumb[] {
  return [...mockCrumbs]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function extractDomain(url: string): string {
  try {
    const domain = new URL(url).hostname
    return domain.replace('www.', '')
  } catch {
    return url
  }
}
