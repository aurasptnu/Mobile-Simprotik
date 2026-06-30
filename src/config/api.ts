// Config API untuk mobile frontend.
// Ganti URL ini kalau ngrok/backend berubah. Setelah hosting, ganti ke domain production.
export const API_BASE_URL = 'https://scooter-coerce-reunite.ngrok-free.dev/api';
export const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');
export const SSO_LOGIN_URL = `${BACKEND_BASE_URL}/login/sso`;

export default API_BASE_URL;
