// Base API URL — ganti ini jika backend mengirim URL ngrok baru.
// Setelah hosting, ganti ke domain production.
export const API_BASE_URL = 'https://scooter-coerce-reunite.ngrok-free.dev/api';
export const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');
export const SSO_LOGIN_URL = `${BACKEND_BASE_URL}/login/sso`;

export function apiUrl(path: string) {
  const base = API_BASE_URL.replace(/\/+$/g, '');
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${base}${suffix}`;
}

export default API_BASE_URL;
