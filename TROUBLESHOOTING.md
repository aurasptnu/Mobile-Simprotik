# 🔧 Troubleshooting Backend API Connection

## Status: Login Gagal / Tidak Bisa Ambil Data

Jika Anda mendapatkan error saat login seperti "Gagal mendapatkan UUID dari server", berikut adalah langkah-langkah untuk debug:

---

## ✅ Step 1: Test API Connection

1. **Buka Login Screen** di aplikasi
2. **Tap tombol "Test API Connection"** (tombol abu-abu di bawah Login)
3. Lihat pesan error yang muncul

### Possible Error Messages:

#### Error: "Backend API is not reachable"
**Kemungkinan Penyebab:**
- Backend API belum running
- ngrok tunnel sudah expired
- Network tidak bisa akses backend

**Solusi:**
- Pastikan backend sudah berjalan (npm start / python manage.py runserver)
- Jika pakai ngrok, tunnel mungkin expired → buat tunnel baru
- Check URL di `src/config/api.ts`

#### Error: "Network Error" atau timeout
**Kemungkinan Penyebab:**
- CORS issue
- Firewall blocking
- Server crash

**Solusi:**
```bash
# Check backend logs
# Pastikan CORS headers ada di response:
# Access-Control-Allow-Origin: *
```

---

## ✅ Step 2: Check API Configuration

**File:** `src/config/api.ts`

```typescript
export const API_BASE_URL = 'https://scooter-coerce-reunite.ngrok-free.dev/api';
```

**Pastikan:**
- ✅ URL benar dan accessible
- ✅ Jika pakai ngrok: tunnel masih aktif
- ✅ Backend service running di port yang benar

---

## ✅ Step 3: Verify Backend Endpoints

Backend harus memiliki endpoint-endpoint ini:

### 1. Get Staff UUID
```bash
GET /api/mobile/staff-uuid?email=yeni.farida@upatik.com

Response:
{
  "uuid": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Test dengan cURL:**
```bash
curl -X GET "http://localhost:8000/api/mobile/staff-uuid?email=yeni.farida@upatik.com"
```

### 2. Get Tasks
```bash
GET /api/mobile/tugas?id_staf=550e8400-e29b-41d4-a716-446655440000

Response:
[
  {
    "id": "...",
    "title": "...",
    "status": "..."
  }
]
```

### 3. Get Active Projects
```bash
GET /api/mobile/proyek-aktif?id_pengguna=550e8400-e29b-41d4-a716-446655440000
```

### 4. Get Task Detail
```bash
GET /api/mobile/pekerjaan/{id}?id_pengguna=550e8400-e29b-41d4-a716-446655440000
```

### 5. Upload Documentation
```bash
POST /api/mobile/pekerjaan/{id}/dokumentasi-akhir
Content-Type: multipart/form-data

Form data:
- id_pengguna: string
- dokumentasi_akhir: file
```

### 6. Submit Survey
```bash
POST /api/mobile/pekerjaan/{id}/survei
Content-Type: application/json

Body:
{
  "id_pengguna": "...",
  "nama_klien": "...",
  "nip_klien": "...",
  "jawaban1": "...",
  "jawaban2": "...",
  "jawaban3": "...",
  "jawaban4": "...",
  "jawaban5": "...",
  "jawaban6": "..."
}
```

---

## ✅ Step 4: Check Console Logs

**Buka React Native Debugger atau Expo logs:**

```bash
# Jika pakai Expo
expo start

# Lihat console output untuk logs seperti:
[UUID] Attempting to fetch UUID from backend for: yeni.farida@upatik.com
[UUID] API Base URL: https://...
[UUID] Successfully got UUID from backend: 550e8400-...
```

**Debug messages:**
- `[UUID]` - UUID fetching process
- `[LOGIN]` - Login process
- `[TEST]` - API connection test
- `[ERROR]` - Error details

---

## ✅ Step 5: Use Fallback Mode (Development)

Jika backend belum ready, app sudah support **fallback mechanism**:

File: `src/services/auth.ts`

```typescript
// Development mode: Set to true untuk mock UUID jika backend tidak available
const USE_MOCK_UUID_ON_ERROR = true;
```

Jika `USE_MOCK_UUID_ON_ERROR = true`:
- ✅ Login dengan dummy account tetap berhasil
- ✅ UUID di-generate otomatis (mock UUID)
- ✅ App akan fallback ke local data jika backend error

**Untuk production:** Set ke `false` agar wajib connect ke backend.

---

## ✅ Step 6: Test with Demo Accounts

**Semua akun pakai password: `123456`**

| Email | Name |
|-------|------|
| yeni.farida@upatik.com | Yeni Farida, A.M. |
| wahozin@upatik.com | Wahozin |
| rahmadona@upatik.com | Rahmadona |
| supriyanto@upatik.com | Supriyanto |
| nokimala@upatik.com | Nokimala |
| ... | ... (19 more) |

Lihat lengkap di: `src/data/users.ts`

---

## 🔍 Quick Diagnostic

Run this in your React Native app console:

```javascript
import { testBackendConnection } from './src/services/auth';
import { debugConfig, logDebugInfo } from './src/utils/debug';

// Print all config
logDebugInfo();

// Test connection
testBackendConnection().then(result => {
  console.log('Connection Result:', result);
});
```

---

## 📋 Checklist Sebelum Go Live

- [ ] Backend API running dan accessible
- [ ] Endpoint `/api/mobile/staff-uuid` implemented dan return UUID
- [ ] Semua staff sudah ada di database backend dengan UUID
- [ ] CORS enabled di backend
- [ ] `USE_MOCK_UUID_ON_ERROR` set ke `false`
- [ ] API_BASE_URL di `src/config/api.ts` sudah production URL
- [ ] Test dengan semua 24 demo accounts
- [ ] Verify data dari backend ditampilkan dengan benar

---

## 🆘 Still Not Working?

1. **Check Backend Logs** - lihat error detail di server
2. **Test Endpoint Manually** - gunakan Postman atau cURL
3. **Enable Debug Logging** - check React Native console
4. **Check Network** - pastikan firewall/VPN tidak block API
5. **Verify Credentials** - pastikan email/UUID benar di database

Butuh bantuan? Check logs untuk error details yang spesifik!
