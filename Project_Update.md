# Project_Update.md — Laporan Status & Audit Pembaruan PACUL

**Tanggal Pembaruan**: Oktober 2026  
**Status Repositori**: Siap Evaluasi & Demonstrasi Juri (Ready for Demo & Production Roadmap)  
**Fokus Wilayah**: Pilot Kota Surabaya (31 Kecamatan)

---

## 1. Ringkasan Eksekutif

Pembaruan ini mencakup audit kode menyeluruh, perbaikan bug kritis pada sistem autentikasi, penyempurnaan akurasi OCR listrik, penguatan interaktivitas pelaporan sampah warga, pemolesan antarmuka landing page berestetika modern ala **awalmulai.id**, serta penyusunan kontrak arsitektur dan dokumentasi teknis lengkap.

---

## 2. Riwayat Perbaikan Bug & Edge Cases (Bug Fixes Log)

Berdasarkan investigasi analitis mendalam, sejumlah isu teknis telah diperbaiki:

### A. Perbaikan Bug Penghapusan Akun (`ProfileEditPage`)
- **Masalah**: Saat warga menghapus akun di `/dashboard/profile/edit`, cookie `pacul_token` tidak dihapus. Ketika diarahkan ke `/login`, middleware mendeteksi cookie aktif dan me-redirect pengguna kembali ke `/dashboard`.
- **Solusi**: Memperbarui `handleDeleteAccount` dengan menghapus `CITIZEN_COOKIE` via `Cookies.remove(CITIZEN_COOKIE)`, membersihkan localStorage `pacul_token` dan `pacul-auth`, sebelum melakukan redirect ke `/login`.

### B. Penambahan Tombol Sign Out Warga di Sidebar (`Sidebar.tsx`)
- **Masalah**: Dashboard pemkot memiliki tombol logout, namun sidebar warga tidak memiliki tombol Sign Out sama sekali, sehingga pengguna tidak dapat keluar dari sesi warga secara normal.
- **Solusi**: Menambahkan tombol Logout/Sign Out yang jelas dan responsif di bagian footer sidebar warga dengan memanfaatkan mutasi `useAuth().logoutMutation`.

### C. Perbaikan Parsing Desimal OCR Struk Listrik (`/api/ocr/scan-bill`)
- **Masalah**: Fungsi `parseNumber` menghapus semua titik dan koma (`raw.replace(/[.,]/g, "")`). Hal ini menyebabkan angka pemakaian listrik desimal seperti `248,5 kWh` atau `248.5 kWh` terkonversi menjadi `2485 kWh` (inflasi 10x lipat).
- **Solusi**: Mengimplementasikan parser desimal pintar (`allowDecimal: true`) yang membedakan format pemisah ribuan Rupiah (misal: `Rp 412.350`) dengan koma desimal kWh (misal: `248,5 kWh`).

### D. Otomatisasi Titik Koordinat Dropdown Pelaporan Sampah (`CreateWasteReport.tsx`)
- **Masalah**: Pada Step 1 formulir sampah, jika pengguna memilih kecamatan dari dropdown tanpa mengetuk peta terlebih dahulu, koordinat `lat` dan `lng` tetap `null`, menyebabkan tombol validasi *Next* tidak aktif.
- **Solusi**: Memperbarui event `onChange` pada dropdown kecamatan agar otomatis mengisi koordinat default centroid kecamatan (`k.center`) bila pengguna belum meletakkan pin manual di peta.

### E. Pencegahan Crash SSR Objek Browser
- **Masalah**: Akses `window.location.protocol` pada inisialisasi cookie berpotensi menyebabkan `ReferenceError` pada lingkungan server-side rendering.
- **Solusi**: Menambahkan guard `typeof window !== "undefined"` pada `useAuth.ts` dan `govAuth.store.ts`.

### F. Clamping Bounds pada Store Likes & Upvotes
- **Masalah**: Pengurangan likes dan upvotes pada `collaboration.store.ts` dan `wasteReport.store.ts` belum memiliki batas aman nol.
- **Solusi**: Menerapkan `Math.max(0, count - 1)` serta memberikan fallback kriptografi acak pada pembuatan kode voucher di `voucher.store.ts`.

---

## 3. Redesain Landing Page (Inspirasi awalmulai.id)

