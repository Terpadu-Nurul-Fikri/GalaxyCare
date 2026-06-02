# SIPASKA — Design System & UI Specification
> **Sistem Pengaduan Fasilitas Kampus STT Terpadu Nurul Fikri**
> Dokumen ini dibuat untuk tim UI/UX sebagai panduan desain yang siap dikonversi ke Figma.

---

## 1. Identitas Produk

| Atribut | Nilai |
|---|---|
| Nama Produk | SIPASKA |
| Kepanjangan | Sistem Pengaduan Fasilitas Kampus |
| Institusi | STT Terpadu Nurul Fikri |
| Platform | Web (Mobile-first, Responsive) |
| Tech Stack | Laravel + Inertia.js + React + Tailwind CSS v4 |

---

## 2. Design Tokens (Warna & Tipografi)

### 2.1 Color Palette

```
Primary:
  Blue-50:   #EFF6FF  → background ringan / hover
  Blue-100:  #DBEAFE  → badge background, highlight
  Blue-200:  #BFDBFE  → border fokus
  Blue-600:  #2563EB  → tombol utama, link aktif
  Blue-700:  #1D4ED8  → tombol hover

Semantic:
  Amber-100 / Amber-600  → Status: Menunggu / Pending
  Blue-100  / Blue-700   → Status: Diproses
  Green-100 / Green-700  → Status: Selesai
  Red-100   / Red-700    → Status: Ditolak
  Purple-50 / Purple-600 → Kategori: Aspirasi (Forum)

Neutral:
  Gray-50:   #F9FAFB  → surface/bg
  Gray-100:  #F3F4F6  → divider, border
  Gray-400:  #9CA3AF  → placeholder, muted text
  Gray-500:  #6B7280  → secondary text
  Gray-700:  #374151  → body text
  Gray-900:  #111827  → heading / judul utama
  White:     #FFFFFF  → card surface
```

### 2.2 Tipografi

```
Font Family : Inter (Google Fonts) — sudah digunakan via Tailwind
Base Size   : 16px (1rem)

Scale:
  text-xs   → 12px  → label, timestamp, badge text
  text-sm   → 14px  → body, form label, deskripsi
  text-base → 16px  → konten utama
  text-lg   → 18px  → section heading
  text-xl   → 20px  → page title (mobile)
  text-2xl  → 24px  → page title (desktop)
  text-3xl  → 30px  → hero heading (mobile)
  text-5xl  → 48px  → hero heading (desktop)

Weight:
  font-normal   (400) → body text
  font-medium   (500) → label, badge, nav link
  font-semibold (600) → card title, section heading
  font-bold     (700) → page title, stat number
```

### 2.3 Spacing & Border Radius

```
Spacing scale: 4px base (Tailwind default)
  p-3   → 12px  → badge, chip
  p-4   → 16px  → card padding (mobile)
  p-5   → 20px  → card padding (desktop)
  p-6   → 24px  → section padding
  p-8   → 32px  → CTA section padding

Border Radius:
  rounded-lg    → 8px   → form input, list item
  rounded-xl    → 12px  → card, button
  rounded-2xl   → 16px  → large card, modal
  rounded-3xl   → 24px  → hero CTA block
  rounded-full  → 9999px → badge/chip, avatar
```

---

## 3. Komponen UI

### 3.1 Button

```
Variant Primary (Blue):
  bg-blue-600, text-white, rounded-xl, px-6 py-3
  hover: bg-blue-700, shadow-xl shadow-blue-200
  font-medium text-sm

Variant Secondary (Ghost/Outline):
  border border-gray-200, text-gray-700, rounded-xl
  hover: border-blue-200, bg-blue-50

Variant Ghost (Back Button):
  no border, no bg, p-2, text-muted-foreground
  hover: bg-gray-50

Size:
  sm: px-3.5 py-2 text-sm
  md: px-4 py-2.5 text-sm (default)
  lg: px-6 py-3 text-base
```

### 3.2 Badge / Status Chip

```
Pending  → bg-amber-100 text-amber-700, dot: bg-amber-400
Diproses → bg-blue-100 text-blue-700,   dot: bg-blue-400
Selesai  → bg-green-100 text-green-700, dot: bg-green-400
Ditolak  → bg-red-100 text-red-700,     dot: bg-red-400

Struktur: rounded-full px-2.5 py-0.5 text-xs font-medium
          + dot kecil h-1.5 w-1.5 rounded-full sebelum label
```

### 3.3 Card

