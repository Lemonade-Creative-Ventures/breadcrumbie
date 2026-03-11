export function getDomain(rawUrl: string): string {
  try {
    const withScheme = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
    return new URL(withScheme).hostname.replace(/^www\./, '');
  } catch {
    return rawUrl;
  }
}

export function normalizeUrl(rawUrl: string): string {
  try {
    const withScheme = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
    const parsed = new URL(withScheme);
    const path = (parsed.pathname + parsed.search).replace(/\/$/, '');
    return (parsed.hostname.replace(/^www\./, '') + path).toLowerCase();
  } catch {
    return rawUrl.toLowerCase();
  }
}

export function isValidUrl(url: string): boolean {
  try {
    const withScheme = url.startsWith('http') ? url : `https://${url}`;
    new URL(withScheme);
    return true;
  } catch {
    return false;
  }
}
