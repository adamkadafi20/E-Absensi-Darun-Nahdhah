# E-Absensi Darun Nahdhah — Frontend Preview v0.3.0

Frontend React + Vite + Tailwind CSS untuk E-Absensi Darun Nahdhah. Tampilan menggunakan gaya SaaS modern dengan palet hijau tanaman (plant green). Project disiapkan agar dapat di-deploy sebagai frontend statis di Vercel.

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

## Demo interaksi v0.3.0
- Navigasi sidebar untuk melihat modul dengan urutan Workspace: Dashboard, Data Santri, Absensi Sholat, Absensi Kegiatan, Tahfidz, Kegiatan, Riwayat Setoran.
- Menu profil kanan atas untuk mengganti tampilan role: Super Admin, Admin Cabang, dan Santri.
- Logout untuk membuka halaman login.
- Data Santri: pencarian nama/NIS, filter kategori, cabang → asrama, status, tambah/edit/hapus, kolom Poin, serta Import/Export Excel.
- Absensi Sholat dan Absensi Kegiatan: filter kategori, cabang → asrama, rentang tanggal, jenis sholat/kegiatan, status, pencarian, dan form pencatatan absensi.
- Kegiatan: filter kategori/peserta/cabang, tambah/edit/hapus kegiatan, serta kelola kategori peserta melalui tombol (+).
- Tahfidz dan Riwayat Setoran tetap menyediakan jadwal, penugasan, form setoran, dan filter lengkap.
- Tombol tema pada header untuk pratinjau mode gelap.

## Pembaruan v0.3.0 — Tema hijau, filter fungsional, Excel, Poin, kategori peserta
- Palet plant green: Forest `#245C43`, Leaf `#4F8060`, Sage `#A9C5A0`, background `#F5F8F3`, card putih, border `#E0E9DE`.
- Opsi "Semua Santri" dihapus; Data Santri, Absensi Sholat, Absensi Kegiatan, dan Tahfidz memakai gate Ikhwan/Akhwat dan data tidak dicampur.
- Semua filter benar-benar menyaring data, dapat dikombinasikan dan direset; statistik mengikuti hasil filter.
- Data Santri memiliki kolom Poin (reward − pelanggaran), NIS otomatis unik (`DN-2XXXX`) yang tidak berubah saat edit.
- Import/Export Excel Data Santri memakai SheetJS dan diproses sepenuhnya di browser.
- Kegiatan memiliki kategori peserta yang dapat dikelola, peserta spesifik, dan relasi ke absensi kegiatan.
- Modul Tahfidz v0.2.3 dipertahankan.

## Batasan saat ini
- Seluruh data adalah dummy dan tersimpan di state browser selama sesi.
- Belum ada API, database, autentikasi sungguhan, otorisasi server, atau pembuatan PDF nyata.
- Import/Export Excel hanya memproses file di browser; tidak ada penyimpanan permanen.
- Login hanya simulasi frontend. Jangan gunakan akun demo untuk data nyata.
- Deployment Vercel hanya mempublikasikan frontend; Vercel tidak otomatis menyediakan database atau backend untuk aplikasi ini.

Lihat `docs/SOT.md`, `docs/FEATURES.md`, `AGENTS.md`, dan `PROMPT_EXECUTION.md` untuk scope, aturan implementasi, dan prompt eksekusi tahap awal.

## Catatan upgrade
- v0.3.0 menggantikan palet coklat susu dengan plant green.
- Submenu kategori kini hanya Ikhwan dan Akhwat; kategori dipilih melalui submenu sidebar atau gate pada halaman.
