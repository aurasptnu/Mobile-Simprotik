import api from './api';
import { API_BASE_URL } from '../config/api';
import { saveAuthToken } from '../storage/auth';

export async function loginUser(
  nip: string,
  password: string,
) {
  const response = await api.post('/login', {
    nip: nip.trim(),
    password: password.trim(),
  });

  const user = response.data?.data;

  if (!user?.uuid) {
    throw new Error('Data pengguna dari backend tidak lengkap.');
  }

  if (response.data?.token) {
    await saveAuthToken(response.data.token);
  }

  return {
    id: user.uuid,
    uuid: user.uuid,
    name: user.nama_lengkap,
    password: '',
    role: String(user.peran || '').toLowerCase() === 'staf' ? 'staff' : String(user.peran || '').toLowerCase(),
    division: user.divisi?.nama_divisi || '-',
    nip: user.NIP || user.username_sso || nip.trim(),
    raw: user,
  };
}

export async function getStaffUUIDFromBackend(nip: string): Promise<string | null> {
  const trimmedNip = nip.trim();

  try {
    console.log(`[UUID] Attempting to fetch UUID from backend for NIP: ${trimmedNip}`);
    console.log(`[UUID] API Base URL: ${API_BASE_URL}`);

    const response = await api.get('/master/pengguna/staf', {
      params: {search: trimmedNip},
      timeout: 5000,
    });

    const staff = Array.isArray(response.data?.data) ? response.data.data : [];
    const matchedStaff = staff.find(
      (item: any) =>
        String(item.NIP || item.nip || '').trim() === trimmedNip ||
        String(item.username_sso || '').trim() === trimmedNip,
    );

    return matchedStaff?.uuid || null;
  } catch (error: any) {
    console.error('[UUID] Error getting staff UUID from backend:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
    });

    return null;
  }
}

export async function testBackendConnection(): Promise<{
  success: boolean;
  message: string;
  baseUrl: string;
}> {
  try {
    console.log(`[TEST] Testing connection to ${API_BASE_URL}`);
    await api.get('/master/pengguna/staf', {
      timeout: 3000,
    });

    return {
      success: true,
      message: 'Backend API is reachable',
      baseUrl: API_BASE_URL,
    };
  } catch (error: any) {
    console.error('[TEST] Connection failed:', error.message);
    return {
      success: false,
      message: `Backend API error: ${error.message}`,
      baseUrl: API_BASE_URL,
    };
  }
}