Antarmuka Landing Page pada `LandingSections.tsx` telah dirombak secara visual untuk menghadirkan pengalaman pengguna kelas atas:
- **Radial Ambient Glow**: Latar belakang bernuansa hijau hutan dalam (`#0A1F13`) dengan radial glow khas platform modern.
- **Badge Pill & Headline**: Penegasan status sebagai *"Platform Aksi Lingkungan Surabaya · Pilot 31 Kecamatan"* dengan tipografi `Plus Jakarta Sans`.
- **Stat Strip 4-Kolom**: Menampilkan angka-angka kunci secara transparan (31 Kecamatan, 5 Aksi Hijau, 100% Komunitas, 24/7 Akses Publik).
- **Bento Feature Cards**: Kartu-kartu fitur bergaya bento dengan border halus, efek hover modern, dan tautan langsung ke demo.
- **Pillar Gotong Royong Surabaya**: Integrasi nilai kearifan lokal kampung Surabaya dengan kepatuhan SDG 11 (Sustainable Cities) & SDG 12 (Responsible Consumption).

---

## 4. Status Modul Utama Aplikasi

| Modul | Status | Keterangan |
|---|---|---|
| **AI Green Action Verifier** | ✅ Stabil | Integrasi Google Cloud Vision + Fallback Simulasi Demo transparan |
| **Bursa Pasar Hijau (UMKM)** | ✅ Stabil | Katalog reward mitra Surabaya, sistem voucher kode QR instan |
| **Peta Dampak Geospasial** | ✅ Stabil | Agregasi data 31 kecamatan Surabaya dengan Leaflet GIS |
| **Citizen Waste Report** | ✅ Stabil | Pelaporan titik sampah publik, foto terkompresi, status real-time |
| **Carbon Tracker & OCR** | ✅ Stabil | OCR struk PLN dengan parsing desimal presisi & estimasi emisi |
| **Step Tracker (Langkah Hijau)** | ✅ Stabil | Pedometer sensor perangkat (HTTPS) & mode simulasi desktop |
| **Community Action Wall** | ✅ Stabil | Feed inisiatif warga dengan badge khusus aksi terverifikasi |
| **Portal Pemerintahan DLH** | ✅ Stabil | Manajemen laporan respon cepat, analisis komparatif kecamatan, ekspor CSV |

---

## 5. Rencana Tahap Lanjutan (Production Roadmap)

1. **Backend Database Persistence**: Mengintegrasikan PostgreSQL + Supabase/Prisma untuk menggantikan persistensi browser `localStorage`.
2. **Cryptographic JWT Tokens**: Menerapkan token JWT bertanda tangan dengan verifikasi kunci publik Ed25519/RS256.
3. **Integrasi Nyata UMKM & POS**: API webhook untuk validasi penukaran kupon di kasir warung/merchant mitra Surabaya.
4. **Push Notification Service Worker**: Mengaktifkan Web Push Notifications berbasis VAPID untuk pembaruan status laporan sampah.

---

## 6. Pembaruan Redesain Dasbor Pemkot (`/gov/dashboard`) & Visual Medali 3D

Berdasarkan permintaan arahan desain:
1. **Penyelarasan Layout Portal Pemkot dengan Portal Warga**:
   - Menerapkan arsitektur layout dua zona: **Sidebar Menu di Sisi Kiri** (`GovSidebar.tsx` dengan badge unit DLH, navigasi terstruktur, switch ke portal warga, dan tombol logout) serta **Area Tampilan Konten di Sisi Kanan**.
   - Mengubah palet tema dari dark navy menjadi **Clean Light Theme** (`bg-[#F5F5F5]`, kartu putih `bg-white border-[#E5E7EB]`) yang serasi dan konsisten dengan antarmuka warga (`/dashboard`).
   - Menyediakan header sambutan formal Pemkot, tanggal lokal bahasa Indonesia, banner prototip penelitian yang informatif, 4 kartu KPI utama (Aksi Hijau, Laporan Sampah, Reduksi Emisi, Kontributor Aktif), dan 4 kartu metrik operasional.
   - Mengintegrasikan sistem pagination 10 item pada daftar laporan sampah warga dan tabel statistik 31 kecamatan Surabaya.
   - Menerjemahkan 100% teks antarmuka ke dalam Bahasa Indonesia alami dan baku.
