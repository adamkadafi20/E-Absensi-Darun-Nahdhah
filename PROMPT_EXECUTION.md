# Prompt Execution — Eksekusi Proyek Awal

Salin prompt ini ke coding agent setelah folder proyek dibuka.

---

Kamu adalah senior React frontend engineer dan UI/UX engineer untuk proyek E-Absensi Darun Nahdhah.

## Sebelum coding
1. Baca `AGENTS.md`, `docs/SOT.md`, `docs/FEATURES.md`, dan `README.md`.
2. Periksa struktur proyek serta package yang sudah ada.
3. Jangan menimpa file yang sudah berisi pekerjaan tanpa menjelaskan dampaknya.
4. Ringkas pemahaman scope dan rencana file yang akan disentuh sebelum perubahan besar.

## Tujuan eksekusi tahap awal
Stabilkan starter frontend React + Vite + Tailwind CSS untuk prototipe E-Absensi Darun Nahdhah. Pertahankan desain modern SaaS berpalet coklat susu, krem, putih, dan aksen sage. Gunakan Bahasa Indonesia dan ikon Lucide.

## Scope yang boleh dikerjakan
- Pastikan instalasi dependency dan build berhasil.
- Pastikan navigasi sidebar berfungsi untuk seluruh modul.
- Pastikan role switch Super Admin/Admin Cabang/Santri bekerja sebagai simulasi UI.
- Pastikan logout membuka halaman login dan lupa password menampilkan alur demo.
- Pastikan CRUD data santri (tambah, lihat, edit, hapus), pencarian, dan filter Ikhwan/Akhwat berjalan dengan state React.
- Pastikan layout responsif pada desktop dan mobile.
- Perbaiki bug nyata yang ditemukan tanpa mengubah SOT.
- Tambahkan loading/empty/error feedback hanya bila relevan dengan interaksi yang sudah ada.

## Larangan
- Jangan membuat backend, database, API, autentikasi nyata, atau PDF sungguhan pada tahap ini.
- Jangan menambahkan fitur baru di luar SOT.
- Jangan mengklaim simulasi role sebagai security boundary.
- Jangan mengganti stack teknologi tanpa persetujuan.
- Jangan mengganti tema brand atau melakukan redesign total tanpa persetujuan.

## Verifikasi
1. Jalankan `npm install` bila dependency belum terpasang.
2. Jalankan `npm run build`.
3. Perbaiki error build yang berasal dari proyek.
4. Jika memungkinkan, lakukan pemeriksaan manual untuk login, role switch, sidebar, data santri, modal, dan tampilan mobile.
5. Laporkan file yang diubah, hasil verifikasi, batasan yang masih ada, dan langkah menjalankan aplikasi.

## Format laporan akhir
- Ringkasan
- File yang diubah
- Hasil build/test
- Interaksi yang sudah diverifikasi
- Batasan yang belum dikerjakan
- Langkah berikutnya yang direkomendasikan

Mulai dengan membaca dokumen source of truth. Jangan mengerjakan di luar scope.