```
Surface  : bg-white, rounded-2xl
Border   : border border-gray-100
Shadow   : shadow-sm
Hover    : hover:shadow-md hover:border-blue-100
Padding  : p-5 (default), p-4 (compact/list item)
```

### 3.4 Form Input

```
Input Text:
  h-9, rounded-md, border border-input
  px-3 py-1, text-sm
  focus: ring-1 ring-blue-400, border-blue-400

Textarea:
  rounded-xl, border border-gray-200
  px-4 py-3, text-sm
  focus: ring-2 ring-blue-100, border-blue-400
  placeholder: text-gray-300

Select:
  Same as Input + bg-transparent

Error State: text-sm text-red-500 mt-1.5
```

### 3.5 Stat Card

```
Layout : rounded-xl border bg-white p-4 shadow-sm
Icon   : h-9 w-9, rounded-lg, colored bg (e.g. bg-blue-50)
Value  : text-2xl font-bold text-gray-900
Label  : text-xs text-gray-500 mt-2
Hover  : group-hover:scale-110 pada icon (transition)
```

---

## 4. Layout & Halaman

### 4.1 Public Layout (Navbar + Footer)
Digunakan di: Welcome, Progress, Forum

```
Navbar:
  Sticky top, bg-white/90 backdrop-blur, border-b border-gray-100
  Logo kiri: "SIPASKA" (font-bold text-blue-600) + badge "STT NF"
  Nav links: Progress, Forum (hidden mobile → hamburger)
  CTA kanan: "Masuk" (outline) | "Daftar" (blue) jika belum login
             "Dashboard" jika sudah login
  Height: h-16

Footer:
  bg-gray-50, border-t, text-center
  Text: "© 2025 SIPASKA · STT Terpadu Nurul Fikri"
  py-8 text-sm text-gray-400
```

### 4.2 Auth Layout
Digunakan di: Login, Register, Forgot Password, dll.

```
Layout: Split / Centered card
  Kiri (desktop): Ilustrasi / branding biru gradient
  Kanan / Center: Form card, max-w-sm, rounded-2xl shadow-lg
Header card: Logo + judul halaman + deskripsi
Footer card: Link ke halaman terkait
Note info: rounded-lg bg-blue-50 p-3 text-blue-700 text-xs
           "Gunakan email @student.nurulfikri.ac.id"
```

### 4.3 App Layout (Authenticated)
Digunakan di: Dashboard, Laporan, Notifikasi, Settings

```
Sidebar (desktop, lebar 240px):
  Sticky, bg-white, border-r border-gray-100
  Logo atas, nav items di tengah, user info bawah
  Active state: bg-blue-50 text-blue-700 rounded-lg

Top Bar (mobile):
  Hamburger kiri, Logo tengah, Icon notifikasi kanan

Content Area:
  flex-1, bg-gray-50 min-h-screen
  Padding: p-4 sm:p-6
  Max width konten: max-w-5xl mx-auto (halaman list)
                   max-w-2xl mx-auto (form)
```

---

## 5. Halaman-Halaman

### 5.1 Welcome / Landing Page

```
URL: /
Sections:
  1. HERO
     bg: gradient-to-b from-blue-50 via-white to-white
     Badge: "STT Terpadu Nurul Fikri" (pill, blue-100, animate-pulse dot)
     H1: "Sistem Pengaduan\nFasilitas Kampus" — text-5xl font-bold
         span "Fasilitas Kampus" → text-blue-600
     Subtitle: text-gray-500 max-w-lg
     CTA: [Lapor Sekarang] (blue) + [Lihat Progress] (outline)
          atau [Buat Pengaduan] jika sudah login
     BG decoration: 2 blurred circles (blue-100/50) absolute top-right & bottom-left

  2. STATISTIK
     4-kolom grid (2 col mobile)
     [Total Laporan][Menunggu][Diproses][Selesai]
     Real-time dari database

  3. CARA KERJA (3 cards)
     [Lapor Cepat → Ikon Send, gradient blue]
     [Tracking Real-time → Ikon TrendingUp, gradient indigo]
     [Forum Anonim → Ikon MessageCircle, gradient violet]
     Hover: translateY(-4px) + shadow-lg

  4. CTA BLOCK
     bg: gradient-to-br from-blue-600 to-blue-700
     rounded-3xl, teks putih
     Tombol: bg-white text-blue-600
```

### 5.2 Halaman Login