2. **Visual Medali & Lencana Prestasi Claymorphic 3D (`Badge3DIcon.tsx`)**:
   - Menghadirkan ikon medali bergaya claymorphic 3D lengkap dengan daun laurel emas, kilauan specular, gradien radial emas/zamrud/ruby, dan gembok 3D proporsional untuk lencana yang masih terkunci.
   - Menyajikan informasi progres perolehan akumulatif EcoPoints secara transparan (ambang batas 70, 300, 500, 750, 1000, 1250, 1500, 2000 poin).

---

## 7. Pemurnian Antarmuka & Kerapian Visual Portal DLH (`/gov/dashboard`)

1. **Pembersihan Elemen Antarmuka & Identitas Resmi**:
   - Menghilangkan tombol silang navigasi ke portal warga ("Buka Portal Warga") dari sidebar, top bar, dan mobile navigation untuk menjaga fokus dan privasi peran aparatur pemerintah.
   - Menghapus label "Demo environmental response unit (prototype)", "Demo Officer", dan "Role: Government", digantikan dengan profil resmi aparatur DLH Kota Surabaya (*Ir. Hendro Gunawan, M.Si - Pengawas Kebersihan Wilayah*).
   - Merapikan badge instansi di sidebar menjadi `Pemkot` (satu baris, tanpa wrap) dan teks instansi `DLH Kota Surabaya` tanpa terpotong ellipsis (`...`).
2. **Optimalisasi Tampilan Tab & Pencegahan Duplikasi Konten**:
   - Mengisolasi Banner Operasional dan 4 Kartu KPI Ringkasan Utama agar hanya muncul secara eksklusif pada tab Ikhtisar Utama (`section === "overview"`). Tab-tab spesifik (Laporan, Aksi Hijau, Peta Spasial, Komunitas, Sirkulasi Poin) kini memiliki judul dan deskripsi kontekstual mandiri.
   - Mengganti visualisasi bar chart horizontal di overview dengan **Donut Gauge Interaktif** (metrik sentral `3.405 Aksi Terverifikasi` dan breakdown persentase tiap kategori) serta sakelar ke **Kartu Dampak (Bento Grid)**.
3. **Eliminasi Full-Screen Blocking Loader**:
   - Menghapus layar loading blocking ("Memuat Pusat Kendali Lingkungan Hidup Kota Surabaya..."), sehingga transisi halaman instan dan konsisten dengan portal warga.
4. **Penyelesaian Ruang Kosong (Empty Space) Tab Sirkulasi Poin**:
   - Menambahkan `items-start` pada container grid dua kolom agar tinggi kartu tidak melar (stretch) secara artifisial.
   - Menambahkan strip 3 metrik sirkulasi (Total Diterbitkan, Terserap di UMKM, Rasio Perputaran) di bawah grafik batang peredaran EcoPoints.
   - Mengatur ulang daftar Mitra UMKM menjadi grid bento 2-kolom ringkas (`sm:grid-cols-2`), menyeimbangkan ketinggian kedua panel dan menghilangkan area kosong secara permanen.

---

## 8. Optimalisasi Tata Letak Pelacak Karbon & Lokalisasi Bahasa Indonesia Penuh

Berdasarkan tinjauan kendala antarmuka pada modul Pelacak Karbon & Struk Listrik PLN (`/dashboard/tracker`):
1. **Penyelesaian Ruang Kosong (Empty Void Gap) Dua Kolom**:
   - Menambahkan properti `items-start` pada kontainer grid responsif (`lg:grid-cols-[60fr_40fr] items-start`) di `TrackerPageClient.tsx`. Hal ini mencegah flex child meregang (*stretch*) mengikuti kolom grafik yang lebih tinggi, sehingga kartu form input manual maupun pindai struk OCR membungkus kontennya secara presisi tanpa sisa ruang kosong di bagian bawah.
   - Mengganti seluruh emoji pada kartu Panduan Efisiensi Energi Warga dengan ikon SVG Lucide resmi (`Lightbulb`, `Bike`, `TreePine`), menjaga standar akademis zero-emoji.
