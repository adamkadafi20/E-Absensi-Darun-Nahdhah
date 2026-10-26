# E-Absensi Darun Nahdhah — Frontend Preview v0.2.1

Starter frontend React + Vite + Tailwind CSS untuk rancangan UI E-Absensi Darun Nahdhah. Tampilan menggunakan gaya SaaS modern dengan palet coklat susu, krem, dan putih. Project disiapkan agar dapat di-deploy sebagai frontend statis di Vercel.

## Persyaratan
- Node.js 18+ (disarankan Node.js 20 atau 22)
- npm
- Akun GitHub dan Vercel untuk deployment online

## Menjalankan proyek secara lokal
1. Ekstrak ZIP dan buka folder `e-absensi-darun-nahdhah` di terminal/VS Code.
2. Jalankan `npm install`.
3. Jalankan `npm run dev`.
4. Buka URL lokal yang ditampilkan Vite, biasanya `http://localhost:5173`.

## Build dan pratinjau produksi
```bash
npm run build
npm run preview
```

Hasil build dibuat ke folder `dist/`. Folder ini dihasilkan otomatis dan tidak perlu dimasukkan ke Git.

## Deploy ke Vercel melalui GitHub
1. Buat repository baru di GitHub.
2. Upload/push seluruh isi folder project ke repository. Pastikan `package.json`, `index.html`, dan `vercel.json` berada di root repository.
3. Login ke [Vercel](https://vercel.com/) dan pilih **Add New → Project**.
4. Import repository GitHub yang baru dibuat.
5. Pastikan pengaturan build berikut terdeteksi atau isi secara manual:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
6. Klik **Deploy** dan tunggu proses build selesai.
7. Setelah berhasil, Vercel memberikan URL deployment. Setiap push baru ke branch yang terhubung akan memicu deployment baru.

File `vercel.json` sudah mengatur output build dan rewrite ke `index.html` agar halaman SPA tidak langsung 404 ketika URL halaman di-refresh atau dibuka langsung.

### Jika project berada di dalam subfolder repository
Import root folder yang berisi `package.json`, atau atur **Root Directory** di pengaturan project Vercel ke `e-absensi-darun-nahdhah` (sesuaikan dengan nama subfolder di repository). Jangan set Root Directory ke folder `src`.

## Pembaruan v0.2.1
- Urutan menu utama: Dashboard, Absensi Sholat, Absensi Kegiatan, Tahfidz, Data Santri, Kegiatan.
- Empat menu terkait santri memiliki dropdown Ikhwan/Akhwat pada sidebar.
- Pemilihan Ikhwan/Akhwat dari sidebar tersambung dengan filter tabel pada modul terkait.

## Demo interaksi
- Navigasi sidebar untuk melihat modul.
- Menu profil kanan atas untuk mengganti tampilan role: Super Admin, Admin Cabang, dan Santri.
- Logout untuk membuka halaman login.
- Halaman Data Santri memiliki pencarian, filter ikhwan/akhwat, tambah, edit, dan hapus data dummy.
- Tombol tema pada header untuk pratinjau mode gelap.
- Halaman modul memiliki tabel, pencarian/filter, statistik, dan dialog tambah data demo.
- Absensi Sholat, Absensi Kegiatan, dan Tahfidz menyediakan filter kategori, cabang, asrama, dan tanggal.
- Absensi Sholat dan Absensi Kegiatan menampilkan status Hadir, Izin, Sakit, Terlambat, dan Tidak hadir.

## Batasan saat ini
- Seluruh data adalah dummy dan tersimpan di state browser selama sesi.
- Belum ada API, database, autentikasi sungguhan, otorisasi server, upload file, atau pembuatan PDF nyata.
- Form pada beberapa modul adalah placeholder interaksi; skema CRUD lengkap dikembangkan setelah kontrak backend disepakati.
- Login hanya simulasi frontend. Jangan gunakan akun demo untuk data nyata.
- Deployment Vercel hanya mempublikasikan frontend; Vercel tidak otomatis menyediakan database atau backend untuk aplikasi ini.

Lihat `docs/SOT.md`, `docs/FEATURES.md`, `AGENTS.md`, dan `PROMPT_EXECUTION.md` untuk scope, aturan implementasi, dan prompt eksekusi tahap awal.


## Filter Ikhwan/Akhwat (v0.2.2)
- Menu Absensi Sholat, Absensi Kegiatan, Tahfidz, dan Data Santri memiliki submenu Semua Santri, Ikhwan, dan Akhwat.
- Klik nama menu untuk membuka submenu; gunakan chevron di sisi kanan untuk expand/collapse.
- Memilih Ikhwan/Akhwat menyaring tabel modul ke kategori tersebut, dan pilihan ditampilkan sebagai badge di judul halaman.