```
URL: /login
Card fields:
  - Email (placeholder: nim@student.nurulfikri.ac.id)
  - Password (dengan toggle show/hide)
  - Checkbox "Ingat saya"
  - Button: "Masuk" (full-width, bg-blue-600)
Info note: bg-blue-50, "@student.nurulfikri.ac.id"
Footer: "Belum punya akun? Daftar"
```

### 5.3 Halaman Register

```
URL: /register
Fields:
  - Nama Lengkap
  - Email Kampus
  - Password
  - Konfirmasi Password
Button: "Daftar" (full-width, blue)
Footer: "Sudah punya akun? Masuk"
```

### 5.4 Dashboard (User)

```
URL: /{team}/dashboard
Header: "Dashboard" + tombol [+ Buat Laporan] (kanan)
Stats: 4 stat card grid (Total, Menunggu, Diproses, Selesai)
Section "Laporan Terbaru":
  List item: judul (truncate) + kategori•tanggal (kiri)
             status badge (kanan)
  Hover: bg-gray-50
  Empty state: teks "Belum ada laporan."
```

### 5.5 Dashboard (Admin)

```
URL: /{team}/dashboard (isAdmin = true)
Header: "Dashboard Admin" + subtitle "Kelola semua laporan pengaduan"
Stats: sama dengan user tapi data semua laporan semua user
List: tampilkan nama pelapor (•user.name)
      Link → /{team}/admin/reports/{id}
```

### 5.6 Buat Laporan

```
URL: /{team}/reports/create
Layout: max-w-2xl, card besar
Fields (dalam Card):
  1. Judul Laporan       → Input text
  2. Kategori            → Select dropdown
                           [Ruang Kelas, Lab, Toilet, Listrik, Internet,
                            Parkiran, Perpustakaan, Kantin, Gedung,
                            Kebersihan, Keamanan, Pel. Akademik, Lainnya]
  3. Lokasi              → Input text (placeholder: Gedung A, Lantai 3, Ruang 301)
  4. Deskripsi           → Textarea 4 baris
  5. Tingkat Urgensi     → 3-button toggle: [Rendah][Sedang][Tinggi]
                           Warna aktif: green/yellow/red
  6. Foto (opsional)     → Drag & drop zone, dashed border
                           Preview gambar jika sudah dipilih
                           Max 2MB, JPG/PNG/WebP
CTA: [Kirim Laporan] + [Batal]
```

### 5.7 Detail Laporan (User)

```
URL: /{team}/reports/{id}
Layout: grid 3-kolom desktop (2:1 ratio)

Kolom Kiri (lg:col-span-2):
  - Foto (jika ada): max-h-96, object-cover, rounded-lg
  - Card Deskripsi: judul "Deskripsi" + teks
  - Card Respons Admin (jika ada): border-blue-200,
    judul "Respons Admin" text-blue-700

Kolom Kanan (Sidebar):
  - Card Detail: Kategori, Lokasi, Tanggal Lapor, Pelapor, Diselesaikan
    Layout per row: Icon + label kecil + value
  - Card Status: badge berwarna sesuai status
```

### 5.8 Daftar Laporan (User)

```
URL: /{team}/reports
Header: "Laporan Saya" + CTA [+ Buat Laporan]
List: sama seperti dashboard → laporan milik user ini saja
Filter (opsional, future): by status, by kategori
```

### 5.9 Daftar & Detail Laporan (Admin)

```
URL: /{team}/admin/reports
     /{team}/admin/reports/{id}

Index: tabel/list semua laporan, tampilkan pelapor & tanggal
Show:  sama seperti detail user + form ubah status + form respons admin
       Form: dropdown status (pending/diproses/selesai/ditolak)
             Textarea "Respons Admin"
             Button [Simpan Perubahan]
```

### 5.10 Progress Publik

```
URL: /progress
Layout: max-w-5xl
Header: "Progress Pengaduan" + subtitle (publik, tanpa login)
Stats: 4 stat card (compact inline style: icon+value side by side)
List laporan: judul, kategori•lokasi•tanggal (kiri), status badge (kanan)
Pagination: Sebelumnya / Selanjutnya + counter "1 / 5"
```

### 5.11 Forum Anonim

```
URL: /forum
Layout: max-w-2xl
Header: "Forum Anonim" + tombol [Tulis] (kanan)
Form (collapsible, tersembunyi default):
  - Toggle kategori: [Kritik][Saran][Aspirasi] (pill buttons)
  - Textarea pesan (min 10 karakter)
  - Info: "🔒 Dikirim secara anonim"
  - [Kirim] + [Batal]
List item:
  - Pesan (whitespace-pre-wrap) + badge kategori (kanan)
  - Balasan admin (jika ada): bg-blue-50 rounded-xl "↩ Balasan Admin"
  - Timestamp bawah: text-gray-300 text-xs
Pagination: standar
```