2. **Penyelesaian Tumpang-Tindih Label Garis Target Emisi (`TrendEmisiChart.tsx`)**:
   - Memperbaiki posisi label `ReferenceLine` target dari `insideTopRight` menjadi `position: "top"` dengan pergeseran `dy: -6` dan format label tegas `"Batas Target: ${targetLine} kg CO₂e"`.
   - Menaikkan margin atas grafik batang menjadi `margin={{ top: 22, right: 12, left: -10, bottom: 0 }}` dan memperlebar tinggi kanvas menjadi 290 px, sehingga teks batas target memiliki ruang lapang tersendiri di atas batang chart dan tidak akan pernah bertabrakan meskipun grafik mencapai nilai puncak (50 kg / 61 kg).
3. **Translasi Menyeluruh ke Bahasa Indonesia Alami (100% Localization)**:
   - **`RiwayatAktivitas.tsx`**: Menerjemahkan judul kartu, nama aktivitas sampel (misal: "Perjalanan Kereta Komuter (KRD Surabaya)", "Penghematan Rekening Listrik Rumah Tangga"), badge kategori, format tanggal (`Okt`), header tabel (`Aktivitas`, `Tanggal`, `Estimasi Dampak`), dan tombol navigasi riwayat.
   - **`DataListrik.tsx`**: Menerjemahkan tab navigasi (`Input Manual`, `Pindai Struk (OCR)`, `Analisis Pemakaian`), status efisiensi (`Sangat Hemat`, `Hemat`, `Sesuai Acuan`, `Di Atas Acuan`), serta tabel riwayat 6 bulan.
   - **`InputListrikManual.tsx`**: Menerjemahkan profil rumah tangga, pilihan hunian (Rumah Kecil, Rumah Sedang, Rumah Besar, Apartemen), sumber data, kartu tolok ukur (*benchmark*), perbandingan pemakaian Anda vs acuan warga, hingga pesan estimasi reduksi CO₂e dan poin reward.
   - **`ScanStrukListrik.tsx`**: Menerjemahkan alur pemindaian OCR (tahapan ekstraksi teks Google Cloud Vision, instruksi pemotretan struk, modal kamera, pengisian field yang belum terbaca, peringatan batas ukuran berkas, hingga tombol simpan & pindai ulang).
   - **`electricityBenchmark.ts`**: Menyesuaikan status label, teks kalkulasi persentase emisi, dan rekomendasi tips hemat energi ke dalam Bahasa Indonesia formal.
   - **`CatatAktivitasBaru.tsx` & `page.tsx`**: Menyesuaikan skema kategori input harian ke Bahasa Indonesia (`Transportasi`, `Pangan`, `Pengelolaan Sampah`) serta metadata halaman HTML.
   - **`profile/edit/page.tsx`**: Menyesuaikan teks dialog konfirmasi penghapusan akun dari kata kunci bahasa Inggris `DELETE` menjadi `HAPUS`.




---

## 9. Rekayasa Tata Letak Berimbang Pelacak Karbon & Eliminasi Jeda Autentikasi Demo

1. **Rekayasa Ulang Arsitektur Grid Pelacak Karbon (`TrackerPageClient.tsx`)**:
   - **Diagnosis Celah Tata Letak**: Sebelumnya pada tab aktivitas maupun listrik, kolom kiri dan kanan digabungkan dalam satu kontainer vertikal tanpa pembagian baris. Akibat perbedaan tinggi antara form input dan panel grafik, kolom kiri berakhir lebih awal dan meninggalkan ruang kosong (*blank void gap*) sebesar 600–1.000 px di sisi kiri bawah.
   - **Solusi Tata Letak Multi-Tingkat (Multi-Tier Layout)**:
     - **Tab Catat Aktivitas**:
       - *Tingkat 1 (Monitor & Input Harian)*: Grid 12 kolom responsif (`lg:grid-cols-12`). Kolom kiri (7 kolom) menampung Grafik Tren Emisi dan Distribusi Kategori (~650 px), sementara kolom kanan (5 kolom) menampung Form Catat Aktivitas Baru (~680 px). Kedua kolom berakhir pada ketinggian horizontal yang presisi.
       - *Tingkat 2 (Analitik & Tolok Ukur Wilayah)*: Grid 2 kolom berimbang (`md:grid-cols-2 gap-5 lg:gap-6`). Menyejajarkan Target Reduksi Emisi Rumah Tangga (50%) berdampingan langsung dengan Tolok Ukur Emisi Surabaya & Konversi EcoPoints (50%). Keduanya memiliki profil ketinggian setara (~500 px) dan menyatu rapi.
       - *Tingkat 3 (Panduan Praktis Warga)*: Komponen `PanduanEfisiensiCard` membentang penuh (*full-width banner*) dengan layout 3 kartu horizontal (Efisiensi AC 25°C, Mobilitas Jarak Dekat, dan Dampak Mangrove Wonorejo) tanpa ada sisa ruang kosong.
     - **Tab Struk Listrik PLN**:
       - *Tingkat 1*: Kolom kiri (7 kolom) menampung modul `DataListrik` (Input Manual, Pindai Struk OCR, Analisis Pemakaian), berhadapan dengan kolom kanan (5 kolom) yang menampung Target Simulasi Penghematan Listrik PLN dan Tolok Ukur Surabaya.
       - *Tingkat 2*: Komponen Panduan Efisiensi Energi Warga membentang penuh di bagian dasar.
   - **Koreksi Kontras Ikon Anggota Keluarga (`InputListrikManual.tsx`)**:
     - Memperbaiki kelas warna ikon `MemberStepper` dari `text-white` di atas latar putih menjadi dinamis `i < value ? "text-[#2D5F3F]" : "text-gray-300"`, sehingga jumlah anggota keluarga terlihat kontras dan terbaca jelas.

