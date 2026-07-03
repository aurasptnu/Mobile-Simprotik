// Config API untuk mobile frontend.
// Ganti URL ini kalau ngrok/backend berubah. Setelah hosting, ganti ke domain production.
export const API_BASE_URL = 'https://scooter-coerce-reunite.ngrok-free.dev/api';
export const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');
export const SSO_LOGIN_URL = `${BACKEND_BASE_URL}/login/sso`;

// Jika ingin debug di emulator dengan backend lokal, ganti ke:
// export const API_BASE_URL = 'http://10.0.2.2:8000/api';

export default API_BASE_URL;
