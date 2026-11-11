// Data dan konstanta modul Tahfidz (dummy, frontend saja — belum ada backend).
import { addDaysToKey } from '../ui'

export const KATEGORI_SETORAN = ["Muraja'ah", 'Ziyadah']
export const KETERANGAN_SETORAN = ['Binnadzar', 'Bil Ghaib']
export const PENILAIAN_SETORAN = ['Lancar', 'Kurang Lancar', 'Tidak Lancar']

// 114 surat Al-Qur'an berurutan, Al-Fatihah sampai An-Nas.
export const SURAH_LIST = [
  'Al-Fatihah', 'Al-Baqarah', 'Ali Imran', 'An-Nisa', "Al-Ma'idah", "Al-An'am", "Al-A'raf", 'Al-Anfal',
  'At-Taubah', 'Yunus', 'Hud', 'Yusuf', "Ar-Ra'd", 'Ibrahim', 'Al-Hijr', 'An-Nahl', 'Al-Isra', 'Al-Kahf',
  'Maryam', 'Taha', 'Al-Anbiya', 'Al-Hajj', "Al-Mu'minun", 'An-Nur', 'Al-Furqan', "Asy-Syu'ara", 'An-Naml',
  'Al-Qashash', 'Al-Ankabut', 'Ar-Rum', 'Luqman', 'As-Sajdah', 'Al-Ahzab', 'Saba', 'Fathir', 'Yasin',
  'Ash-Shaffat', 'Shad', 'Az-Zumar', 'Ghafir', 'Fushshilat', 'Asy-Syura', 'Az-Zukhruf', 'Ad-Dukhan',
  'Al-Jasiyah', 'Al-Ahqaf', 'Muhammad', 'Al-Fath', 'Al-Hujurat', 'Qaf', 'Adz-Dzariyat', 'Ath-Thur',
  'An-Najm', 'Al-Qamar', 'Ar-Rahman', "Al-Waqi'ah", 'Al-Hadid', 'Al-Mujadilah', 'Al-Hasyr', 'Al-Mumtahanah',
  'Ash-Shaff', "Al-Jumu'ah", 'Al-Munafiqun', 'At-Taghabun', 'Ath-Thalaq', 'At-Tahrim', 'Al-Mulk', 'Al-Qalam',
  'Al-Haqqah', "Al-Ma'arij", 'Nuh', 'Al-Jinn', 'Al-Muzzammil', 'Al-Muddaththir', 'Al-Qiyamah', 'Al-Insan',
  'Al-Mursalat', 'An-Naba', "An-Nazi'at", 'Abasa', 'At-Takwir', 'Al-Infithar', 'Al-Muthaffifin', 'Al-Insyiqaq',
  'Al-Buruj', 'Ath-Thariq', "Al-A'la", 'Al-Ghasyiyah', 'Al-Fajr', 'Al-Balad', 'Asy-Syams', 'Al-Lail',
  'Adh-Dhuha', 'Al-Insyirah', 'At-Tin', 'Al-Alaq', 'Al-Qadr', 'Al-Bayyinah', 'Az-Zalzalah', 'Al-Adiyat',
  "Al-Qari'ah", 'At-Takatsur', 'Al-Ashr', 'Al-Humazah', 'Al-Fil', 'Quraisy', 'Al-Maun', 'Al-Kautsar',
  'Al-Kafirun', 'An-Nasr', 'Al-Lahab', 'Al-Ikhlas', 'Al-Falaq', 'An-Nas',
]

export const surahLabel = (surahNumber) => surahNumber ? `${surahNumber} · ${SURAH_LIST[surahNumber - 1] || '-'}` : '-'

// Akun pengajar tahfidz. Relasi user-role-jadwal disimulasikan di sini
// hingga backend tersedia; Super Admin memilih dari daftar ini.
export const MUHAFIDZ_ACCOUNTS = [
  { id: 'u-hamd', name: 'Ust. Hamdan Al-Ghofil', role: 'Muhafidz', branch: 'Pusat Darun Nahdhah' },
  { id: 'u-maryam', name: 'Usth. Maryam Shalihah', role: 'Muhafidzah', branch: 'Cabang Depok' },
  { id: 'u-fauzi', name: 'Ust. Ahmad Fauzi', role: 'Muhafidz', branch: 'Cabang Bogor' },
]

// Akun demo Admin Cabang diikat ke akun Muhafidz ini saat membuka modul Tahfidz.
export const DEMO_ADMIN_MUHAFIDZ_ID = 'u-hamd'

export const getMuhafidz = (id) => MUHAFIDZ_ACCOUNTS.find((m) => m.id === id)

export const getTahfidzAccount = (role) => role === 'Super Admin'
  ? { id: 'u-super', name: 'Super Administrator', role: 'Super Admin', branch: 'Semua Cabang' }
  : role === 'Admin Cabang'
    ? getMuhafidz(DEMO_ADMIN_MUHAFIDZ_ID)
    : null

