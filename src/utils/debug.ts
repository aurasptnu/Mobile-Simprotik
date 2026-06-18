/**
 * Debug utilities untuk troubleshooting koneksi API
 * Use di React Native Debugger atau expo logs
 */

import { API_BASE_URL } from '../config/api';

export const debugConfig = {
  apiBaseUrl: API_BASE_URL,
  endpoints: {
    staffDemo: `${API_BASE_URL}/master/pengguna/staf`,
    tasks: `${API_BASE_URL}/mobile/pekerjaan-aktif?id_pengguna={uuid_staf}`,
    projects: `${API_BASE_URL}/mobile/proyek-aktif`,
  },
};

export const logDebugInfo = () => {
  console.log('='.repeat(60));
  console.log('DEBUG INFO - SIMPROTIK Mobile App');
  console.log('='.repeat(60));
  console.log('API Base URL:', API_BASE_URL);
  console.log('Endpoints:', debugConfig.endpoints);
  console.log('='.repeat(60));
  console.log('Troubleshooting Checklist:');
  console.log('1. Check if backend API is running and accessible');
  console.log('2. Verify API_BASE_URL in src/config/api.ts is correct');
  console.log('3. Ensure /api/master/pengguna/staf endpoint returns demo staff users');
  console.log('4. Check backend logs for any errors');
  console.log('5. Verify CORS is enabled if backend is on different domain');
  console.log('6. Use "Test API Connection" button in Login screen to diagnose');
  console.log('='.repeat(60));
};

export const logRequestDetails = (endpoint: string, method: string = 'GET') => {
  console.log(`\n[API REQUEST]`);
  console.log(`Method: ${method}`);
  console.log(`URL: ${endpoint}`);
};

export const logResponseDetails = (endpoint: string, data: any) => {
  console.log(`\n[API RESPONSE]`);
  console.log(`URL: ${endpoint}`);
  console.log(`Data:`, data);
};

export const logErrorDetails = (endpoint: string, error: any) => {
  console.error(`\n[API ERROR]`);
  console.error(`URL: ${endpoint}`);
  console.error(`Status: ${error.response?.status}`);
  console.error(`Message: ${error.message}`);
  console.error(`Response Data:`, error.response?.data);
  console.error(`Full Error:`, error);
};
