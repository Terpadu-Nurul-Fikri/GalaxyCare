# Panduan Deploy SIPASKA di LXC + Cloudflared

Panduan ini untuk menjalankan SIPASKA di home server LXC dengan dua environment:

- Production: `https://sipaska.adakada.my.id`
- Staging: disarankan `https://staging-sipaska.adakada.my.id` atau `https://staging.sipaska.adakada.my.id`

## Status Realtime Aplikasi

SIPASKA saat ini belum memakai WebSocket/push realtime. Aplikasi memakai polling Inertia di beberapa halaman, jadi data akan otomatis diperbarui tanpa refresh manual setelah jeda tertentu:

- Dashboard: polling setiap 15 detik.
- Progress publik: polling setiap 15 detik.
- Forum: polling setiap 15 detik.
- Riwayat laporan user: polling setiap 10 detik.
- Daftar laporan admin: polling setiap 10 detik.
- Notifikasi: polling setiap 10 detik.

Artinya setelah daftar akun atau proses CRUD, halaman terkait biasanya akan memperbarui data otomatis dalam 10-15 detik jika halaman itu memang punya polling. Untuk halaman detail/form tertentu, update tetap mengikuti response Inertia setelah submit. Ini cukup untuk publish, tetapi bukan realtime instant seperti chat/WebSocket.

## Pola Deploy yang Disarankan

Gunakan dua folder aplikasi terpisah di LXC:

```bash
/var/www/sipaska-production
/var/www/sipaska-staging
```

Gunakan dua database terpisah:

```text
sipaska_production
sipaska_staging
```

Jangan memakai database production untuk staging.

## Update dari Git di LXC

Untuk update biasa, benar: di LXC tinggal `git pull`, lalu jalankan dependency/build/migration/cache.

Production:

```bash
cd /var/www/sipaska-production
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

php artisan queue:restart
sudo systemctl reload nginx
sudo systemctl restart php8.5-fpm
```

Staging:

```bash
cd /var/www/sipaska-staging
git pull

composer install --optimize-autoloader
npm ci
npm run build

php artisan migrate --force
php artisan storage:link

php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

php artisan queue:restart
sudo systemctl reload nginx
sudo systemctl restart php8.5-fpm
```

Jika `php artisan storage:link` bilang link sudah ada, itu normal.

## Contoh `.env` Production

Jangan commit file `.env`.

```env
APP_NAME=SIPASKA
APP_ENV=production
APP_KEY=base64:ISI_DARI_php_artisan_key_generate
APP_DEBUG=false
APP_URL=https://sipaska.adakada.my.id

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sipaska_production
DB_USERNAME=sipaska_prod_user
DB_PASSWORD=password-kuat-production

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
FILESYSTEM_DISK=public
```

Generate key saat setup pertama:

```bash
php artisan key:generate
```

## Contoh `.env` Staging

```env
APP_NAME="SIPASKA Staging"
APP_ENV=staging
APP_KEY=base64:ISI_DARI_php_artisan_key_generate
APP_DEBUG=false
APP_URL=https://staging-sipaska.adakada.my.id

LOG_CHANNEL=stack
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sipaska_staging
DB_USERNAME=sipaska_staging_user
DB_PASSWORD=password-kuat-staging

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
FILESYSTEM_DISK=public
```

## Nginx Document Root

Pastikan root selalu menunjuk ke folder `public`, bukan root project.

Production:

```nginx
server {
    listen 127.0.0.1:8081;
    server_name sipaska.adakada.my.id;
    root /var/www/sipaska-production/public;

    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.5-fpm.sock;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Staging:

```nginx
server {
    listen 127.0.0.1:8082;
    server_name staging-sipaska.adakada.my.id;
    root /var/www/sipaska-staging/public;

    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.5-fpm.sock;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Reload Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Cloudflared Tunnel

Contoh `~/.cloudflared/config.yml`:

```yaml
tunnel: NAMA_ATAU_ID_TUNNEL
credentials-file: /home/cloudflared/.cloudflared/NAMA_ATAU_ID_TUNNEL.json

ingress:
  - hostname: sipaska.adakada.my.id
    service: http://127.0.0.1:8081
  - hostname: staging-sipaska.adakada.my.id
    service: http://127.0.0.1:8082
  - service: http_status:404
```

Di Cloudflare DNS, buat CNAME untuk hostname production dan staging ke tunnel Cloudflared. Jika memakai perintah CLI:

```bash
cloudflared tunnel route dns NAMA_TUNNEL sipaska.adakada.my.id
cloudflared tunnel route dns NAMA_TUNNEL staging-sipaska.adakada.my.id
```

Restart service:

```bash
sudo systemctl restart cloudflared
sudo systemctl status cloudflared
```

## Membuat Akun Admin Production

Akun yang daftar dari halaman register otomatis menjadi `student`. Untuk admin production, jangan ubah lewat browser publik. Cara yang paling aman:

1. Register akun biasa di website production.
2. Masuk ke LXC.
3. Promote akun tersebut menjadi admin lewat Artisan Tinker.

```bash
cd /var/www/sipaska-production
php artisan tinker --execute 'App\Models\User::where("email", "admin@domain.com")->update(["role" => "admin"]);'
```

Ganti `admin@domain.com` dengan email akun yang sudah didaftarkan.

Alternatif membuat user admin langsung dari server:

```bash
php artisan tinker --execute '$user = App\Models\User::create(["name" => "Admin SIPASKA", "email" => "admin@domain.com", "password" => "password-kuat", "role" => "admin"]); app(App\Actions\Teams\CreateTeam::class)->handle($user, "Admin SIPASKA Team", true);'
```

Setelah login, segera ganti password jika password dibuat manual.

Jangan jalankan `php artisan db:seed` di production kecuali memang ingin data dummy masuk. Seeder proyek ini membuat akun contoh dan laporan contoh.

## Checklist Sebelum Publish

Jalankan ini di local sebelum push:

```bash
npm run types:check
npm run build
php artisan test --compact
```

Di server setelah pull:

```bash
php artisan migrate --force
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

Cek halaman:

- `https://sipaska.adakada.my.id`
- Register user baru.
- Login admin.
- Buat laporan dari user.
- Ubah status laporan dari admin.
- Cek notifikasi user tanpa refresh manual dalam 10-15 detik.

## Catatan Penting

- `.env` production dan staging harus berbeda.
- Database production dan staging harus berbeda.
- Jangan expose folder project selain `public`.
- Pastikan `storage` dan `bootstrap/cache` bisa ditulis oleh user PHP-FPM/Nginx.
- Pastikan `APP_URL` sesuai hostname Cloudflared masing-masing environment.
- Untuk update berikutnya di LXC, cukup `git pull` lalu jalankan langkah update deploy di atas.