2. **Eliminasi Jeda Autentikasi & Penyempurnaan Indikator Loading (`login/page.tsx` & `useAuth.ts`)**:
   - **Akar Masalah Jeda Delay**: Tombol demo login sebelumnya mematikan spinner di blok `finally { setLoading(false) }` sesaat setelah data lokal disiapkan, sementara router Next.js masih membutuhkan 1–2 detik untuk mengunduh dan merender chunk Javascript halaman dashboard. Pengguna mengalami momen di mana animasi putaran tombol sudah berhenti, namun layar masih terpaku di form login.
   - **Solusi & Optimasi Terpadu**:
     1. **Route Prefetching Proaktif**: Menambahkan `router.prefetch("/dashboard")` dan `router.prefetch("/gov/dashboard")` saat halaman login dimuat, sehingga berkas bundle Javascript dashboard sudah tersimpan di cache peramban sebelum pengguna menekan tombol.
     2. **Kelangsungan Indikator Visual (State Continuity)**: Menghapus pelepasan loading prematur pada blok `finally`. Tombol mempertahankan status aktif dengan label status transisi yang jelas: `"Mengarahkan ke Dasbor…"` (Warga) dan `"Mengarahkan ke Portal…"` (Pemkot), dan hanya dinonaktifkan jika terjadi kegagalan otentikasi (*catch block*).
     3. **Transisi Instan (Zero-Flicker)**: Mengganti `router.push` dengan `router.replace` pada alur demo auth untuk mempercepat pemrosesan navigasi riwayat peramban.
     4. **Penyesuaian Durasi Mock Auth**: Mengurangi delay simulasi `demoDelay` dari 350–400 ms menjadi 80 ms untuk menghadirkan respon klik yang seketika (*instantaneous*).
     5. **Penyelarasan Identitas Akun Demo Pemkot**: Memperbarui teks tombol dari `"Masuk Cepat Demo: Budi Hartono"` menjadi `"Masuk Cepat Demo: Ir. Hendro Gunawan, M.Si"` sesuai profil resmi Kepala Seksi DLH Kota Surabaya.
     6. **Lokalisasi Notifikasi Masuk**: Menerjemahkan notifikasi toast login (`Selamat datang, [Nama]!` dan `Email atau kata sandi tidak sesuai.`) ke Bahasa Indonesia.


---

## 10. Harmonisasi Simetris & Penjajaran Penuh Tata Letak Pelacak Karbon

Berdasarkan evaluasi terhadap kesejajaran visual antarmuka modul Pelacak Karbon & Struk Listrik PLN (`/dashboard/tracker`):

