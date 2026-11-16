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
- Tabel santri: NIS, Nama, Jenis Kelamin, Cabang, Asrama, Kehadiran, Poin, Status, Aksi.
- Poin = total poin reward − total poin pelanggaran (bukan nilai acak), tampil sebagai badge dan dapat dirinci pada detail santri.
- Pencarian nama dan NIS terpisah.
- Kategori santri wajib Ikhwan atau Akhwat (tanpa opsi "Semua Santri"), dengan gate pilihan awal.
- Filter cabang → asrama (asrama mengikuti cabang), status, nama, dan NIS; semua filter dapat dikombinasikan dan direset.
- Tambah, edit, hapus, dan detail data dummy. NIS dibuat otomatis (pola `DN-2XXXX`), unik, dan tidak berubah saat edit.
- Import Excel (.xlsx) dengan template Nama Lengkap, Cabang, Asrama, Jenis Kelamin: unduh template → unggah → pratinjau validasi per baris → import baris valid tanpa menyembunyikan baris gagal.
- Export Excel: seluruh data atau data terfilter; nama file `Data_Santri_Darun_Nahdhah_YYYY-MM-DD.xlsx`.

## Filter absensi dan tahfidz
- Filter kategori santri: Ikhwan atau Akhwat (tidak ada campuran data).
- Filter cabang dan asrama; pilihan asrama mengikuti cabang yang dipilih.
- Filter rentang tanggal (dari–sampai) untuk Absensi Sholat, Absensi Kegiatan, Jadwal Tahfidz, dan Riwayat Setoran.
- Reset filter mengembalikan seluruh pilihan ke kondisi awal.
- Statistik dan jumlah baris mengikuti hasil filter; empty state tampil bila tidak ada hasil.
- Status kehadiran sholat dan kegiatan meliputi Hadir, Izin, Sakit, Terlambat, dan Tidak Hadir.

## Absensi Sholat
- Ringkasan Hadir, Izin, Sakit, Terlambat, dan Tidak Hadir yang dihitung dari hasil filter.
- Filter kategori, cabang → asrama, rentang tanggal, jenis sholat, status, dan pencarian nama/NIS.
- Tabel status per santri, tanggal, dan waktu sholat.
- Form "Catat Absensi" dan edit absensi dengan validasi duplikat serta feedback toast.

## Absensi Kegiatan
- Ringkasan status kehadiran dari hasil filter.
- Filter kategori, cabang → asrama, daftar kegiatan dari master kegiatan, rentang tanggal, status, dan pencarian.
- Peserta yang dapat dicatat mengikuti kategori peserta, cabang, dan asrama kegiatan.
- Form "Catat Absensi" dan edit absensi dengan validasi duplikat serta feedback toast.

## Kegiatan
- Statistik agenda, agenda mendatang, dan kategori peserta terpakai.
- Filter pencarian, kategori kegiatan, kategori peserta, dan cabang.
- Daftar kegiatan: nama, tanggal & waktu, kategori peserta, peserta spesifik, cabang/asrama, kategori, status.
- Tambah/edit kegiatan dengan kategori peserta, peserta spesifik multi-pilih, cabang, asrama, tanggal, waktu, lokasi, dan catatan.
- Deteksi duplikasi kegiatan berdasarkan nama, tanggal, waktu, dan cabang.
- Tombol (+) di samping kategori peserta untuk menambah kategori baru; kategori dapat diedit/dihapus dengan validasi relasi (kategori yang masih dipakai kegiatan tidak dapat dihapus).
- Hapus kegiatan sekaligus membersihkan absensi kegiatan terkait.

