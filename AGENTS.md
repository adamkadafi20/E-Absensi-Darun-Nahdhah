# AGENTS.md — E-Absensi Darun Nahdhah

## Mission
Bangun frontend E-Absensi Darun Nahdhah sesuai SOT, menggunakan React + Vite + Tailwind CSS. Jaga implementasi tetap hemat token, modular, mudah dipelihara, dan tidak melampaui scope yang disepakati.

## Source of truth
1. `docs/SOT.md` adalah kontrak produk utama.
2. `docs/FEATURES.md` adalah daftar cakupan fitur dan preview modul.
3. Jika ada konflik, ikuti SOT dan ajukan pertanyaan sebelum mengubah requirement.
4. Jangan mengarang fitur baru yang tidak ada dalam scope.

## Tech stack
- React 18
- Vite
- Tailwind CSS 3
- lucide-react untuk ikon
- SheetJS (`xlsx`) untuk import/export Excel Data Santri
- JavaScript/JSX; tidak menambahkan framework UI lain tanpa persetujuan.

## UI rules
- Gunakan palet hijau tanaman (plant green): Forest `#245C43`, Leaf `#4F8060`, Sage `#A9C5A0`, background `#F5F8F3`, card `#FFFFFF`, border `#E0E9DE`, teks `#20372A` / `#78877A`.
- Pertahankan gaya modern SaaS, responsive layout, sidebar, header, card, table, badges, dan form konsisten.
- Modul berbasis kategori santri (Data Santri, Absensi Sholat, Absensi Kegiatan, Tahfidz) wajib menampilkan pilihan Ikhwan/Akhwat terlebih dahulu; tidak ada opsi "Semua Santri" dan data tidak boleh tercampur.
- Bahasa UI adalah Bahasa Indonesia.
- Hindari emoji dekoratif berlebihan; gunakan ikon Lucide.
- Semua halaman harus memiliki empty state, label yang jelas, dan feedback untuk aksi penting.
- Jangan mengorbankan responsivitas desktop/mobile.

## Data and behavior
- Sampai ada kontrak backend, gunakan data dummy lokal.
- Jangan menyatakan login, otorisasi, PDF, backup, atau audit sebagai fitur produksi.
- Aksi demo harus memberi feedback yang jelas.
- Data CRUD harus menggunakan state React; jangan manipulasi DOM secara langsung.
- Jangan menyimpan data sensitif dalam localStorage/sessionStorage untuk sekadar simulasi.

## Access and roles
- Role demo: `Super Admin`, `Admin Cabang`, `Santri`.
- UI boleh menyimulasikan perubahan role, tetapi otorisasi sebenarnya wajib diverifikasi di backend pada fase backend.
- Admin Cabang hanya boleh melihat data cabang yang ditugaskan setelah backend tersedia.
- Santri hanya boleh membaca data miliknya setelah backend tersedia.

## Code quality
- Utamakan komponen kecil dan reusable.
- Hindari duplikasi UI yang besar; ekstrak komponen jika mulai berulang.
- Gunakan nama variabel yang jelas.
- Periksa `npm run build` setelah perubahan.
- Jangan menambahkan dependency tanpa alasan yang jelas.
- Jangan menghapus dokumen SOT/kontrak tanpa persetujuan.

## Completion checklist
- [ ] Perubahan sesuai SOT.
- [ ] Tampilan responsive.
- [ ] Interaksi utama memiliki feedback.
- [ ] Tidak ada error build.
- [ ] Batasan data dummy/backend dijelaskan.
- [ ] Ringkasan file yang diubah dan cara uji disampaikan.
