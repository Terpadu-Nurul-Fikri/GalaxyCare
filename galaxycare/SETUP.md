# SIPASKA - Sistem Pengaduan Fasilitas Kampus

Sistem pengaduan fasilitas kampus STT Terpadu Nurul Fikri. Clean, cepat, responsif.

## Tech Stack

Laravel 13 • React 19 • Inertia.js v3 • Tailwind CSS v4 • MySQL

## Fitur

- **Landing Page** — Statistik pengaduan publik
- **Progress Publik** — Semua orang bisa lihat status pengaduan tanpa login
- **Forum Anonim** — Kirim kritik/saran/aspirasi tanpa login
- **Login/Register** — Khusus email @student.nurulfikri.ac.id
- **Buat Laporan** — Upload foto, kategori, lokasi, prioritas
- **Dashboard** — Statistik + laporan terbaru
- **Admin Panel** — Kelola laporan, ubah status, beri respons
- **Notifikasi** — Update otomatis saat status berubah

## Halaman

| URL | Akses | Fungsi |
|-----|-------|--------|
| `/` | Publik | Landing page + statistik |
| `/progress` | Publik | Daftar pengaduan + status |
| `/forum` | Publik | Forum kritik/saran anonim |
| `/login` | Publik | Login (admin & mahasiswa) |
| `/register` | Publik | Daftar akun baru |
| `/dashboard` | Login | Dashboard personal |
| `/reports` | Login | Laporan saya |
| `/reports/create` | Login | Buat laporan baru |
| `/admin/reports` | Admin | Kelola semua laporan |

## Instalasi

```bash
git clone <repo-url>
cd galaxycare
composer install
npm install
cp .env.example .env
php artisan key:generate
```

Edit `.env`:

```env
APP_NAME=SIPASKA
DB_DATABASE=sipaska
DB_USERNAME=root
DB_PASSWORD=
SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync
```

Jalankan:

```bash
php artisan migrate
php artisan db:seed
php artisan storage:link
npm run build
php artisan serve
```

Buka: http://localhost:8000

## Akun Demo

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@student.nurulfikri.ac.id | password |
| Mahasiswa | ahmad.fauzi@student.nurulfikri.ac.id | password |

## Admin Login

Admin login di `/login` yang sama. Sistem membedakan berdasarkan role. Setelah login, admin melihat menu "Kelola Laporan" di sidebar.

## Reset Data

```bash
php artisan migrate:fresh --seed
```

## Lisensi

MIT
