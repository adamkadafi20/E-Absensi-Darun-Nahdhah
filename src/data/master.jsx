// Data master dan helper bersama lintas modul (dummy, frontend saja).
// Seluruh data disimulasikan di state React hingga backend tersedia.
import { addDaysToKey } from '../ui'

// ---------------------------------------------------------------
// Cabang & asrama (master untuk form, filter, dan validasi import).
// ---------------------------------------------------------------
export const BRANCHES = ['Pusat Darun Nahdhah', 'Cabang Depok', 'Cabang Bogor', 'Cabang Bekasi']

// Setiap asrama terikat satu cabang dan satu kategori jenis kelamin.
export const DORMS = [
  { name: 'Asrama Al-Falah', branch: 'Pusat Darun Nahdhah', gender: 'Ikhwan' },
  { name: 'Asrama Al-Ikhlas', branch: 'Pusat Darun Nahdhah', gender: 'Ikhwan' },
  { name: 'Asrama An-Nisa', branch: 'Cabang Depok', gender: 'Akhwat' },
  { name: 'Asrama Al-Madinah', branch: 'Cabang Bogor', gender: 'Ikhwan' },
  { name: 'Asrama Az-Zahra', branch: 'Cabang Bogor', gender: 'Akhwat' },
  { name: 'Asrama Al-Hikmah', branch: 'Cabang Bekasi', gender: 'Ikhwan' },
  { name: 'Asrama Ummu Kulsum', branch: 'Cabang Bekasi', gender: 'Akhwat' },
]

export const dormsOfBranch = (branch) => DORMS.filter((dorm) => dorm.branch === branch)
export const findDorm = (name) => DORMS.find((dorm) => dorm.name === name)

export const GENDER_OPTIONS = ['Ikhwan', 'Akhwat']
export const STATUS_SANTRI = ['Aktif', 'Perlu perhatian', 'Nonaktif']
export const KATEGORI_KEGIATAN = ['Kegiatan', 'Tahfidz', 'Sholat', 'Pembinaan']

// ---------------------------------------------------------------
// Absensi.
// ---------------------------------------------------------------
export const SHOLAT_LIST = ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya']
export const ABSENSI_STATUS = ['Hadir', 'Izin', 'Sakit', 'Terlambat', 'Tidak Hadir']

// ---------------------------------------------------------------
// Data awal santri. NIS mengikuti pola DN-2XXXX dan tidak berubah saat edit.
// ---------------------------------------------------------------
export const INITIAL_SANTRI = [
  { nis: 'DN-24001', name: 'Ahmad Fauzan', gender: 'Ikhwan', branch: 'Pusat Darun Nahdhah', dorm: 'Asrama Al-Falah', status: 'Aktif', attendance: 96, tahfidz: '8 Juz' },
  { nis: 'DN-24002', name: 'Muhammad Rizki', gender: 'Ikhwan', branch: 'Pusat Darun Nahdhah', dorm: 'Asrama Al-Ikhlas', status: 'Aktif', attendance: 91, tahfidz: '5 Juz' },
  { nis: 'DN-24003', name: 'Aisyah Humaira', gender: 'Akhwat', branch: 'Cabang Depok', dorm: 'Asrama An-Nisa', status: 'Aktif', attendance: 98, tahfidz: '10 Juz' },
  { nis: 'DN-24004', name: 'Fatimah Zahra', gender: 'Akhwat', branch: 'Cabang Depok', dorm: 'Asrama An-Nisa', status: 'Aktif', attendance: 94, tahfidz: '6 Juz' },
  { nis: 'DN-24005', name: 'Abdullah Hakim', gender: 'Ikhwan', branch: 'Cabang Bogor', dorm: 'Asrama Al-Madinah', status: 'Perlu perhatian', attendance: 76, tahfidz: '3 Juz' },
  { nis: 'DN-24006', name: 'Nadia Safitri', gender: 'Akhwat', branch: 'Cabang Bogor', dorm: 'Asrama Az-Zahra', status: 'Aktif', attendance: 89, tahfidz: '4 Juz' },
]

// ---------------------------------------------------------------
// Reward & hukuman — sumber perhitungan poin santri.
// Poin santri = total poin reward − total poin hukuman (lihat calcPoin).
// ---------------------------------------------------------------
export const INITIAL_REWARDS = [
  { id: 'rw-1', nis: 'DN-24003', title: 'Hafalan terbaik', reason: 'Mencapai target 10 juz', poin: 100, date: addDaysToKey(-20) },
  { id: 'rw-2', nis: 'DN-24001', title: 'Teladan disiplin', reason: 'Kehadiran 100%', poin: 50, date: addDaysToKey(-21) },
  { id: 'rw-3', nis: 'DN-24004', title: 'Prestasi akademik', reason: 'Nilai kajian terbaik', poin: 75, date: addDaysToKey(-23) },
]