1. **Pemisahan Modul & Penjajaran Kartu Berpasangan (*Paired Equal Rows*)**:
   - **Diagnosis**: Sebelumnya di Tab Catat Aktivitas, komponen `TrendEmisiChart` menggabungkan grafik batang dan grafik garis perbandingan dalam satu file (~720 px) serta ditumpuk dengan `BreakdownKategori` (~360 px), sehingga kolom kiri mencapai 1.080 px sementara `CatatAktivitasBaru` di kolom kanan hanya berukuran 470 px. Hal ini menciptakan rongga kosong putih masif di bawah form.
   - **Solusi Arsitektur**:
     - Memisahkan komponen grafik menjadi dua komponen independen: `TrendEmisiChart` (Grafik Batang Tren Emisi) dan `ComparisonEmisiChart` (Grafik Garis Perbandingan vs Surabaya).
     - **Baris 1**: Grafik Batang Tren Emisi (Kiri, 58%) berpasangan sejajar dengan Form Catat Aktivitas Emisi Harian (Kanan, 42%). Keduanya memiliki profil ketinggian seimbang (~440 px vs ~440 px) dan menggunakan `h-full flex flex-col justify-between`.
     - **Baris 2**: Grafik Garis Perbandingan Emisi vs Surabaya (Kiri, 50%) berpasangan sejajar dengan Distribusi Emisi per Kategori (Kanan, 50%). Keduanya menyajikan wawasan analitis dengan tinggi setara (~380 px vs ~380 px).
     - **Baris 3**: Target Reduksi Emisi Rumah Tangga (Kiri, 50%) berpasangan sejajar dengan Tolok Ukur Emisi Warga Surabaya & Potensi EcoPoints (Kanan, 50%) (~490 px vs ~490 px).
     - **Baris 4**: Banner Panduan Efisiensi Energi Warga membentang penuh dengan grid 3 kartu tips praktis Surabaya.

2. **Rekayasa Ulang Modul Struk Listrik PLN ke Grid 2 Kolom Sejajar**:
   - **Mode Input Manual (`InputListrikManual.tsx`)**:
     - Mengubah susunan satu kolom vertikal yang panjang menjadi 2 kolom simetris (`lg:grid-cols-2`):
       - *Kolom Kiri*: Profil Rumah Tangga + Formulir Periode, kWh, Tagihan Rp, dan Tombol Simpan Laporan.
       - *Kolom Kanan*: Kartu Evaluasi Efisiensi Real-Time (Gauge status & emisi kg CO₂e) + Grafik Riwayat 6 Bulan Terakhir.
   - **Mode Pindai Struk OCR (`ScanStrukListrik.tsx`)**:
     - *Kondisi Idle*: Kolom kiri berupa area Dropzone berkas & tombol kamera/upload; kolom kanan berupa Panduan 3 Langkah Ekstraksi OCR Otomatis & contoh data struk PLN yang diterima.
     - *Kondisi Terbaca*: Kolom kiri berupa status keyakinan deteksi AI Vision & tombol pindai ulang; kolom kanan berupa highlight angka kWh, grid detail data pelanggan, serta tombol simpan data.
   - **Mode Analisis Pemakaian (`DataListrik.tsx`)**:
     - *Kolom Kiri*: Kartu Ringkasan Rata-rata 6 Bulan Terakhir & Rekomendasi Efisiensi; *Kolom Kanan*: Tabel Riwayat Pemakaian 6 Bulan (Bulan, kWh, Status).
   - Di bawah modul `DataListrik`, Baris 2 menampilkan Target Reduksi Emisi dan Tolok Ukur Surabaya berdampingan sejajar (50% - 50%), diikuti oleh Panduan Efisiensi Energi Warga di Baris 3.
   - Seluruh celah kosong (*blank void space*) di kedua tab berhasil dihilangkan sepenuhnya, menghasilkan tata letak yang proporsional, padat karya, dan sejajar di seluruh tingkat.


---

## 11. Penyelarasan Ikonik Header Tolok Ukur Emisi Surabaya (`BenchmarkEmisiSurabaya.tsx`)

Berdasarkan tinjauan visual ornamen antarmuka:
- **Penggantian Ikon Neraca Hukum (`Scale`)**:
  - Ikon sebelumnya menggunakan timbangan kehakiman/hukum (`Scale` ⚖️), yang tidak kontekstual dan tampak seperti pilihan acak model AI generatif (*AI slop*) untuk menerjemahkan kata "tolok ukur/scale".
  - Ikon tersebut telah diganti dengan **`BarChart2`** (tiga batang komparasi data statistik) dari pustaka resmi Lucide.
  - Ikon `BarChart2` merepresentasikan data acuan komparasi emisi kota (DLH Surabaya & ESDM) secara presisi, profesional, dan serasi berdampingan dengan ikon `<Target />` pada kartu Target Reduksi Emisi di baris yang sama.


