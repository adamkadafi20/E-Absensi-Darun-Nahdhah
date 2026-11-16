// Data absensi dummy (frontend saja) — satu baris per catatan kehadiran.
// Absensi sholat: per santri per tanggal per waktu sholat.
// Absensi kegiatan: per santri per agenda kegiatan.
import { addDaysToKey, toDateKey } from '../ui'
import { INITIAL_PARTICIPANT_CATEGORIES, INITIAL_SANTRI, SHOLAT_LIST } from './master'

// Distribusi status deterministik (tanpa Math.random) agar data stabil per sesi.
const STATUS_POOL = ['Hadir', 'Hadir', 'Hadir', 'Hadir', 'Hadir', 'Hadir', 'Hadir', 'Terlambat', 'Izin', 'Sakit', 'Tidak Hadir']

const hashSeed = (text) => {
  let hash = 7
  for (let index = 0; index < text.length; index += 1) hash = (hash * 31 + text.charCodeAt(index)) % 100003
  return hash
}

const pickStatus = (text) => STATUS_POOL[hashSeed(text) % STATUS_POOL.length]

export const createInitialSholatRecords = () => {
  const records = []
  INITIAL_SANTRI.forEach((santri) => {
    for (let day = 4; day >= 0; day -= 1) {
      const date = addDaysToKey(-day)
      SHOLAT_LIST.forEach((sholat) => {
        records.push({
          id: `sh-${santri.nis}-${date}-${sholat}`,
          nis: santri.nis,
          date,
          sholat,
          status: pickStatus(`${santri.nis}${date}${sholat}`),
        })
      })
    }
  })
  return records
}

// Peserta absensi kegiatan mengikuti kategori peserta + cabang/asrama agenda.
export const createInitialKegiatanRecords = (activities) => {
  const today = toDateKey()
  const records = []
  ;(activities || []).filter((activity) => activity.date <= today).forEach((activity) => {
    const kategori = INITIAL_PARTICIPANT_CATEGORIES.find((item) => item.id === activity.participantCategoryId)
    const gender = kategori ? kategori.gender : null
    INITIAL_SANTRI.filter((santri) =>
      (!gender || santri.gender === gender) &&
      (activity.branch === 'Semua Cabang' || santri.branch === activity.branch) &&
      (!activity.dorm || activity.dorm === 'Semua Asrama' || santri.dorm === activity.dorm)
    ).forEach((santri) => {
      records.push({
        id: `kt-${activity.id}-${santri.nis}`,
        eventId: activity.id,
        nis: santri.nis,
        // Snapshot disimpan agar riwayat tetap terbaca bila agenda dihapus.
        title: activity.title,
        date: activity.date,
        time: activity.time,
        status: pickStatus(`${activity.id}${santri.nis}`),
      })
    })
  })
  return records
}
