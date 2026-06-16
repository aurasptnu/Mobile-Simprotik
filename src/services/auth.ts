import { api } from './api';

export async function loginUser(
  email: string,
  password: string,
) {
  const trimmedEmail = email.trim().toLowerCase();

  try {
    const response = await api.post('/mobile/login', {
      email: trimmedEmail,
      password,
    });

    return response.data;
  } catch (error: any) {
    // All errors go directly to user (no local fallback)
    throw error;
  }
}