---

## 12. Penyempurnaan Stepper Anggota Adaptif & Pembenahan Riwayat Listrik 6 Bulan (`InputListrikManual.tsx` & `electricityBenchmark.ts`)

Berdasarkan tinjauan interaksi pada modul pencatatan listrik mandiri:
1. **Antisipasi Jumlah Anggota Keluarga > 10 Orang**:
   - Batas maksimum pemilihan anggota dinaikkan dari 6 menjadi 20 orang (mengakomodasi variasi keluarga inti, keluarga besar 3 generasi, hingga rumah kontrakan/komunal mahasiswa dan pekerja di Surabaya).
   - Penerapan visualisasi avatar adaptif:
     - 1–5 orang: Menampilkan deretan ikon individual aktif (`#0F3D2E`) beserta bayangan abu-abu.
     - Lebih dari 5 orang: Menampilkan 4 ikon avatar hijau diikuti lencana pil dinamis `+{value - 5}` sehingga tidak memakan tempat horizontal atau merusak kerapian tata letak.
     - Label klasifikasi kontekstual: *Keluarga Inti* (1–4), *Keluarga Besar* (5–8), dan *Komunal / Asrama* (> 8).
   - Penyesuaian kalkulasi acuan di `electricityBenchmark.ts`: Fungsi `getBenchmarkAverage` kini menghitung beban dasar hunian secara proporsional ditambah variabel per orang (~30–65 kWh/orang tergantung golongan daya), menghilangkan fallback kaku pada keluarga besar.

2. **Penyempurnaan Kartu Riwayat 6 Bulan Terakhir**:
   - Mengatasi masalah spasi kosong masif (*void gap*) di bawah grafik garis dengan menambahkan panel ringkasan analitik 3 metrik efisiensi (Rata-rata Riil 203 kWh/bln, Bulan Terhemat Apr 170 kWh, Total Reduksi -340 kWh).
   - Menambahkan deretan *chips* riwayat 6 bulan dengan indikator bulanan.
   - Memperbaiki konfigurasi `LineChart` Recharts: Menambahkan garis grid horizontal (`CartesianGrid`), skala `YAxis` seimbang (`domain={[120, 290]}`), serta titik dot stabil (`activeDot={{ r: 6.5 }}`) untuk mencegah terpotongnya kurva pada kanvas SVG.


---

## 13. Eliminasi Celah Kosong Internal Kartu Riwayat Listrik & Perataan Grid Bulanan (`InputListrikManual.tsx`)

Berdasarkan evaluasi terhadap tangkapan layar antarmuka:
1. **Penyebab Celah Putih Kosong (*Void Space*)**:
   - Pemakaian kelas utilitas `flex-1` dan `justify-between` pada kartu Riwayat 6 Bulan memaksa batas footer (*legend*) terdorong jauh ke bagian bawah kartu, sehingga menghasilkan rongga putih kosong di antara daftar riwayat dan teks legenda.
   - Perilaku `flex-wrap justify-between` pada daftar bulanan membagi 6 kartu menjadi 4 di baris pertama dan 2 di baris kedua, memicu lubang kosong di tengah baris kedua antara bulan Maret dan April.

2. **Perbaikan Presisi Tata Letak**:
   - Menghapus ketergantungan `justify-between` dan `flex-1` pada kartu, menggantinya dengan alur tumpukan vertikal alami (`flex flex-col gap-3.5`).
   - Mengubah susunan deretan 6 bulan menjadi grid 3 kolom x 2 baris yang simetris (`grid-cols-2 sm:grid-cols-3 gap-2`). Seluruh bulan (Nov–Jan di baris 1 dan Feb–Apr di baris 2) terdistribusi secara seimbang tanpa rongga kosong.
   - Menambahkan kotak catatan analisis efisiensi (*ShieldCheck* evaluasi konsistensi) sebelum legenda indikator, menjamin kesinambungan visual dari atas ke bawah kartu secara utuh dan padat karya.
   - Mengubah penyelarasan grid utama dari `items-stretch` menjadi `items-start` sehingga kartu mengambil tinggi proporsional sesuai kontennya.