// Jadwal setoran: satu jadwal berhubungan dengan satu Muhafidz/Muhafidzah
// dan banyak santri (relasi many-to-many via array NIS pada prototipe ini).
export const createInitialJadwal = () => [
  { id: 'tfj-1', muhafidzId: 'u-hamd', branch: 'Pusat Darun Nahdhah', dorm: 'Semua Asrama', date: addDaysToKey(-3), startTime: '16:00', endTime: '17:30', santriNis: ['DN-24001', 'DN-24002'] },
  { id: 'tfj-2', muhafidzId: 'u-hamd', branch: 'Pusat Darun Nahdhah', dorm: 'Semua Asrama', date: addDaysToKey(0), startTime: '16:00', endTime: '17:30', santriNis: ['DN-24001', 'DN-24002'] },
  { id: 'tfj-3', muhafidzId: 'u-hamd', branch: 'Pusat Darun Nahdhah', dorm: 'Asrama Al-Falah', date: addDaysToKey(2), startTime: '06:00', endTime: '07:00', santriNis: ['DN-24001'] },
  { id: 'tfj-4', muhafidzId: 'u-maryam', branch: 'Cabang Depok', dorm: 'Asrama An-Nisa', date: addDaysToKey(-2), startTime: '09:00', endTime: '10:30', santriNis: ['DN-24003', 'DN-24004'] },
  { id: 'tfj-5', muhafidzId: 'u-maryam', branch: 'Cabang Depok', dorm: 'Asrama An-Nisa', date: addDaysToKey(1), startTime: '09:00', endTime: '10:30', santriNis: ['DN-24003', 'DN-24004'] },
  { id: 'tfj-6', muhafidzId: 'u-fauzi', branch: 'Cabang Bogor', dorm: 'Semua Asrama', date: addDaysToKey(0), startTime: '08:00', endTime: '09:00', santriNis: ['DN-24005', 'DN-24006'] },
]

// Riwayat setoran: setiap setoran terhubung santri (NIS), Muhafidz/Muhafidzah
// pencatat, dan jadwal yang berlaku saat setoran dicatat.
export const createInitialSetoran = () => [
  { id: 'tfs-1', jadwalId: 'tfj-1', santriNis: 'DN-24001', muhafidzId: 'u-hamd', kategori: 'Ziyadah', halaman: 2, juz: 10, surah: 10, noHalaman: 208, keterangan: 'Binnadzar', penilaian: 'Lancar', tanggal: addDaysToKey(-3), waktu: '16:15', catatan: 'Hafalan baru sudah mantap, pertahankan.' },
  { id: 'tfs-2', jadwalId: 'tfj-1', santriNis: 'DN-24002', muhafidzId: 'u-hamd', kategori: "Muraja'ah", halaman: 3, juz: 6, surah: 6, noHalaman: 128, keterangan: 'Binnadzar', penilaian: 'Kurang Lancar', tanggal: addDaysToKey(-3), waktu: '16:40', catatan: 'Perlu diulang pada setoran berikutnya.' },
  { id: 'tfs-3', jadwalId: 'tfj-1', santriNis: 'DN-24001', muhafidzId: 'u-hamd', kategori: "Muraja'ah", halaman: 5, juz: 7, surah: 7, noHalaman: 156, keterangan: 'Bil Ghaib', penilaian: 'Lancar', tanggal: addDaysToKey(-3), waktu: '17:05', catatan: '' },
  { id: 'tfs-4', jadwalId: 'tfj-4', santriNis: 'DN-24003', muhafidzId: 'u-maryam', kategori: 'Ziyadah', halaman: 1, juz: 11, surah: 11, noHalaman: 221, keterangan: 'Binnadzar', penilaian: 'Lancar', tanggal: addDaysToKey(-2), waktu: '09:20', catatan: 'Tartil bagus dan tenang.' },
  { id: 'tfs-5', jadwalId: 'tfj-4', santriNis: 'DN-24004', muhafidzId: 'u-maryam', kategori: "Muraja'ah", halaman: 2, juz: 4, surah: 4, noHalaman: 77, keterangan: 'Bil Ghaib', penilaian: 'Kurang Lancar', tanggal: addDaysToKey(-2), waktu: '09:45', catatan: '' },
  { id: 'tfs-6', jadwalId: 'tfj-6', santriNis: 'DN-24006', muhafidzId: 'u-fauzi', kategori: 'Ziyadah', halaman: 2, juz: 28, surah: 58, noHalaman: 382, keterangan: 'Binnadzar', penilaian: 'Lancar', tanggal: addDaysToKey(0), waktu: '08:15', catatan: '' },
]

// Deteksi bentrok jadwal dan penugasan ganda pada tanggal sama dengan rentang waktu beririsan.
export const findJadwalConflicts = (jadwalList, candidate, santri) => {
  if (!candidate.muhafidzId || !candidate.date || !candidate.startTime || !candidate.endTime) return []
  const conflicts = []
  jadwalList.forEach((jadwal) => {
    if (jadwal.id === candidate.id || jadwal.date !== candidate.date) return
    const overlap = jadwal.startTime < candidate.endTime && candidate.startTime < jadwal.endTime
    if (!overlap) return
    const pengajar = getMuhafidz(jadwal.muhafidzId)
    if (jadwal.muhafidzId === candidate.muhafidzId) {
      conflicts.push(`${pengajar?.name || 'Pengajar'} sudah memiliki jadwal lain pada tanggal yang sama, pukul ${jadwal.startTime}–${jadwal.endTime} WIB.`)
    }
    const ganda = (candidate.santriNis || []).filter((nis) => jadwal.santriNis.includes(nis))
    if (ganda.length) {
      const names = ganda.map((nis) => santri.find((s) => s.nis === nis)?.name || nis).join(', ')
      conflicts.push(`Santri ${names} sudah ditugaskan ke ${pengajar?.name || 'pengajar lain'} pada pukul ${jadwal.startTime}–${jadwal.endTime} WIB.`)
    }
  })
  return conflicts
}
