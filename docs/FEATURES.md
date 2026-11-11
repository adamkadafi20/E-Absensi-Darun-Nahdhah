# Daftar Fitur dan Preview Modul

## Dashboard
- Jam lokal real-time zona Asia/Jakarta yang diperbarui setiap detik.
- Kalender kegiatan dari data agenda yang sama dengan halaman Kegiatan.
- Penanda agenda per tanggal dan pop-up detail kegiatan.

## Autentikasi
- Login dan logout (simulasi frontend).
- Lupa password (alur demo).
- Tampilan status akun dan role.
- Pengalihan dashboard berdasarkan role.

## Super Admin
- Dashboard seluruh cabang.
- Data cabang dan akun admin.
- Pengaturan role/hak akses.
- Monitoring data santri, sholat, kegiatan, tahfidz, hukuman, dan reward.
- Laporan PDF lintas cabang (placeholder).
- Pengaturan sistem dan audit log.

## Admin Cabang
- Dashboard cabang.
- CRUD data santri.
- Data kegiatan, hukuman, reward, asrama, dan absensi.
- Pencatatan tahfidz.
- Akun santri.
- Rekap periode dan laporan individu.

## Santri
- Dashboard personal.
- Profil.
- Riwayat sholat, kegiatan, tahfidz, hukuman, reward.
- Ringkasan persentase kehadiran dan progres hafalan.

## Data Santri
- Tabel santri dengan NIS, nama, jenis kelamin, cabang/asrama, kehadiran, status.
- Pencarian nama/NIS.
- Dropdown kategori santri: semua, ikhwan, atau akhwat.
- Tambah, edit, hapus, lihat detail data dummy.

## Filter absensi dan tahfidz
- Filter kategori santri: Semua, Ikhwan, Akhwat.
- Filter cabang dan asrama; pilihan asrama mengikuti cabang yang dipilih.
- Filter tanggal dengan date picker untuk Absensi Sholat, Absensi Kegiatan, dan Tahfidz.
- Reset filter cabang/asrama/tanggal.
- Status kehadiran sholat dan kegiatan meliputi Hadir, Izin, Sakit, Terlambat, dan Tidak hadir.

## Absensi Sholat
- Ringkasan hadir, izin, sakit/terlambat, dan tidak hadir.
- Filter berdasarkan cabang, asrama, tanggal, serta kategori santri.
- Tabel status per waktu sholat.
- Dropdown kategori santri: semua, ikhwan, atau akhwat.
- Placeholder koreksi dan ekspor.

## Absensi Kegiatan
- Ringkasan hadir, izin, dan tidak hadir.
- Tabel per santri dengan nama kegiatan, waktu, status, dan cabang.
- Dropdown kategori santri: semua, ikhwan, atau akhwat.
- Tampilan ringkasan mengikuti pola halaman Absensi Sholat.

## Kegiatan
- Statistik kegiatan.
- Absensi kegiatan mendukung status Hadir, Izin, Sakit, Terlambat, dan Tidak hadir.
- Daftar kegiatan, jadwal, peserta, cabang, status.
- Dialog placeholder tambah kegiatan.

## Tahfidz
- Pembagian akses: Super Admin mengelola jadwal dan penugasan santri; Admin/Muhafidz/Muhafidzah hanya menerima penugasan dan mencatat setoran.
- Super Admin: membuat, mengedit, dan menghapus jadwal setoran (pengajar, cabang, asrama, tanggal, jam mulai/selesai).
- Super Admin: memilih banyak santri per jadwal dengan NIS, nama, dan kategori Ikhwan/Akhwat.
- Peringatan bentrok jadwal pengajar dan penugasan ganda santri pada tanggal/rentang waktu sama, dengan konfirmasi sebelum menyimpan.
- Ringkasan pembagian santri per Muhafidz/Muhafidzah yang dapat dipakai sebagai filter.
- Admin/Muhafidz/Muhafidzah: kartu identitas pengajar login, pilihan jadwal penugasan, statistik pencatatan, dan tabel santri dengan status setoran.
- Admin hanya melihat santri yang ditugaskan Super Admin; tidak dapat mengubah jadwal atau memindahkan penugasan.
- Form input setoran: kategori Muraja'ah/Ziyadah, jumlah halaman 1–20, juz 1–30, 114 surat, nomor halaman 1–604, keterangan Binnadzar/Bil Ghaib, penilaian Lancar/Kurang Lancar/Tidak Lancar, tanggal, waktu, dan catatan.
- Validasi: halaman awal + jumlah halaman tidak boleh melebihi halaman 604; santri wajib berasal dari jadwal penugasan.
- Dropdown kategori santri: semua, ikhwan, atau akhwat pada halaman Tahfidz.

## Riwayat Setoran Tahfidz
- Kolom riwayat: nomor, tanggal, santri, kategori, jumlah halaman, juz, surat, nomor halaman, keterangan, penilaian, dan Muhafidz/Muhafidzah pencatat.
- Filter: nama/NIS santri, tanggal, pengajar (Super Admin), cabang, asrama, kategori setoran, dan penilaian.
- Super Admin melihat seluruh riwayat; Admin hanya riwayat setoran kewenangannya.
- Detail riwayat setoran per catatan, termasuk catatan tambahan dan jadwal terkait.
- Riwayat setoran per santri dapat dibuka dari aksi tabel Admin.

## Hukuman dan Reward
- Ringkasan pembinaan.
- Tabel catatan hukuman/prestasi dan status.

## Asrama dan Cabang
- Ringkasan jumlah, kapasitas, penghuni, admin, dan status.
- Tabel pengelolaan dummy.

## Laporan PDF
- Pilihan laporan absensi sholat, kegiatan, tahfidz, hukuman, reward.
- Preview daftar laporan dan tombol unduh demo.
- Pembuatan PDF sebenarnya menunggu backend.

## Pengguna & Role, Audit Log, Pengaturan
- Tabel akun dan role.
- Riwayat aktivitas dummy.
- Konfigurasi sistem dummy.

## Komponen lintas modul
- Sidebar responsif, header, pencarian, filter, statistik, badge status, dropdown role, notifikasi, mode gelap pratinjau.


## Pembaruan UI v0.2.1
- Urutan workspace: Dashboard → Absensi Sholat → Absensi Kegiatan → Tahfidz → Data Santri → Kegiatan.
- Sidebar menyediakan submenu Ikhwan dan Akhwat pada Absensi Sholat, Absensi Kegiatan, Tahfidz, dan Data Santri.
- Memilih submenu gender mengubah filter data tabel pada modul yang dipilih.


## Pemisahan data Ikhwan/Akhwat (v0.2.2)
- Dropdown sidebar pada Absensi Sholat, Absensi Kegiatan, Tahfidz, dan Data Santri.
- Pilihan Semua Santri, Ikhwan, dan Akhwat.
- Filter sidebar menyinkronkan filter tabel pada modul terpilih.

## Modul Tahfidz dan Riwayat Setoran (v0.2.3)
- Super Admin mengelola jadwal setoran dan pembagian santri; Admin/Muhafidz/Muhafidzah hanya mencatat setoran santri yang ditugaskan.
- Form input setoran dengan validasi halaman, juz, surat, dan penilaian manual.
- Halaman Riwayat Setoran dengan filter lengkap dan pembatasan berdasarkan role.
- Akun Admin Cabang pada demo diikat ke akun Muhafidz (Ust. Hamdan) untuk simulasi penugasan.
