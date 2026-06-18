import { users } from '../data/users';
import api from './api';
import { API_BASE_URL } from '../config/api';

// Development mode: Set to true untuk mock UUID jika backend tidak available
const USE_MOCK_UUID_ON_ERROR = true;

export async function loginUser(
  email: string,
  password: string,
) {
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedPassword = password.trim();

  const matchedUser = users.find(
    user =>
      String(user.email).trim().toLowerCase() === trimmedEmail &&
      String(user.password).trim() === trimmedPassword,
  );

  if (!matchedUser) {
    return null;
  }

  // Return a copy to avoid accidental mutation of shared dummy data.
  return { ...matchedUser };
}

/**
 * Generate mock UUID dari email (untuk testing tanpa backend)
 */
function generateMockUUID(email: string): string {
  // Generate deterministic UUID dari email sehingga sama login berulang kali
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    const char = email.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `mock-${hex}-0000-0000-000000000000`;
}

/**
 * Get valid staff UUID from backend using email
 * This verifies the user exists in backend database and returns their UUID
 */
export async function getStaffUUIDFromBackend(email: string): Promise<string | null> {
  const trimmedEmail = email.trim().toLowerCase();

  try {
    console.log(`[UUID] Attempting to fetch UUID from backend for: ${trimmedEmail}`);
    console.log(`[UUID] API Base URL: ${API_BASE_URL}`);

    const response = await api.get('/mobile/staff-uuid', {
      params: { email: trimmedEmail },
      timeout: 5000, // 5 second timeout
    });

    console.log(`[UUID] Backend response:`, response.data);

    if (response.data && response.data.uuid) {
      console.log(`[UUID] Successfully got UUID from backend:`, response.data.uuid);
      return response.data.uuid;
    }

    console.log('[UUID] Backend response missing UUID field');
    return null;
  } catch (error: any) {
    console.error('[UUID] Error getting staff UUID from backend:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
    });

    // Fallback: Generate mock UUID jika backend tidak available
    if (USE_MOCK_UUID_ON_ERROR) {
      console.warn('[UUID] Using mock UUID for development/testing');
      const mockUUID = generateMockUUID(trimmedEmail);
      console.log(`[UUID] Generated mock UUID: ${mockUUID}`);
      return mockUUID;
    }

    return null;
  }
}

/**
 * Test connection ke backend API
 */
export async function testBackendConnection(): Promise<{
  success: boolean;
  message: string;
  baseUrl: string;
}> {
  try {
    console.log(`[TEST] Testing connection to ${API_BASE_URL}`);
    const response = await api.get('/mobile/staff-uuid', {
      params: { email: 'test@test.com' },
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
