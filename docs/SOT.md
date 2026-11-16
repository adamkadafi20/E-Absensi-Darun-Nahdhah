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
5. Kegiatan dan absensi kegiatan dengan status Hadir, Izin, Sakit, Terlambat, dan Tidak hadir.
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
- Brand: hijau tanaman — Forest `#245C43`, Leaf `#4F8060`, Sage `#A9C5A0`, background `#F5F8F3`, card putih, border `#E0E9DE`, teks `#20372A`/`#78877A`.
- Visual: modern SaaS, card-based, garis tipis, rounded corners, ruang putih yang cukup.
- Responsif: desktop-first, sidebar desktop dan drawer pada layar kecil.
- Aksesibilitas: label input, fokus keyboard yang terlihat, kontras teks, status tidak hanya dibedakan oleh warna.
- Navigasi: grup menu Workspace, Pembinaan, dan Sistem. Urutan Workspace: Dashboard, Data Santri, Absensi Sholat, Absensi Kegiatan, Tahfidz, Kegiatan, Riwayat Setoran.
- Dashboard menampilkan jam live zona Asia/Jakarta; indikator waktu tidak berarti data dummy diperbarui secara real-time dari server.
- Modul berbasis kategori santri menampilkan pilihan Ikhwan/Akhwat terlebih dahulu; tidak ada opsi "Semua Santri" dan data Ikhwan/Akhwat tidak pernah tercampur. Super Admin dapat berganti kategori kapan saja.
- Filter pada setiap modul harus benar-benar menyaring data, dapat dikombinasikan, dan dapat direset. Statistik mengikuti hasil filter.
- Bahasa antarmuka: Bahasa Indonesia.

## 6. Batasan rilis frontend
- Semua data dummy dan disimpan di state React; tidak ada koneksi database/API.
- Login dan pergantian role adalah simulasi; otorisasi sesungguhnya belum ada.
- Tombol ekspor PDF menampilkan pemberitahuan demo, belum menghasilkan PDF.
- Excel (import/export Data Santri) diproses di browser dengan SheetJS; file tidak diunggah ke server.
- Tidak boleh mengklaim fitur keamanan frontend sebagai otorisasi produksi.

## 7. Kriteria penerimaan v0.3
- `npm run build` selesai tanpa error dan tidak ada console error pada pemakaian normal.
- Seluruh menu Workspace dapat diakses; submenu Ikhwan/Akhwat hanya berisi dua pilihan.
- Data Santri: filter kategori, cabang, asrama, status, nama, NIS bekerja dan dapat dikombinasikan/direset; kolom Poin tampil setelah Kehadiran; NIS otomatis unik dan tidak berubah saat edit.
- Import Excel: template tanpa NIS, validasi per baris, pratinjau, dan baris gagal tetap terlihat setelah import.
- Export Excel: seluruh data atau data terfilter, nama file `Data_Santri_Darun_Nahdhah_YYYY-MM-DD.xlsx`, kolom sesuai SOT.
- Absensi Sholat/Kegiatan: filter kategori, cabang→asrama, rentang tanggal, jenis sholat/kegiatan, status, pencarian bekerja; pencatatan absensi memberi feedback.
- Kegiatan: kategori peserta dapat ditambah/diubah/dihapus dengan validasi relasi, dan absensi kegiatan mengikuti kategori peserta.
- Modul Tahfidz v0.2.3 tetap berfungsi (jadwal, penugasan, setoran, riwayat).

## 8. Di luar scope saat ini
- Backend, database, API, dan migrasi.
- Integrasi autentikasi nyata dan reset password melalui email.
- Generate PDF produksi.
- Integrasi QR code, GPS, notifikasi, atau absensi otomatis yang belum disepakati.
- Deployment produksi.

## 9. Keputusan v0.3 (Excel, NIS, Poin, Kategori Peserta)
- Poin santri = total poin reward − total poin pelanggaran (`calcPoin`), bukan angka acak. Sumber data adalah state reward/hukuman yang sama dengan halaman Pembinaan.
- NIS dibuat otomatis dengan pola `DN-2XXXX`; generator memeriksa seluruh NIS terpakai, menaikkan nomor terbesar, dan menghasilkan batch unik untuk import massal. NIS tidak berubah saat edit.
- Template import hanya memuat Nama Lengkap, Cabang, Asrama, Jenis Kelamin. Validasi mencakup field wajib, kecocokan master cabang/asrama, relasi asrama–cabang, kecocokan gender dengan asrama, dan duplikat (dalam file maupun data tersimpan).
- Kegiatan mendefinisikan kategori peserta, peserta spesifik (opsional), cabang, asrama, tanggal, dan waktu. Kategori peserta awal: Seluruh Ikhwan, Seluruh Akhwat, Kelompok Tahfidz, Kelompok Kitab, Kelompok Bahasa. Kategori yang masih dipakai kegiatan tidak dapat dihapus.
- Absensi kegiatan hanya menerima peserta yang memenuhi kategori peserta, cabang, dan asrama kegiatan.
