// Base API URL production domain untuk backend SIMPROTIK.
export const API_BASE_URL = 'https://tugas.tik.unila.ac.id/api';
export const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');
export const SSO_LOGIN_URL = `${API_BASE_URL}/auth/sso`;
export const SSO_CALLBACK_PATH = '/auth/sso/callback';
export const SSO_CALLBACK_HOST = BACKEND_BASE_URL.replace(/^https?:\/\//, '').replace(/\/.*$/, '');

export function apiUrl(path: string) {
  const base = API_BASE_URL.replace(/\/+$/g, '');
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${base}${suffix}`;
}

export default API_BASE_URL;