## Tahfidz
- Pembagian akses: Super Admin mengelola jadwal dan penugasan santri; Admin/Muhafidz/Muhafidzah hanya menerima penugasan dan mencatat setoran.
- Super Admin: membuat, mengedit, dan menghapus jadwal setoran (pengajar, cabang, asrama, tanggal, jam mulai/selesai).
- Super Admin: memilih banyak santri per jadwal dengan NIS, nama, dan kategori Ikhwan/Akhwat.
- Peringatan bentrok jadwal pengajar dan penugasan ganda santri pada tanggal/rentang waktu sama, dengan konfirmasi sebelum menyimpan.
- Ringkasan pembagian santri per Muhafidz/Muhafidzah yang dapat dipakai sebagai filter; hanya pengajar yang memiliki jadwal yang muncul pada filter.
- Admin/Muhafidz/Muhafidzah: kartu identitas pengajar login, pilihan jadwal penugasan, statistik pencatatan, dan tabel santri dengan status setoran.
- Admin hanya melihat santri yang ditugaskan Super Admin; tidak dapat mengubah jadwal atau memindahkan penugasan.
- Form input setoran: kategori Muraja'ah/Ziyadah, jumlah halaman 1–20, juz 1–30, 114 surat, nomor halaman 1–604, keterangan Binnadzar/Bil Ghaib, penilaian Lancar/Kurang Lancar/Tidak Lancar, tanggal, waktu, dan catatan.
- Validasi: halaman awal + jumlah halaman tidak boleh melebihi halaman 604; santri wajib berasal dari jadwal penugasan.
- Kategori santri Ikhwan/Akhwat wajib dipilih sebelum data ditampilkan (tanpa opsi "Semua Santri").

## Riwayat Setoran Tahfidz
- Kolom riwayat: nomor, tanggal, santri, kategori, jumlah halaman, juz, surat, nomor halaman, keterangan, penilaian, dan Muhafidz/Muhafidzah pencatat.
- Filter: nama/NIS santri, rentang tanggal, pengajar (Super Admin), cabang, asrama, kategori setoran, dan penilaian.
- Filter pengajar hanya menampilkan Muhafidz/Muhafidzah yang memiliki riwayat pada scope role.
- Riwayat mengikuti kategori Ikhwan/Akhwat yang dipilih pada modul Tahfidz.
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
- Sidebar menyediakan submenu Ikhwan dan Akhwat pada Absensi Sholat, Absensi Kegiatan, Tahfidz, dan Data Santri.
- Memilih submenu gender mengubah filter data tabel pada modul yang dipilih.


## Pemisahan data Ikhwan/Akhwat (v0.2.2)
- Dropdown sidebar pada Absensi Sholat, Absensi Kegiatan, Tahfidz, dan Data Santri.
- Filter sidebar menyinkronkan filter tabel pada modul terpilih.

## Modul Tahfidz dan Riwayat Setoran (v0.2.3)
- Super Admin mengelola jadwal setoran dan pembagian santri; Admin/Muhafidz/Muhafidzah hanya mencatat setoran santri yang ditugaskan.
- Form input setoran dengan validasi halaman, juz, surat, dan penilaian manual.
- Halaman Riwayat Setoran dengan filter lengkap dan pembatasan berdasarkan role.
- Akun Admin Cabang pada demo diikat ke akun Muhafidz (Ust. Hamdan) untuk simulasi penugasan.

## Pembaruan v0.3.0 — Tema hijau, filter fungsional, Excel, Poin, Kategori Peserta
- Tema plant green diterapkan pada sidebar, header, kartu, tombol, badge, modal, dropdown, input, tabel, dan grafik.
- Urutan sidebar Workspace: Dashboard, Data Santri, Absensi Sholat, Absensi Kegiatan, Tahfidz, Kegiatan, Riwayat Setoran.
- Opsi "Semua Santri" dihapus dari submenu dan halaman; kategori Ikhwan/Akhwat wajib dipilih, data tidak tercampur, Super Admin tetap dapat berganti kategori.
- Seluruh filter modul utama benar-benar menyaring data, dapat dikombinasikan, dan direset. Statistik mengikuti hasil filter dan empty state tersedia.
- Data Santri: kolom Poin setelah Kehadiran, perhitungan poin dari reward/hukuman, NIS otomatis unik dan tetap saat edit.
- Import/Export Excel Data Santri dengan SheetJS, template tanpa NIS, validasi per baris, pratinjau, dan opsi export seluruh/terfilter.
- Kegiatan: kategori peserta dapat dikelola (+ modal), peserta spesifik opsional, validasi relasi hapus kategori, dan filter daftar kegiatan berdasarkan kategori peserta.
- Absensi Sholat dan Absensi Kegiatan memiliki form pencatatan absensi interaktif dengan validasi dan toast.
- Seluruh data tetap berupa state React/dummy; belum ada backend, autentikasi, atau PDF produksi.
