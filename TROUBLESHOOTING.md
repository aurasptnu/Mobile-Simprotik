# Troubleshooting Koneksi API Mobile SIMPROTIK

Dokumen ini dipakai untuk mengecek koneksi aplikasi mobile ke backend SIMPROTIK. Mobile harus mengambil data dari backend yang sama dengan website, bukan dari data dummy lokal.

## Base URL Aktif

File konfigurasi:

```text
src/config/api.ts
```

Nilai yang harus dipakai:

```typescript
export const API_BASE_URL = 'https://tugas.tik.unila.ac.id/api';
```

Jika muncul `Network Error`, cek dulu apakah URL tersebut bisa diakses dari browser/emulator.

## Akun Demo Dokumentasi

Semua akun memakai password:

```text
simprotik123
```

| Peran | Username/NIP | Nama | Divisi |
|---|---|---|---|
| Operator | `2215061089` | Harry Bonardo Situmorang | UPA TIK (Pusat) |
| Kepala Divisi | `2215061013` | Annisa Ramaadhanti | Sumber Daya Sistem Informasi |
| Staf | `2215061100` | Aura | Sumber Daya Sistem Informasi |

## Endpoint Yang Perlu Dicek

### Login manual

```http
POST https://tugas.tik.unila.ac.id/api/login
```

Body:

```json
{
  "nip": "2215061100",
  "password": "simprotik123"
}
```

Jika berhasil, simpan `data.uuid` sebagai `id_pengguna` untuk request mobile.

### List pekerjaan aktif mobile

```http
GET https://tugas.tik.unila.ac.id/api/mobile/pekerjaan-aktif?id_pengguna={uuid_staf}
```

### List proyek aktif mobile

```http
GET https://tugas.tik.unila.ac.id/api/mobile/proyek-aktif?id_pengguna={uuid_staf}
```

### Detail pekerjaan mobile

```http
GET https://tugas.tik.unila.ac.id/api/mobile/pekerjaan/{id_pekerjaan}?id_pengguna={uuid_staf}
```

### Detail proyek mobile

```http
GET https://tugas.tik.unila.ac.id/api/mobile/proyek/{id_proyek}?id_pengguna={uuid_staf}
```

### Upload dokumentasi akhir

```http
POST https://tugas.tik.unila.ac.id/api/mobile/pekerjaan/{id_pekerjaan}/dokumentasi-akhir
```

Body `form-data`:

```text
id_pengguna = {uuid_staf}
dokumentasi_akhir = pilih file
```

### Kirim survei

```http
POST https://tugas.tik.unila.ac.id/api/mobile/pekerjaan/{id_pekerjaan}/survei
```

Body:

```json
{
  "id_pengguna": "{uuid_staf}",
  "nama_klien": "Nama Klien Demo",
  "nip_klien": "198000000000000000",
  "jawaban1": 5,
  "jawaban2": 5,
  "jawaban3": 4,
  "jawaban4": 5,
  "jawaban5": 5,
  "jawaban6": "Layanan sudah baik."
}
```

## Penyebab Umum Network Error

1. Backend/domain tidak bisa diakses dari perangkat atau emulator.
2. VPN/jaringan kampus belum aktif jika akses masih dibatasi jaringan internal.
3. SSL/domain bermasalah.
4. Aplikasi masih memakai build lama yang belum berisi `API_BASE_URL` terbaru.
5. Backend belum memiliki data user aktif atau user belum punya tugas aktif.

## Checklist Sebelum Demo

- [ ] `API_BASE_URL` sudah `https://tugas.tik.unila.ac.id/api`.
- [ ] Tidak ada sisa URL ngrok di source aktif.
- [ ] Akun Aura berhasil login manual.
- [ ] Response login mengembalikan `uuid`, `peran`, `status_akun`, dan `divisi`.
- [ ] Endpoint mobile mengembalikan data dari backend.
- [ ] Aplikasi sudah di-rebuild setelah konfigurasi diganti.