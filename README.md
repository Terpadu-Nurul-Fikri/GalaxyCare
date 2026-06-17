# SIPASKA

SIPASKA adalah aplikasi pengaduan fasilitas kampus untuk mahasiswa dan admin Biro Sarana dan Prasarana. Aplikasi ini mendukung laporan fasilitas dengan foto, tracking status, forum aspirasi publik, informasi kampus, notifikasi, dashboard admin, dan dashboard user.

## Stack

- Laravel 13
- Inertia.js 3
- React 19
- Tailwind CSS 4
- Fortify
- PHPUnit
- Vite

Project ini tidak memakai Bootstrap. Styling utama memakai Tailwind CSS dan komponen React.

## Fitur Utama

- Laporan fasilitas kampus dengan kategori, prioritas, lokasi, deskripsi, dan foto.
- Dashboard user untuk membuat dan memantau laporan sendiri.
- Dashboard admin untuk mengelola status laporan dan respons admin.
- Forum aspirasi publik dengan pilihan identitas anonim atau nama akun.
- Informasi Kampus yang dapat dipublish admin dan tampil di halaman publik.
- Halaman Progress publik tanpa membuka identitas pelapor.
- Dark mode, light mode, system mode, dan kontrol animasi interface.

## Struktur Asset

- `public/logo.png` dipakai langsung oleh browser untuk favicon dan logo runtime.
- `resources/images/logo.png` adalah source/master logo agar asset project tetap rapi.
- Screenshot README sebaiknya ditaruh di `docs/screenshots/`.

Rekomendasi screenshot untuk README:

- `docs/screenshots/dashboard-user-dark.png`
- `docs/screenshots/dashboard-admin-dark.png`
- `docs/screenshots/forum-anonymous.png`
- `docs/screenshots/campus-information.png`
- `docs/screenshots/report-create.png`

Setelah screenshot dibuat, tambahkan preview seperti ini:

```md
![Dashboard User Dark](docs/screenshots/dashboard-user-dark.png)
```

## Setup Lokal

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan storage:link
npm run build
```

Jalankan server lokal:

```bash
php artisan serve
npm run dev
```

## Verifikasi Sebelum Push

```bash
vendor/bin/pint --dirty --format agent
npm run lint:check
npm run types:check
php artisan test --compact
npm run build
```

## Deploy / Update Production

Contoh update di LXC home server:

```bash
cd /path/ke/galaxycare
git pull

composer install --no-dev --optimize-autoloader
npm ci
npm run build

php artisan migrate --force
php artisan storage:link

php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

sudo systemctl reload nginx
sudo systemctl restart php8.5-fpm
```

Jika memakai queue worker:

```bash
php artisan queue:restart
```

## Environment Production

Pastikan `.env` production tidak dipush dan berisi konfigurasi aman:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://sipaska.adakada.my.id
FILESYSTEM_DISK=public
```

Pastikan document root web server mengarah ke folder `public`.

## Keamanan

- `.env` sudah di-ignore dan tidak boleh dipush.
- Build frontend production sudah minified dan source map dimatikan lewat Vite.
- Validasi request dilakukan di sisi Laravel.
- Route admin dilindungi middleware admin.
- File upload divalidasi sebagai gambar dengan batas ukuran.
- Foto laporan disimpan di disk `public` dan file akan ikut dihapus saat laporan dihapus.

Catatan: minify frontend membantu membuat JavaScript production lebih sulit dibaca, tetapi keamanan utama tetap berada di konfigurasi server, middleware Laravel, validasi request, permission file, dan environment production yang benar.
