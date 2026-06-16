// Base API URL — ganti ini jika backend mengirim URL ngrok baru
export const API_BASE_URL = 'https://scooter-coerce-reunite.ngrok-free.dev/api';

// Utility untuk menyusun endpoint yang aman terhadap slash ganda
export function apiUrl(path: string) {
  const base = API_BASE_URL.replace(/\/+$/g, '');
  const p = path.replace(/^\/+/, '');
  return `${base}/${p}`;
}

export default API_BASE_URL;
