export function getApiBaseUrl(): string {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (import.meta.env.PROD) return '/api';
  return 'http://localhost:3000/api';
}

export function getApiOrigin(): string {
  return getApiBaseUrl().replace(/\/api\/?$/, '');
}
