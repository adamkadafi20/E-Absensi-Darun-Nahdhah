// Halaman riwayat setoran Tahfidz.
// Super Admin melihat seluruh riwayat; Admin/Muhafidz/Muhafidzah hanya
// riwayat setoran yang menjadi kewenangannya (dicatat oleh dirinya).
import { useEffect, useMemo, useState } from 'react'
import {
  BookOpen, Building2, ChevronRight, Eye, History, House, UserRound,
} from 'lucide-react'
import {
  Avatar, Badge, Button, EmptyState, FilterDate, FilterSelect, Modal,
  SearchInput, Toast, formatDateID,
} from '../ui'
import {
  KATEGORI_SETORAN, MUHAFIDZ_ACCOUNTS, PENILAIAN_SETORAN, getMuhafidz,
  getTahfidzAccount, surahLabel,
} from '../data/tahfidz'

const shortDate = (dateKey) => formatDateID(dateKey, { day: 'numeric', month: 'short', year: 'numeric' })
const penilaianTone = (p) => p === 'Lancar' ? 'green' : p === 'Kurang Lancar' ? 'amber' : 'red'
const kategoriTone = (k) => k === 'Ziyadah' ? 'green' : 'brown'

export default function RiwayatPage({ role, santri, jadwal, setoran, preset, onPresetConsumed }) {
  const isSuper = role === 'Super Admin'
  const account = getTahfidzAccount(role)
  const [query, setQuery] = useState(preset?.santriNis || '')
  const [fMuhafidz, setFMuhafidz] = useState('Semua')
  const [fBranch, setFBranch] = useState('Semua')
  const [fDorm, setFDorm] = useState('Semua')
  const [fDate, setFDate] = useState('')
  const [fKategori, setFKategori] = useState('Semua')
  const [fPenilaian, setFPenilaian] = useState('Semua')
  const [detail, setDetail] = useState(null)
  const [toast, setToast] = useState(null)
  const notify = (message, tone = 'info') => setToast({ message, tone, at: Date.now() })

  useEffect(() => { if (preset) onPresetConsumed?.() }, [preset, onPresetConsumed])

  // Batasi scope berdasarkan role: Admin hanya melihat setoran kewenangannya.
  const scoped = useMemo(() => isSuper ? setoran : setoran.filter((s) => s.muhafidzId === account?.id), [setoran, isSuper, account])
  const getSantri = (nis) => santri.find((s) => s.nis === nis)
  const branches = useMemo(() => [...new Set(santri.map((s) => s.branch))], [santri])
  const dorms = useMemo(() => [...new Set(santri.filter((s) => fBranch === 'Semua' || s.branch === fBranch).map((s) => s.dorm))], [santri, fBranch])

  const rows = useMemo(() => scoped.filter((item) => {
    const s = getSantri(item.santriNis)
    const pengajar = getMuhafidz(item.muhafidzId)
    const matchesQuery = !query || `${s?.name || ''} ${item.santriNis}`.toLowerCase().includes(query.toLowerCase())
    const matchesMuhafidz = !isSuper || fMuhafidz === 'Semua' || item.muhafidzId === fMuhafidz
    const matchesBranch = fBranch === 'Semua' || s?.branch === fBranch
    const matchesDorm = fDorm === 'Semua' || s?.dorm === fDorm
    const matchesDate = !fDate || item.tanggal === fDate
    const matchesKategori = fKategori === 'Semua' || item.kategori === fKategori
    const matchesPenilaian = fPenilaian === 'Semua' || item.penilaian === fPenilaian
    return matchesQuery && matchesMuhafidz && matchesBranch && matchesDorm && matchesDate && matchesKategori && matchesPenilaian
  }).sort((a, b) => `${b.tanggal} ${b.waktu}`.localeCompare(`${a.tanggal} ${a.waktu}`)), [scoped, santri, query, isSuper, fMuhafidz, fBranch, fDorm, fDate, fKategori, fPenilaian])

  const resetFilters = () => { setQuery(''); setFMuhafidz('Semua'); setFBranch('Semua'); setFDorm('Semua'); setFDate(''); setFKategori('Semua'); setFPenilaian('Semua') }
  const hasFilter = query || fMuhafidz !== 'Semua' || fBranch !== 'Semua' || fDorm !== 'Semua' || fDate || fKategori !== 'Semua' || fPenilaian !== 'Semua'

  const detailRows = detail ? [
    ['Tanggal & waktu', `${formatDateID(detail.tanggal)} · ${detail.waktu} WIB`],
    ['Nama santri', `${getSantri(detail.santriNis)?.name || '-'} (${detail.santriNis})`],
    ['Kategori setoran', detail.kategori],
    ['Jumlah halaman', `${detail.halaman} halaman (hal. ${detail.noHalaman}–${detail.noHalaman + detail.halaman - 1})`],
    ['Juz', `Juz ${detail.juz}`],
    ['Surat', surahLabel(detail.surah)],
    ['Keterangan', detail.keterangan],
    ['Penilaian', detail.penilaian],
    ['Muhafidz/Muhafidzah', getMuhafidz(detail.muhafidzId)?.name || '-'],
    ['Cabang / asrama santri', `${getSantri(detail.santriNis)?.branch || '-'} · ${getSantri(detail.santriNis)?.dorm || '-'}`],
    ['Jadwal setoran', jadwal.find((j) => j.id === detail.jadwalId) ? `${formatDateID(jadwal.find((j) => j.id === detail.jadwalId).date, { day: 'numeric', month: 'long', year: 'numeric' })} · ${jadwal.find((j) => j.id === detail.jadwalId).startTime}–${jadwal.find((j) => j.id === detail.jadwalId).endTime} WIB` : 'Jadwal telah dihapus'],
  ] : []

  return <div className="space-y-5">
    <Toast toast={toast} onClose={() => setToast(null)} />
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="flex items-center gap-2 text-xs text-stone-400"><span>Workspace</span><ChevronRight size={12}/><span className="text-latte-700">Tahfidz</span><ChevronRight size={12}/><span className="text-latte-700">Riwayat Setoran</span></div>
        <h2 className="mt-2 font-display text-2xl font-extrabold text-latte-900">Riwayat Setoran Tahfidz</h2>
        <p className="mt-1 text-sm text-stone-500">{isSuper ? 'Seluruh riwayat setoran lintas Muhafidz/Muhafidzah dan cabang.' : `Riwayat setoran yang dicatat oleh ${account?.name} — santri yang menjadi kewenangan Anda.`}</p>
      </div>
      <Button variant="outline" icon={BookOpen} onClick={() => notify('Demo: ekspor riwayat setoran akan dihubungkan pada tahap backend.')}>Ekspor</Button>
    </div>

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-2xl border border-[#eee5da] bg-white p-4 shadow-soft"><p className="text-xs text-stone-500">Total setoran</p><p className="mt-2 font-display text-2xl font-extrabold text-latte-900">{rows.length}</p><p className="mt-1 text-[10px] text-stone-400">Sesuai filter aktif</p></div>
      <div className="rounded-2xl border border-[#eee5da] bg-white p-4 shadow-soft"><p className="text-xs text-stone-500">Ziyadah</p><p className="mt-2 font-display text-2xl font-extrabold text-latte-900">{rows.filter((r) => r.kategori === 'Ziyadah').length}</p><p className="mt-1 text-[10px] text-stone-400">Hafalan baru</p></div>
      <div className="rounded-2xl border border-[#eee5da] bg-white p-4 shadow-soft"><p className="text-xs text-stone-500">Muraja'ah</p><p className="mt-2 font-display text-2xl font-extrabold text-latte-900">{rows.filter((r) => r.kategori === "Muraja'ah").length}</p><p className="mt-1 text-[10px] text-stone-400">Murojaah hafalan</p></div>
      <div className="rounded-2xl border border-[#eee5da] bg-white p-4 shadow-soft"><p className="text-xs text-stone-500">Perlu perhatian</p><p className="mt-2 font-display text-2xl font-extrabold text-latte-900">{rows.filter((r) => r.penilaian !== 'Lancar').length}</p><p className="mt-1 text-[10px] text-stone-400">Kurang lancar / tidak lancar</p></div>
    </div>

    <section className="overflow-hidden rounded-2xl border border-[#eee5da] bg-white shadow-soft">
      <div className="flex flex-wrap items-center gap-3 border-b border-stone-100 p-4">
        <SearchInput value={query} onChange={setQuery} placeholder="Cari nama santri atau NIS..." />
        {isSuper && <FilterSelect icon={UserRound} label="Pengajar" value={fMuhafidz} onChange={setFMuhafidz} options={[{ value: 'Semua', label: 'Semua pengajar' }, ...MUHAFIDZ_ACCOUNTS.map((m) => ({ value: m.id, label: m.name }))]} />}
        <FilterSelect icon={Building2} label="Cabang" value={fBranch} onChange={(v) => { setFBranch(v); setFDorm('Semua') }} options={['Semua', ...branches]} />
        <FilterSelect icon={House} label="Asrama" value={fDorm} onChange={setFDorm} options={['Semua', ...dorms]} />
        <FilterDate value={fDate} onChange={setFDate} />
        <FilterSelect icon={BookOpen} label="Kategori" value={fKategori} onChange={setFKategori} options={['Semua', ...KATEGORI_SETORAN]} />
        <FilterSelect icon={History} label="Penilaian" value={fPenilaian} onChange={setFPenilaian} options={['Semua', ...PENILAIAN_SETORAN]} />
        {hasFilter && <Button variant="ghost" onClick={resetFilters}>Reset filter</Button>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left">
          <thead className="bg-latte-50/70">
            <tr className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              <th className="px-5 py-3">No.</th>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Nama Santri</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Halaman</th>
              <th className="px-4 py-3">Juz</th>
              <th className="px-4 py-3">Surat</th>
              <th className="px-4 py-3">No. Hal.</th>
              <th className="px-4 py-3">Keterangan</th>
              <th className="px-4 py-3">Penilaian</th>
              <th className="px-4 py-3">Muhafidz/Muhafidzah</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item, i) => {
              const s = getSantri(item.santriNis)
              const pengajar = getMuhafidz(item.muhafidzId)
              return <tr key={item.id} className="border-t border-stone-100 transition hover:bg-latte-50/40">
                <td className="px-5 py-4 text-xs font-semibold text-stone-400">{i + 1}</td>
                <td className="px-4 py-4"><p className="text-xs font-semibold text-stone-700">{shortDate(item.tanggal)}</p><p className="mt-0.5 text-[10px] text-stone-400">{item.waktu} WIB</p></td>
                <td className="px-4 py-4"><div className="flex items-center gap-2.5"><Avatar name={s?.name || '?'} size="sm" tone={s?.gender === 'Akhwat' ? 'blue' : 'brown'}/><div><p className="text-xs font-extrabold text-latte-900">{s?.name || 'Santri terhapus'}</p><p className="mt-0.5 text-[10px] text-stone-400">{item.santriNis}</p></div></div></td>
                <td className="px-4 py-4"><Badge tone={kategoriTone(item.kategori)}>{item.kategori}</Badge></td>
                <td className="px-4 py-4 text-xs font-semibold text-stone-600">{item.halaman} hal.</td>
                <td className="px-4 py-4 text-xs text-stone-600">Juz {item.juz}</td>
                <td className="px-4 py-4 text-xs text-stone-600">{surahLabel(item.surah)}</td>
                <td className="px-4 py-4 text-xs text-stone-600">{item.noHalaman}–{item.noHalaman + item.halaman - 1}</td>
                <td className="px-4 py-4 text-xs text-stone-600">{item.keterangan}</td>
                <td className="px-4 py-4"><Badge tone={penilaianTone(item.penilaian)}>{item.penilaian}</Badge></td>
                <td className="px-4 py-4"><p className="text-xs font-semibold text-stone-700">{pengajar?.name || '-'}</p><p className="mt-0.5 text-[10px] text-stone-400">{pengajar?.role}</p></td>
                <td className="px-4 py-4 text-right"><button title="Detail riwayat setoran" onClick={() => setDetail(item)} className="rounded-lg p-2 text-stone-400 hover:bg-latte-100 hover:text-latte-700"><Eye size={15}/></button></td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && <EmptyState title="Riwayat tidak ditemukan" desc="Coba ubah pencarian atau filter tanggal, pengajar, cabang, asrama, kategori, dan penilaian."/>}
      <div className="border-t border-stone-100 px-5 py-3 text-[11px] text-stone-400">Menampilkan {rows.length} dari {scoped.length} setoran · {isSuper ? 'Akses Super Admin: seluruh riwayat' : `Akses ${account?.role}: hanya setoran kewenangan Anda`}</div>
    </section>

    {detail && <Modal
      title="Detail Riwayat Setoran"
      subtitle={`${getSantri(detail.santriNis)?.name || '-'} · dicatat oleh ${getMuhafidz(detail.muhafidzId)?.name || '-'}`}
      icon={History}
      onClose={() => setDetail(null)}
      footer={<Button variant="outline" onClick={() => setDetail(null)}>Tutup</Button>}
    >
      <div className="mt-5 divide-y divide-stone-100 rounded-2xl border border-stone-100">
        {detailRows.map(([label, value]) => (
          <div key={label} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
            <p className="text-xs font-bold text-stone-500">{label}</p>
            <p className="text-right text-xs font-extrabold text-latte-900">{value}</p>
          </div>
        ))}
      </div>
      {detail.catatan && <div className="mt-4 rounded-xl bg-latte-50 p-3.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Catatan Muhafidz/Muhafidzah</p>
        <p className="mt-1 text-xs leading-5 text-stone-600">{detail.catatan}</p>
      </div>}
    </Modal>}
  </div>
}