export const INITIAL_HUKUMAN = [
  { id: 'hk-1', nis: 'DN-24005', violation: 'Terlambat berjamaah', level: 'Ringan', poin: 10, date: addDaysToKey(-20), status: 'Dalam proses' },
  { id: 'hk-2', nis: 'DN-24002', violation: 'Tidak mengikuti piket', level: 'Ringan', poin: 10, date: addDaysToKey(-21), status: 'Selesai' },
]

// Poin konsisten: akumulasi reward dikurangi akumulasi poin pelanggaran.
// Nilai tidak diacak dan langsung bereaksi jika data reward/hukuman berubah.
export const calcPoin = (nis, rewards, hukuman) =>
  (rewards || []).filter((item) => item.nis === nis).reduce((sum, item) => sum + (Number(item.poin) || 0), 0) -
  (hukuman || []).filter((item) => item.nis === nis).reduce((sum, item) => sum + (Number(item.poin) || 0), 0)

// ---------------------------------------------------------------
// Generator NIS otomatis.
// Memeriksa seluruh NIS yang sudah dipakai (termasuk NIS di luar pola),
// mengambil nomor terbesar dari pola DN-<angka>, lalu menaikkannya satu per
// satu sehingga bulk import tidak pernah menghasilkan NIS ganda.
// ---------------------------------------------------------------
const NIS_PATTERN = /^DN-(\d+)$/

export const generateNisBatch = (existingNisList, count) => {
  const used = new Set((existingNisList || []).map((nis) => String(nis)))
  let max = 0
  used.forEach((nis) => {
    const match = NIS_PATTERN.exec(nis)
    if (match) max = Math.max(max, Number(match[1]))
  })
  const result = []
  let next = max > 0 ? max + 1 : 24001
  while (result.length < count) {
    const candidate = `DN-${String(next).padStart(5, '0')}`
    if (!used.has(candidate)) {
      result.push(candidate)
      used.add(candidate)
    }
    next += 1
  }
  return result
}

export const generateNextNis = (existingNisList) => generateNisBatch(existingNisList, 1)[0]

// ---------------------------------------------------------------
// Kategori peserta kegiatan (dapat dikelola lewat halaman Kegiatan).
// gender null berarti kategori mencakup Ikhwan dan Akhwat.
// ---------------------------------------------------------------
export const INITIAL_PARTICIPANT_CATEGORIES = [
  { id: 'pc-ikhwan', name: 'Seluruh Ikhwan', gender: 'Ikhwan' },
  { id: 'pc-akhwat', name: 'Seluruh Akhwat', gender: 'Akhwat' },
  { id: 'pc-tahfidz', name: 'Kelompok Tahfidz', gender: null },
  { id: 'pc-kitab', name: 'Kelompok Kitab', gender: null },
  { id: 'pc-bahasa', name: 'Kelompok Bahasa', gender: null },
  { id: 'pc-pengurus', name: 'Pengurus Asrama', gender: null },
]

// ---------------------------------------------------------------
// Agenda kegiatan awal (dipakai Dashboard, halaman Kegiatan, dan absensi).
// ---------------------------------------------------------------
export const createInitialActivities = () => [
  { id: 'event-1', title: 'Kajian Kitab Akhlak', category: 'Kegiatan', date: addDaysToKey(-1), time: '08:00', participantCategoryId: 'pc-ikhwan', participants: 'Seluruh Ikhwan', participantNis: [], branch: 'Pusat Darun Nahdhah', dorm: 'Semua Asrama', location: 'Aula utama', notes: 'Kajian rutin bersama pengasuh.' },
  { id: 'event-2', title: 'Setoran Tahfidz Bersama', category: 'Tahfidz', date: addDaysToKey(0), time: '06:00', participantCategoryId: 'pc-tahfidz', participants: 'Kelompok Tahfidz', participantNis: [], branch: 'Semua Cabang', dorm: 'Semua Asrama', location: 'Ruang tahfidz', notes: 'Bawa buku mutabaah hafalan.' },
  { id: 'event-3', title: 'Muhadharah Santri', category: 'Kegiatan', date: addDaysToKey(-2), time: '19:30', participantCategoryId: 'pc-akhwat', participants: 'Seluruh Akhwat', participantNis: [], branch: 'Cabang Depok', dorm: 'Asrama An-Nisa', location: 'Aula cabang', notes: 'Latihan pidato bahasa Arab dan Indonesia.' },
  { id: 'event-4', title: 'Evaluasi Pekanan Asrama', category: 'Pembinaan', date: addDaysToKey(4), time: '16:00', participantCategoryId: 'pc-pengurus', participants: 'Pengurus Asrama', participantNis: [], branch: 'Cabang Bogor', dorm: 'Semua Asrama', location: 'Ruang musyrif', notes: 'Evaluasi kedisiplinan dan program pekanan.' },
]
