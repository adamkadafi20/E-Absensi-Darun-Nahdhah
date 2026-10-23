# SOT — E-Absensi Darun Nahdhah

## 1. Ringkasan produk
E-Absensi Darun Nahdhah adalah aplikasi web untuk pengelolaan data santri dan monitoring kedisiplinan ibadah, kegiatan, tahfidz, hukuman, serta reward. Fokus rilis pertama adalah frontend React-Vite dengan Tailwind CSS dan data dummy.

## 2. Tujuan
- Memusatkan pemantauan santri dalam antarmuka yang mudah dipahami.
- Mendukung pengelolaan beberapa cabang melalui role Super Admin dan Admin Cabang.
- Menyediakan portal santri untuk melihat ringkasan data pribadi.
- Menyiapkan pengalaman laporan individu dan lintas cabang.

## 3. Pengguna dan akses
### Super Admin
- Mengakses dashboard lintas cabang.
- Mengelola cabang dan akun admin.
- Memantau santri, absensi, kegiatan, tahfidz, hukuman, dan reward lintas cabang.
- Mengakses laporan, audit log, dan pengaturan.

### Admin Cabang
- Mengelola data operasional cabang yang ditugaskan.
- Mengelola santri, asrama, kegiatan, absensi, tahfidz, hukuman, dan reward.
- Membuat laporan untuk cabang/individu sesuai izin.

### Santri
- Melihat dashboard dan profil pribadi.
- Melihat riwayat absensi sholat, kegiatan, tahfidz, hukuman, dan reward sesuai kebijakan.

## 4. Modul
1. Autentikasi: login, logout, lupa password, status akun, role.
2. Dashboard berbasis role.
3. Data santri dan klasifikasi ikhwan/akhwat.
4. Absensi sholat.
5. Kegiatan dan absensi kegiatan.
6. Tahfidz.
7. Hukuman.
8. Reward.
9. Asrama.
10. Cabang.
11. Laporan PDF.
12. Pengguna dan hak akses.
13. Audit log.
14. Pengaturan dan keamanan.

## 5. Prinsip UI/UX
- Brand: coklat susu, krem hangat, putih; hijau sage sebagai aksen status.
- Visual: modern futuristic SaaS, card-based, garis tipis, rounded corners, ruang putih yang cukup.
- Responsif: desktop-first, sidebar desktop dan drawer pada layar kecil.
- Aksesibilitas: label input, fokus keyboard yang terlihat, kontras teks, status tidak hanya dibedakan oleh warna.
- Navigasi: grup menu Workspace, Pembinaan, dan Sistem.
- Bahasa antarmuka: Bahasa Indonesia.

## 6. Batasan rilis frontend
- Semua data dummy.
- Tidak ada koneksi database/API.
- Login dan pergantian role adalah simulasi.
- Tombol ekspor PDF menampilkan pemberitahuan demo, belum menghasilkan PDF.
- Data CRUD yang benar-benar interaktif pada prototipe: data santri. Modul lain menampilkan tabel dummy dan placeholder form.
- Tidak boleh mengklaim fitur keamanan frontend sebagai otorisasi produksi.

## 7. Kriteria penerimaan
- `npm install` dan `npm run dev` dapat digunakan pada lingkungan Node yang didukung.
- `npm run build` selesai tanpa error.
- Pengguna dapat menavigasi seluruh modul melalui sidebar.
- Pergantian role mengubah tampilan navigasi dan dashboard.
- Halaman Data Santri mendukung pencarian, filter gender, tambah, edit, dan hapus data dummy.
- Tampilan responsif pada desktop dan layar kecil.
- Semua placeholder dan batasan backend dijelaskan secara eksplisit.

## 8. Di luar scope saat ini
- Backend, database, API, dan migrasi.
- Integrasi autentikasi nyata dan reset password melalui email.
- Generate PDF produksi.
- Integrasi QR code, GPS, notifikasi, atau absensi otomatis yang belum disepakati.
- Deployment produksi.
