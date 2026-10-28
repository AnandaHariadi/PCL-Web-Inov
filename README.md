# PACUL — Platform Aksi Komunitas Untuk Lingkungan

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-14.2.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4.5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa)](https://web.dev/progressive-web-apps/)

**Platform Aksi Lingkungan Surabaya: Mengubah Aksi Hijau Terverifikasi AI Menjadi Dampak Terukur, EcoPoints, dan Pemberdayaan Ekonomi UMKM Lokal.**

[Demo Interaktif](#demo-flow--quick-access) • [Panduan Instalasi](#panduan-instalasi) • [Arsitektur Teknologi](#arsitektur-teknologi--informasi-sistem) • [Dokumentasi Teknis](#dokumentasi-teknis)

</div>

---

## Lembar Kepatuhan Repositori (Compliance Checklist)

Repositori ini telah memenuhi seluruh kriteria kelengkapan teknis dan tata kelola perangkat lunak:

| Komponen Wajib | Implementasi dan Lokasi Berkas |
|---|---|
| **Source Code Produksi** | Seluruh implementasi Next.js 14 App Router siap uji pada [`src/`](src/) dan aset publik [`public/`](public/) |
| **README & Gambaran Umum** | Dokumentasi komprehensif pada [`README.md`](README.md), [`frontend/README.md`](frontend/README.md), dan [`backend/README.md`](backend/README.md) |
| **Spesifikasi Produk** | Dokumen kebutuhan produk lengkap pada [`PRD.md`](PRD.md) dan log pembaruan [`Project_Update.md`](Project_Update.md) |
| **Arsitektur Sistem** | Desain arsitektur menyeluruh pada [`system.md`](system.md) dan [`docs/TECHNICAL.md`](docs/TECHNICAL.md) |
| **Kontrak Alur & State** | Finite state machine alur pengguna dan kontrak Zustand store pada [`frontend-flow-contract.md`](frontend-flow-contract.md) |
| **SOP Tim & Agen AI** | Panduan operasional baku dan etika rekayasa perangkat lunak pada [`AGENTS.md`](AGENTS.md) |
| **Panduan Instalasi** | Petunjuk setup langkah demi langkah, prasyarat, konfigurasi env, dan verifikasi pada [Panduan Instalasi](#panduan-instalasi) |
| **Dokumentasi Khusus** | Spesifikasi teknis mendalam: [`docs/TECHNICAL.md`](docs/TECHNICAL.md), [`docs/IMPACT_METHODOLOGY.md`](docs/IMPACT_METHODOLOGY.md), dan [`docs/DEMO_GUIDE.md`](docs/DEMO_GUIDE.md) |

---

## Daftar Isi

- [Konteks Proyek & Tim Pengembang](#konteks-proyek--tim-pengembang)
- [Gambaran Umum Solusi Inti](#gambaran-umum-solusi-inti)
- [Rincian Fitur Utama](#rincian-fitur-utama)
- [Arsitektur Teknologi & Informasi Sistem](#arsitektur-teknologi--informasi-sistem)
  - [Diagram Arsitektur Sistem](#diagram-arsitektur-sistem)
  - [Tabel Stack Teknologi Lengkap](#tabel-stack-teknologi-lengkap)
  - [Integrasi AI & Vision OCR](#integrasi-ai--vision-ocr)
  - [Sistem PWA & Kapabilitas Offline](#sistem-pwa--kapabilitas-offline)
  - [Kontrol Keamanan & Privasi Data](#kontrol-keamanan--privasi-data)
- [Panduan Instalasi](#panduan-instalasi)
  - [Prasyarat Sistem](#prasyarat-sistem)
  - [Langkah-Langkah Instalasi](#langkah-langkah-instalasi)
  - [Variabel Lingkungan](#variabel-lingkungan)
  - [Menjalankan Server Pengembangan](#menjalankan-server-pengembangan)
  - [Build Produksi & Deployment](#build-produksi--deployment)
  - [Pengujian Otomatis Smoke Test](#pengujian-otomatis-smoke-test)
- [Indeks Dokumentasi Teknis](#dokumentasi-teknis)
- [EcoPoints & Bursa Pasar Hijau](#ecopoints--bursa-pasar-hijau)
- [Peta Geospasial Surabaya](#peta-geospasial-surabaya)
- [Portal Pemerintahan DLH](#portal-pemerintahan-dlh)
- [Alur Demo & Akses Cepat Evaluasi](#demo-flow--quick-access)
- [Batasan Prototipe & Roadmap](#batasan-prototipe--roadmap)
- [Lisensi & Hak Cipta](#lisensi--hak-cipta)

---

## Konteks Proyek & Tim Pengembang

| Atribut | Keterangan |
|---|---|
| **Institusi** | Universitas Pembangunan Nasional "Veteran" Jawa Timur |
| **Platform** | PACUL (Platform Aksi Komunitas Untuk Lingkungan) |
| **Fokus Wilayah** | Kota Surabaya (Cakupan 31 Kecamatan) |
| **Subtema Utama** | Lingkungan Hidup, Smart City, Pemberdayaan Ekonomi Lokal |
| **Subtema Pendukung** | Layanan Publik Digital, Inovasi Sosial Terdesentralisasi |

### Keselarasan Sustainable Development Goals (SDGs)

PACUL secara langsung mendukung pencapaian 4 pilar Tujuan Pembangunan Berkelanjutan:
- **SDG 11 (Kota dan Pemukiman yang Berkelanjutan)**: Pelaporan titik tumpukan sampah liar oleh warga berbasis peta interaktif dan pemantauan lingkungan spasial tingkat kecamatan di Surabaya.
- **SDG 12 (Konsumsi dan Produksi yang Bertanggung Jawab)**: Pemilahan sampah domestik terverifikasi dari sumbernya serta pengumpulan minyak jelantah rumah tangga.
- **SDG 13 (Penanganan Perubahan Iklim)**: Kuantifikasi reduksi emisi karbon dari efisiensi energi rumah tangga, mobilitas aktif berjalan kaki, dan penanaman pohon.
- **SDG 7 (Energi Bersih dan Terjangkau)**: Pemindaian OCR struk listrik PLN, benchmarking konsumsi listrik Surabaya, serta insentif penghematan daya listrik.

---

## Gambaran Umum Solusi Inti

Inisiatif lingkungan perkotaan sering kali menghadapi kendala **ketiadaan umpan balik berkelanjutan (feedback loop)**: aksi individual warga tidak tercatat, kampanye lingkungan bersifat musiman, sampah rumah tangga tercampur tanpa pemilahan, dan dinas lingkungan hidup kekurangan data spasial terkini per lingkungan RT/RW.

PACUL menghubungkan rantai nilai ini menjadi ekosistem digital sirkular yang terpadu:

```
[ Aksi Hijau Warga ] ──► [ Verifikasi AI & Validasi Citra ] ──► [ Penerbitan EcoPoints ]
                                                                        │
                                                                        ▼
[ Kebijakan Presisi DLH ] ◄── [ Peta Spasial 31 Kecamatan ] ◄── [ Bursa Pasar Hijau (UMKM) ]
```

1. **Verifikasi Berbantuan AI**: Warga mengunggah bukti foto yang divalidasi server menggunakan deteksi label Google Cloud Vision dikombinasikan dengan rule engine anti-fraud PACUL.
2. **Mesin Insentif EcoPoints**: Poin diterbitkan secara transparan khusus bagi aksi yang lolos validasi, mendorong kompetisi positif melalui tingkat level, lencana 3D, dan streak harian.
3. **Bursa Pasar Hijau**: EcoPoints dapat ditukarkan langsung menjadi voucher diskon digital ber-QR code pada mitra pedagang UMKM lokal Surabaya, mengalirkan nilai ekonomi kembali ke masyarakat.
4. **Peta Dampak Spasial Surabaya**: Agregasi real-time aksi hijau warga, laporan sampah liar, dan reduksi emisi karbon di seluruh 31 kecamatan Surabaya.
5. **Portal Pendukung Keputusan Dinas Lingkungan Hidup (DLH)**: Antarmuka analitik bagi petugas kebersihan untuk merespon cepat laporan sampah, menganalisis hotspot kecamatan, dan mengunduh laporan berformat CSV yang aman dari formula injection.

---

## Rincian Fitur Utama

### Pengalaman Warga (`/dashboard/*`)

| Fitur | Rute Halaman | Deskripsi Fungsional |
|---|---|---|
| **Verifikasi Aksi Hijau** | [`/dashboard/eco-action`](src/app/dashboard/eco-action/page.tsx) | Akses kamera langsung, validasi foto AI real-time, progress tantangan, dan medali prestasi. |
| **Pelacak Karbon & OCR PLN** | [`/dashboard/tracker`](src/app/dashboard/tracker/page.tsx) | Pencatatan emisi energi rumah tangga, OCR struk listrik PLN, rincian kategori, dan tren bulanan. |
| **Bursa Pasar Hijau (UMKM)** | [`/dashboard/marketplace`](src/app/dashboard/marketplace/page.tsx) | Katalog voucher diskon UMKM Surabaya, modal penukaran poin, dan generator kode QR dinamis. |
| **Peta Dampak Surabaya** | [`/dashboard/map`](src/app/dashboard/map/page.tsx) | Peta interaktif Leaflet GIS dengan drilldown 31 kecamatan, auto-focus, dan tabel statistik. |
| **Pelaporan Sampah Warga** | [`/dashboard/laporan-sampah`](src/app/dashboard/laporan-sampah/page.tsx) | Peta tumpukan sampah, klasifikasi keparahan (Rendah/Sedang/Kritis), linimasa status, dan upvote. |
| **Dinding Komunitas** | [`/dashboard/collaboration`](src/app/dashboard/collaboration/page.tsx) | Feed inisiatif lingkungan yang membedakan Aksi Terverifikasi AI dengan diskusi warga umum. |
| **Pedometer Langkah Hijau** | [`/dashboard/step-tracker`](src/app/dashboard/step-tracker/page.tsx) | Pedometer sensor perangkat penghitung reduksi emisi karbon dari berjalan kaki dan medali 3D. |
| **Profil & Lencana Prestasi** | [`/dashboard/profile`](src/app/dashboard/profile/page.tsx) | Progres level, statistik personal, tier kontributor, dan pengaturan notifikasi PWA. |

### Layanan Pemerintahan & DLH Surabaya (`/gov/*`)

| Fitur | Rute Halaman | Deskripsi Fungsional |
|---|---|---|
| **Ikhtisar Eksekutif** | [`/gov/dashboard`](src/app/gov/dashboard/page.tsx) | Ringkasan KPI kota Surabaya, kecamatan prioritas penanganan, dan metrik operasional. |
| **Manajemen Laporan Sampah** | `/gov/dashboard` | Pencarian, filter wilayah, transisi status tiket kebersihan, dan catatan tindak lanjut regu lapangan. |
| **Intelijen Spasial** | `/gov/dashboard` | Peta sebaran titik sampah dengan koordinat presisi khusus satuan tugas kebersihan DLH. |
| **Analisis Sirkulasi Poin** | `/gov/dashboard` | Evaluasi perputaran EcoPoints yang diterbitkan aksi hijau terhadap penyerapan belanja di UMKM. |
| **Ekspor Laporan CSV** | `/gov/dashboard` | Ekspor dataset statistik kecamatan dan log insiden sampah yang steril dari formula injection. |

---

## Arsitektur Teknologi & Informasi Sistem

### Diagram Arsitektur Sistem

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Lapisan Klien (Browser / PWA)                   │
│                                                                        │
│   Next.js 14 App Router  •  React 18  •  Tailwind CSS  •  Framer Motion │
│   Zustand LocalStorage Persistence  •  TanStack Query  •  Workbox PWA  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Request HTTPS (API & Halaman)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│               Lapisan Middleware & Routing (middleware.ts)             │
│                                                                        │
│       Isolasi Sesi Ganda (Cookie Warga vs Cookie Petugas DLH)          │
│       Security Headers, Strict CSP, dan Pencegahan Akses Ilegal        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
         ┌──────────────────────────┴──────────────────────────┐
         ▼                                                     ▼
┌─────────────────────────────────┐   ┌──────────────────────────────────┐
│   Modul Fitur Klien             │   │    Server-Side Route Handlers    │
│                                 │   │        (Node.js Runtime)         │
│ • Peta Spasial (Leaflet GIS)    │   │                                  │
│ • Bursa UMKM (Zustand Store)    │   │ • POST /api/eco-action/verify    │
│ • Pelacak Karbon & Pedometer    │   │   - Verifikasi Magic Bytes/MIME  │
│ • Manajemen Laporan Sampah      │   │   - Sanitasi Citra Klien         │
│ • Agregasi Dampak 31 Kecamatan  │   │   - Cache Hash SHA-256 Anti-Dupl │
│   (src/lib/impact-aggregation)  │   │   - Rule Engine Evaluasi AI      │
└─────────────────────────────────┘   │ • POST /api/ocr/scan-bill        │
                                      │   - Parser Desimal Struk PLN     │
                                      └────────────────┬─────────────────┘
                                                       │ REST API (HTTPS)
                                                       ▼
                                      ┌──────────────────────────────────┐
                                      │  Google Cloud Vision API (Live)  │
                                      │  Fallback Deterministik (Demo)   │
                                      └──────────────────────────────────┘
```

### Tabel Stack Teknologi Lengkap

Terverifikasi sesuai konfigurasi pada [`package.json`](package.json):

| Kategori | Teknologi | Versi | Peran dan Kegunaan |
|---|---|---|---|
| **Core Framework** | **Next.js** | `14.2.3` | Framework React dengan App Router, Server Components, dan Route Handlers |
| **UI Library** | **React** / **React DOM** | `18.3.1` | Mesin rendering komponen antarmuka deklaratif |
| **Bahasa Pemrograman** | **TypeScript** | `5.4.5` | Pengetikan statis ketat pada seluruh model, kontrak API, dan store |
| **Styling & CSS** | **Tailwind CSS** | `3.4.3` | Utility-first CSS dengan token warna khusus Surabaya dan dark/light mode |
| **Tipografi** | **Plus Jakarta Sans** | `next/font` | Font lokal mandiri tanpa roundtrip jaringan eksternal |
| **Animasi** | **Framer Motion** | `11.2.4` | Transisi layout pegas, animasi lencana 3D, dan transisi modal |
| **UI Primitives** | **Radix UI Dialog** | `1.0.5` | Komponen primitif modal yang memenuhi standar aksesibilitas WAI-ARIA |
| **Ikonografi** | **Lucide React** | `0.383.0` | Sistem ikon visual yang seragam dan ringan |
| **State Management** | **Zustand** | `4.5.2` | Store modular ringan dengan middleware persistensi lokal `localStorage` |
| **Data Fetching** | **TanStack Query** | `5.39.0` | Sinkronisasi status server, caching, dan revalidasi latar belakang |
| **Validasi Formulir** | **React Hook Form** + **Zod** | `7.51.5` / `3.23.8` | Penanganan form performan dengan validasi skema tipe ketat |
| **Peta Geospasial** | **Leaflet** / **React-Leaflet** | `1.9.4` / `4.2.1` | Visualisasi peta interaktif dengan tile OpenStreetMap |
| **Visualisasi Data** | **Recharts** | `2.12.7` | Grafik tren emisi karbon dan donat perbandingan kategori aksi |
| **PWA & Offline** | **next-pwa** (Workbox) | `5.6.0` | Pembuatan service worker, asset caching, dan instalasi aplikasi mobile |
| **AI / Vision OCR** | **Google Cloud Vision REST API** | v1 | Deteksi label objek server-side dan pembacaan teks struk listrik PLN |
| **Notifikasi** | **Sonner** | `2.0.7` | Notifikasi toast responsif dan modern |
| **Utilitas** | **clsx** & **tailwind-merge** | `2.1.1` / `2.3.0` | Resolusi penamaan class Tailwind tanpa konflik |

### Integrasi AI & Vision OCR

PACUL mengimplementasikan alur verifikasi foto aksi hijau secara berlapis di server:
- **Endpoint**: `POST /api/eco-action/verify`
- **Prapemrosesan Klien**: Foto dikompresi otomatis via HTML canvas (maksimal 1600px JPEG) serta membersihkan metadata privat EXIF sebelum pengiriman.
- **Pemeriksaan Integritas Berkas**: Pengecekan magic byte mencegah file eksekutabel terselubung; resolusi (minimal 320px) dan ukuran berkas (maksimal 5MB) diverifikasi secara ketat.
- **Mesin Anti-Fraud SHA-256**: Menghitung digest SHA-256 berkas foto dan mencocokkannya dengan riwayat pengiriman untuk mencegah eksploitasi foto berulang.
- **Pencocokan Semantik Label**: Label hasil deteksi Google Cloud Vision dievaluasi menggunakan kamus semantik pada [`src/lib/verification/evaluate.ts`](src/lib/verification/evaluate.ts). Sistem membedakan kesesuaian kategori, mendeteksi ketidaksesuaian kategori silang, serta mendeteksi foto tangkapan layar (screenshot).
- **Fallback Deterministik**: Ketika berjalan tanpa konfigurasi API key eksternal, sistem secara otomatis beralih ke logika mock deterministik bertanda data demo resmi, menjaga aplikasi tetap dapat diuji 100% oleh penilai dalam kondisi apapun.

### Sistem PWA & Kapabilitas Offline

- **Manifest**: [`public/manifest.json`](public/manifest.json) mendefinisikan mode tampilan standalone, orientasi potret, warna tema brand (`#2D5F3F`), dan pintasan cepat aplikasi.
- **Service Worker**: Menyimpan bundle statis Next.js, font, ikon, dan tile OpenStreetMap dengan strategi `CacheFirst` dan kebijakan rotasi LRU.
- **Dukungan Web Push**: Handler pada [`public/sw-push.js`](public/sw-push.js) siap menangani event notifikasi push latar belakang.

### Kontrol Keamanan & Privasi Data

1. **Nol Jejak Database di Mode Prototipe**: Seluruh status aksi tersimpan secara lokal di browser penguji; tidak ada data privasi warga yang bocor ke server eksternal.
2. **Privasi Lokasi Warga**: Koordinat warga pada aksi hijau diagregasikan ke titik centroid kecamatan. Koordinat laporan sampah publik difuzzing (~100 meter) pada tampilan peta warga, dan hanya ditampilkan presisi pada portal resmi petugas kebersihan DLH.
3. **Hardened HTTP Security Headers**: Dikonfigurasi pada [`next.config.js`](next.config.js):
   - Strict Content Security Policy (`CSP`)
   - `X-Frame-Options: DENY` dan `frame-ancestors 'none'`
   - `X-Content-Type-Options: nosniff`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - Kebijakan izin ketat `Permissions-Policy` (kamera dan GPS dibatasi hanya untuk origin mandiri)
4. **Pencegahan Injeksi Formula CSV**: Fitur ekspor pada dasbor dinas secara otomatis menambahkan karakter petik tunggal (`'`) pada sel yang diawali karakter `=`, `+`, `-`, atau `@` guna menetralkan eksekusi formula spreadsheet berbahaya.

---

## Panduan Instalasi

### Prasyarat Sistem

Pastikan perangkat pengembangan Anda telah terpasang:
- **Node.js**: Versi `18.17.0` atau yang lebih baru (mendukung Node 18, Node 20, dan Node 22)
- **npm**: Versi `9.0.0` atau yang lebih baru (atau alternatif `pnpm` / `yarn`)
- **Git**: Untuk manajemen repositori berkas

### Langkah-Langkah Instalasi

```bash
# 1. Clone repositori dari GitHub
git clone https://github.com/AnandaHariadi/PCL-Web-Inov.git
cd PCL-Web-Inov

# 2. Pasang seluruh dependensi paket
npm install

# 3. Salin konfigurasi variabel lingkungan (opsional untuk mode demo)
cp .env.example .env.local
```

### Variabel Lingkungan

PACUL dapat langsung dijalankan dalam **Mode Demo Mandiri** tanpa memerlukan API key eksternal. Apabila ingin mengaktifkan integrasi cloud penuh, sesuaikan berkas `.env.local`:

| Variabel | Target | Default | Keterangan |
|---|---|---|---|
| `GOOGLE_VISION_API_KEY` | Server | *Kosong* | Kunci API Google Cloud Vision untuk deteksi label AI dan OCR struk PLN |
| `AI_VERIFICATION_MODE` | Server | `auto` | Pilihan: `auto` (gunakan kunci jika ada), `live` (wajibkan API), atau `demo` (mock deterministik) |
| `NEXT_PUBLIC_DEMO_MODE` | Klien | `true` | Nilai `true` mengaktifkan penyimpanan browser lokal; nilai `false` menyambung ke backend API |
| `NEXT_PUBLIC_SITE_URL` | Klien | `http://localhost:3000` | URL kanonikal web untuk Open Graph dan penanganan rute lokal |
| `NEXT_PUBLIC_MAP_TILE_URL` | Klien | *OpenStreetMap* | URL template server tile untuk visualisasi peta Leaflet |
| `NEXT_PUBLIC_API_URL` | Klien | `http://localhost:8000/api` | Endpoint REST backend eksternal |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Klien | *Kosong* | Public key VAPID untuk pendaftaran notifikasi push browser PWA |

### Menjalankan Server Pengembangan

```bash
npm run dev
```

Buka peramban di alamat [http://localhost:3000](http://localhost:3000). Aplikasi berjalan dengan dukungan Hot Module Replacement (HMR) aktif.

### Build Produksi & Deployment

Untuk memvalidasi bahwa aplikasi terkompilasi bersih tanpa error TypeScript maupun bundler:

```bash
# Kompilasi dan optimasi bundle produksi
npm run build

# Menjalankan server hasil build produksi
npm run start
```

### Pengujian Otomatis Smoke Test

PACUL menyediakan test suite otomatis untuk memverifikasi rute halaman, header keamanan, proteksi otentikasi rute, dan kontrak API:

```bash
# Jalankan pada sesi terminal terpisah saat server sedang aktif:
npm run test:smoke
```

Cakupan pengujian yang dieksekusi:
- Rute publik mengembalikan status HTTP 200
- Middleware menolak akses tidak terotentikasi dan mengarahkan ke `/login` atau `/gov/login`
- Header respon keamanan (`CSP`, `nosniff`, `frame-ancestors`) terpasang sesuai standar
- Endpoint `POST /api/eco-action/verify` menolak payload tidak valid dan berkas berukuran melebihi batas
- Logika verifikasi menghasilkan status deterministik pada mode demo

---

## Dokumentasi Teknis

Rujukan dokumentasi komprehensif untuk penguji dan dewan juri:

| Berkas Dokumen | Cakupan dan Fokus Pembahasan |
|---|---|
| [`docs/TECHNICAL.md`](docs/TECHNICAL.md) | Spesifikasi arsitektur teknis, state machine, skema store Zustand, spesifikasi API lengkap, rate limiting, dan roadmap penskalaan sistem. |
| [`docs/IMPACT_METHODOLOGY.md`](docs/IMPACT_METHODOLOGY.md) | Rumus resmi konversi dampak, sumber faktor emisi (Kementerian ESDM & UK DESNZ), serta aturan tokenomik EcoPoints. |
| [`docs/DEMO_GUIDE.md`](docs/DEMO_GUIDE.md) | Panduan demonstrasi interaktif 5 menit yang mencakup alur pengujian tiap fitur utama dan mekanisme anti-fraud. |

---

## EcoPoints & Bursa Pasar Hijau

EcoPoints merupakan instrumen gamifikasi internal untuk mengapresiasi kebiasaan positif warga dalam merawat lingkungan. EcoPoints **bukan** instrumen spekulasi keuangan, token kripto, maupun instrumen moneter.

### Matriks Poin Aksi Hijau Utama

| Kategori Aksi | Bukti yang Dibutuhkan | Parameter Ukur | Poin EcoPoints | Batasan Harian |
|---|---|---|---|---|
| **Pemilahan Sampah** | Pemisahan kantong organik & anorganik | kg terpilah (maks 10 kg) | **40** Poin | 2 kali / hari |
| **Minyak Jelantah** | Botol tertutup berisi jelantah | Liter terkumpul (maks 5 L) | **50** Poin | 1 kali / hari |
| **Penanaman Pohon** | Bibit pohon baru tertanam di tanah | Batang pohon (maks 10) | **80** Poin | 2 kali / hari |
| **Penghematan Listrik**| Layar meteran listrik kWh atau lampu LED | Estimasi kWh dihemat | **40** Poin | 1 kali / hari |
| **Transportasi Ramah Lingkungan** | Transportasi umum / sepeda / jalan kaki | Jarak perjalanan (km) | **30** Poin | 3 kali / hari |

*Insentif diberikan berdasarkan status kelolosan audit foto AI dan validitas anti-fraud, bukan berdasarkan kuantitas klaim mandiri semata.*

### Bursa Pasar Hijau (Mitra UMKM Surabaya)

EcoPoints dapat ditukarkan menjadi voucher potongan harga pada pedagang lokal binaan di Surabaya:
- **Mitra UMKM**: Merchant percontohan di Surabaya (seperti *Warung Bu Kris Rungkut*, *Kopi Sahabat Rungkut*, *Toko Kelontong Berkah Wonokromo*).
- **Fitur Voucher**: Kode QR dinamis, nomor seri verifikasi unik, masa berlaku voucher, dan modal penukaran instan di kasir toko.

---

## Peta Geospasial Surabaya

- **Cakupan Wilayah**: Menjangkau 31 kecamatan di wilayah Surabaya Barat, Pusat, Utara, Timur, dan Selatan.
- **Lapisan Visual**: Integrasi peta vektor interaktif Leaflet GIS dengan choropleth yang mencerminkan intensitas partisipasi lingkungan warga.
- **Jaminan Privasi**: Alamat rumah warga tidak pernah diekspos ke publik; seluruh visualisasi diagregasi ke titik koordinat centroid kecamatan.

---

## Portal Pemerintahan DLH

Dapat diakses melalui rute `/gov/login`:
- **Pengguna Sasaran**: Koordinator kebersihan dan aparatur lapangan Dinas Lingkungan Hidup (DLH) Kota Surabaya.
- **Kemampuan Utama**:
  - Memeriksa laporan sampah warga lengkap dengan foto bukti dan titik koordinat GPS presisi
  - Memperbarui status penanganan sampah (Diterima, Diverifikasi, Dalam Penanganan, Selesai)
  - Memantau progres reduksi emisi karbon dan pohon tertanam di seluruh wilayah kota
  - Mengunduh dataset audit kebersihan dalam format CSV yang aman dari injeksi formula

---

## Alur Demo & Akses Cepat Evaluasi

Untuk memudahkan pengujian dan penilaian oleh dewan juri:

1. **Akses Demo Sekali Klik**: Kunjungi beranda [`/`](src/app/page.tsx) lalu klik tombol **"Buka Demo Warga"** (atau langsung tuju [`/demo`](src/app/demo/page.tsx)).
   - Akun simulasi akan terisi otomatis dengan saldo 500 EcoPoints, tantangan aktif, dan riwayat aksi percontohan.
2. **Kredensial Akun Evaluasi**:
   - **Portal Warga**: `demo@pacul.app` / `Demo1234!`
   - **Portal Petugas DLH**: `gov-demo@pacul.app` / `GovDemo1234!`
3. **Panduan Tur Interaktif Juri**: Di dalam dashboard warga tersedia checklist interaktif pengujian fitur yang otomatis tercentang seiring fitur dicoba.

---

## Batasan Prototipe & Roadmap

### Ruang Lingkup Prototipe
- **Persistensi Klien**: Pada versi percontohan ini, persistensi data tersimpan pada `localStorage` peramban penguji.
- **Estimasi Dampak**: Angka reduksi emisi karbon merupakan hasil estimasi teknik berbasis koefisien emisi Kementerian ESDM dan DESNZ.
- **Kemitraan Simulasi**: Mitra UMKM dan integrasi dinas merupakan model simulasi tertutup untuk mendemonstrasikan sistem ekonomi sirkular.

### Roadmap Pengembangan Lanjutan
- **Fase 1**: Integrasi basis data relasional PostgreSQL + PostGIS, otentikasi token JWT kriptografis, dan portal tinjauan aksi bertanda review.
- **Fase 2**: Aplikasi pemindai barcode untuk kasir warung/merchant UMKM guna verifikasi voucher real-time.
- **Fase 3**: Integrasi IoT smart meter dengan API PLN untuk validasi konsumsi listrik rumah tangga otomatis.
- **Fase 4**: Perluasan program percontohan ke kota-kota metropolitan lain di Indonesia.

---

## Lisensi & Hak Cipta

(c) 2026 **PACUL — Platform Aksi Komunitas Untuk Lingkungan** — Universitas Pembangunan Nasional "Veteran" Jawa Timur. Hak cipta dilindungi undang-undang.

- Data peta (c) kontributor [OpenStreetMap](https://www.openstreetmap.org/) di bawah lisensi ODbL.
- Video latar beranda berlisensi bebas dari [Mixkit](https://mixkit.co/).
- Sistem ikon oleh [Lucide](https://lucide.dev/) di bawah Lisensi ISC.