### 5.12 Notifikasi

```
URL: /{team}/notifications
List notifikasi: icon • judul • tanggal
Unread indicator: dot biru di navbar icon
```

### 5.13 Settings

```
URL: /{team}/settings/profile    → Nama, Email
URL: /{team}/settings/security   → Ganti Password, 2FA
URL: /{team}/settings/appearance → Light/Dark mode toggle
```

---

## 6. Animasi & Interaksi

```
AnimateIn Component:
  Masuk: opacity 0→1, translateY 16px→0
  Duration: 400ms ease-out
  Delay: staggered per item (0ms, 100ms, 150ms, 200ms, 300ms)
  Dipakai di semua section public pages

Page Loader:
  Progress bar tipis (h-1) di bagian atas halaman
  Warna: bg-blue-600
  Muncul saat navigasi Inertia

Hover Effects:
  Card: translateY(-4px) + shadow-lg (features card landing)
  Stat icon: scale-110
  List item: bg-gray-50 atau border-blue-100

Toggle Animasi:
  Tombol on/off animasi di navbar (accessibility preference)
```

---

## 7. Responsive Breakpoints

```
Mobile  (default):  < 640px  → 1 kolom, nav hamburger
Tablet  (sm):       640px+   → 2 kolom grid stats
Desktop (lg):       1024px+  → sidebar muncul, 3 kolom layout detail laporan

Grid patterns:
  Stats cards: grid-cols-2 (mobile) → grid-cols-4 (sm)
  Features:    grid-cols-1 (mobile) → grid-cols-3 (sm)
  Report detail: flex-col (mobile)  → grid lg:grid-cols-3 (lg)
```

---

## 8. Ikon

```
Library: lucide-react (sudah terpasang)
Ukuran default: h-5 w-5 (medium), h-4 w-4 (small/inline)

Pemetaan:
  FileText     → Total/laporan
  Clock        → Status menunggu
  TrendingUp   → Status diproses / statistik
  CheckCircle  → Status selesai
  XCircle      → Status ditolak
  Send         → Kirim laporan / tombol CTA
  MessageCircle→ Forum anonim
  Plus         → Tambah/buat baru
  ArrowLeft    → Tombol kembali
  Bell         → Notifikasi
  Upload       → Upload foto
  MapPin       → Lokasi
  Tag          → Kategori
  Calendar     → Tanggal
  User         → Pelapor
  Settings     → Pengaturan
```

---

## 9. Data Flow Singkat (untuk konteks Figma)

```
Alur Utama User:
  Landing → Register/Login → Dashboard → Buat Laporan
  → Detail Laporan (pantau status) → Notifikasi

Alur Publik:
  Landing → Progress Publik (tanpa login)
  Landing → Forum Anonim (tanpa login)

Alur Admin:
  Login → Dashboard Admin → Daftar Semua Laporan
  → Detail Laporan → Update Status + Kirim Respons
```

---

## 10. Catatan untuk Tim UI/UX & Figma

1. **Konversi ke Figma** — Dokumen ini cukup untuk dibuatkan Figma frame per frame.
   Gunakan plugin **Figma Tokens** atau **Variables** untuk mengimpor color tokens di bagian 2.

2. **Component Library** — Prioritas komponen yang perlu dibuat di Figma:
   - Button (3 variant × 3 size)
   - Badge/Status Chip (4 variant)
   - Card (default + compact)
   - Input, Textarea, Select
   - Stat Card
   - Nav Item (default + active)
   - List Item laporan

3. **Figma ke Dev Handoff** — Export dengan Figma Dev Mode, developer tinggal lihat
   exact px, color hex, dan spacing. Nama layer ikuti konvensi Tailwind class.

4. **Dark Mode** — Saat ini sudah ada support dark mode via `dark:` class Tailwind.
   Buat variant dark di setiap komponen Figma (color: bg-gray-900, text-gray-100).

5. **Ilustrasi** — Halaman auth dan empty state bisa ditambahkan ilustrasi SVG
   bertema kampus/pendidikan. Saran: [undraw.co](https://undraw.co) kategori "Education".

6. **Brand Voice** — Bahasa Indonesia, formal tapi ramah. Hindari kata teknis.

---

*Dibuat: 2 Juni 2026 | Branch: feature/sipaska | Versi: 1.0*
