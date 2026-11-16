// Halaman generik untuk modul Pembinaan/Sistem yang masih berupa preview.
// Data Reward & Hukuman diturunkan dari state yang sama dengan kolom Poin santri.
import { useEffect, useMemo, useState } from 'react'
import {
  Activity, Award, Building2, ChevronRight, Download, FileText, House, Plus,
  Settings, ShieldCheck, UserCog, Users, X,
} from 'lucide-react'
import { Badge, Button, EmptyState, FilterSelect, Modal, SearchInput, formatDateID, toDateKey } from '../ui'
import BrandLogo from '../components/BrandLogo'
import { BRANCHES, DORMS } from '../data/master'

const shortDate = (date) => formatDateID(date, { day: 'numeric', month: 'short', year: 'numeric' })
const cellTone = (cell) => {
  if (['Aktif', 'Berhasil', 'Selesai', 'Hadir', 'Selesai ditindaklanjuti'].includes(cell)) return 'green'
  if (['Dalam proses', 'Perlu perhatian', 'Izin', 'Terlambat', 'Kurang Lancar'].includes(cell)) return 'amber'
  if (cell === 'Sakit') return 'blue'
  if (['Tidak hadir', 'Nonaktif', 'Tidak Lancar'].includes(cell)) return 'red'
  return null
}

export default function GenericPage({ page, role, santri, rewards, hukuman }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Semua')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => { setSearch(''); setFilter('Semua') }, [page])

  const configs = useMemo(() => {
    const hukumanRows = (hukuman || []).map((item) => {
      const student = santri.find((s) => s.nis === item.nis)
      return [student?.name || item.nis, item.violation, item.level, shortDate(item.date), item.status, `${item.poin} poin`]
    })
    const rewardRows = (rewards || []).map((item) => {
      const student = santri.find((s) => s.nis === item.nis)
      return [student?.name || item.nis, item.title, item.reason, shortDate(item.date), String(item.poin)]
    })
    return {
      'Hukuman': {
        sub: 'Catatan pelanggaran dan tindak lanjut pembinaan. Sumber poin pelanggaran pada Data Santri.',
        icon: ShieldCheck,
        stats: [
          ['Total catatan', String(hukumanRows.length), 'amber'],
          ['Selesai', String((hukuman || []).filter((item) => item.status === 'Selesai').length), 'green'],
          ['Dalam proses', String((hukuman || []).filter((item) => item.status !== 'Selesai').length), 'red'],
          ['Total poin', String((hukuman || []).reduce((sum, item) => sum + (Number(item.poin) || 0), 0)), 'leaf'],
        ],
        cols: ['Santri', 'Pelanggaran', 'Tingkat', 'Tanggal', 'Status', 'Poin'],
        rows: hukumanRows,
        filterOptions: ['Semua', 'Selesai', 'Dalam proses'],
      },
      'Reward': {
        sub: 'Dokumentasikan prestasi dan apresiasi santri. Sumber poin reward pada Data Santri.',
        icon: Award,
        stats: [
          ['Total reward', String(rewardRows.length), 'green'],
          ['Santri penerima', String(new Set((rewards || []).map((item) => item.nis)).size), 'blue'],
          ['Total poin', String((rewards || []).reduce((sum, item) => sum + (Number(item.poin) || 0), 0)), 'amber'],
        ],
        cols: ['Penerima', 'Reward', 'Alasan', 'Tanggal', 'Poin'],
        rows: rewardRows,
        filterOptions: ['Semua'],
      },
      'Asrama': {
        sub: 'Unit asrama, kategori gender, cabang, dan jumlah penghuni pada data demo.',
        icon: House,
        stats: [
          ['Total asrama', String(DORMS.length), 'leaf'],
          ['Asrama Ikhwan', String(DORMS.filter((dorm) => dorm.gender === 'Ikhwan').length), 'leaf'],
          ['Asrama Akhwat', String(DORMS.filter((dorm) => dorm.gender === 'Akhwat').length), 'red'],
          ['Santri ditempatkan', String(santri.length), 'green'],
        ],
        cols: ['Nama Asrama', 'Kategori', 'Cabang', 'Penghuni', 'Status'],
        rows: DORMS.map((dorm) => [dorm.name, dorm.gender, dorm.branch, String(santri.filter((item) => item.dorm === dorm.name).length), 'Aktif']),
        filterOptions: ['Semua', 'Ikhwan', 'Akhwat', 'Aktif'],
      },
      'Cabang': {
        sub: 'Unit cabang Darun Nahdhah dalam satu sistem terpusat (data dummy).',
        icon: Building2,
        stats: [
          ['Cabang aktif', String(BRANCHES.length), 'green'],
          ['Total santri', String(santri.length), 'leaf'],
          ['Admin cabang', String(Math.max(0, BRANCHES.length - 1)), 'blue'],
        ],
        cols: ['Nama Cabang', 'Penanggung Jawab', 'Jumlah Santri', 'Admin', 'Status'],
        rows: BRANCHES.map((branch, index) => [branch, ['KH. Abdullah Karim', 'Ust. Ahmad Fauzi', 'Ust. Hamdan', 'Ust. M. Ridwan'][index] || '-', String(santri.filter((item) => item.branch === branch).length), index === 0 ? 'admin.pusat' : `admin.${branch.split(' ').pop()?.toLowerCase()}`, 'Aktif']),
        filterOptions: ['Semua', 'Aktif'],
      },
      'Laporan PDF': {
        sub: 'Pratinjau daftar laporan. Pembuatan PDF sebenarnya menunggu backend.',
        icon: FileText,
        stats: [['Jenis laporan', '5', 'leaf'], ['Laporan bulan ini', '128', 'green'], ['Siap diunduh', '12', 'blue']],
        cols: ['Jenis Laporan', 'Periode', 'Cakupan', 'Dibuat oleh', 'Aksi'],
        rows: [['Absensi Sholat', 'Oktober 2026', 'Individu · Ahmad Fauzan', 'Admin Pusat', 'Unduh PDF'], ['Kehadiran Kegiatan', 'Oktober 2026', 'Cabang Depok', 'Admin Depok', 'Unduh PDF'], ['Perkembangan Tahfidz', 'September 2026', 'Individu · Aisyah', 'Admin Pusat', 'Unduh PDF'], ['Rekap Santri', 'Triwulan III 2026', 'Semua cabang', 'Super Admin', 'Unduh PDF']],
        filterOptions: ['Semua'],
      },
      'Pengguna & Role': {
        sub: 'Atur akun, peran, dan batas akses setiap pengguna (simulasi).',
        icon: UserCog,
        stats: [['Total pengguna', String(santri.length + 4), 'leaf'], ['Admin aktif', String(BRANCHES.length), 'green'], ['Akun perlu ditinjau', '3', 'amber']],
        cols: ['Pengguna', 'Username', 'Role', 'Cabang', 'Status'],
        rows: [['Super Administrator', 'superadmin', 'Super Admin', 'Semua cabang', 'Aktif'], ...BRANCHES.map((branch, index) => [`Admin ${branch.split(' ').pop()}`, index === 0 ? 'admin.pusat' : `admin.${branch.split(' ').pop()?.toLowerCase()}`, 'Admin Cabang', branch, 'Aktif']), ...santri.slice(0, 2).map((item) => [item.name, item.nis, 'Santri', item.branch, item.status])],
        filterOptions: ['Semua', 'Super Admin', 'Admin Cabang', 'Santri', 'Aktif'],
      },
      'Audit Log': {
        sub: 'Riwayat aktivitas penting (data dummy, bukan audit produksi).',
        icon: Activity,
        stats: [['Aktivitas hari ini', '246', 'green'], ['Login berhasil', '128', 'blue'], ['Perlu ditinjau', '2', 'amber']],
        cols: ['Pengguna', 'Aktivitas', 'Modul', 'Waktu', 'Alamat IP', 'Status'],
        rows: [['admin.pusat', 'Memperbarui absensi', 'Absensi Sholat', '10.24', '192.168.1.10', 'Berhasil'], ['superadmin', 'Membuat akun admin', 'Pengguna', '09.51', '192.168.1.2', 'Berhasil'], ['admin.depok', 'Mengubah data santri', 'Data Santri', '09.16', '192.168.1.18', 'Berhasil']],
        filterOptions: ['Semua', 'Berhasil'],
      },
      'Pengaturan': {
        sub: 'Konfigurasi dasar aplikasi dan preferensi operasional (demo).',
        icon: Settings,
        stats: [['Status sistem', 'Normal', 'green'], ['Zona waktu', 'WIB', 'leaf'], ['Versi aplikasi', '0.3.0', 'blue']],
        cols: ['Pengaturan', 'Nilai saat ini', 'Keterangan'],
        rows: [['Nama aplikasi', 'E-Absensi Darun Nahdhah', 'Identitas sistem'], ['Zona waktu', 'Asia/Jakarta (WIB)', 'Waktu pencatatan'], ['Format tanggal', 'DD MMM YYYY', 'Format tampilan'], ['Tema', 'Hijau tanaman', 'Palet plant green v0.3'], ['Backup database', 'Belum terhubung', 'Konfigurasi backend']],
        filterOptions: ['Semua'],
      },
    }
  }, [santri, rewards, hukuman])

  const cfg = configs[page] || configs['Pengaturan']
  const Icon = cfg.icon
  const filteredRows = cfg.rows.filter((row) => {
    const matchesSearch = row.join(' ').toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'Semua' || row.some((cell) => String(cell) === filter)
    return matchesSearch && matchesFilter
  })
  const readOnly = ['Laporan PDF', 'Audit Log', 'Pengaturan'].includes(page)

  const renderCell = (cell, index) => {
    const tone = cellTone(cell)
    if (tone) return <Badge tone={tone}>{cell}</Badge>
    if (cell === 'Ikhwan') return <Badge tone="leaf">{cell}</Badge>
    if (cell === 'Akhwat') return <Badge tone="blue">{cell}</Badge>
    if (cell === 'Super Admin' || cell === 'Admin Cabang' || cell === 'Santri') return <Badge tone="neutral">{cell}</Badge>
    if (page === 'Laporan PDF' && cell === 'Unduh PDF') return <button onClick={() => alert('Demo: file PDF akan dibuat dari data backend.')} className="inline-flex items-center gap-1 font-bold text-leaf-700 hover:underline"><Download size={13}/> {cell}</button>
    return cell
  }

  return <div className="space-y-5">
    {page === 'Laporan PDF' && <section className="report-document overflow-hidden rounded-2xl border border-[#e0e9de] bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div className="flex items-center gap-4">
          <BrandLogo variant="document" />
          <div>
            <p className="font-display text-sm font-extrabold leading-5 text-leaf-900">Pondok Pesantren Darun Nahdhah Al-Islamiyah</p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-[.14em] text-leaf-500">E-Absensi Darun Nahdhah</p>
            <p className="mt-1 text-[10px] text-stone-400">Header laporan · Dokumen pratinjau</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-[.14em] text-stone-400">Tanggal cetak</p>
          <p className="mt-1 text-xs font-extrabold text-leaf-900">{formatDateID(toDateKey())}</p>
        </div>
      </div>
      <p className="mt-3 text-[10px] leading-5 text-stone-400">Logo resmi tampil pada hasil cetak halaman ini. Pembuatan file PDF final menunggu backend.</p>
    </section>}

    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="flex items-center gap-2 text-xs text-stone-400"><span>{['Hukuman', 'Reward', 'Asrama', 'Cabang'].includes(page) ? 'Pembinaan' : 'Sistem'}</span><ChevronRight size={12}/><span className="text-leaf-700">{page}</span></div>
        <h2 className="mt-2 font-display text-2xl font-extrabold text-leaf-900">{page}</h2>
        <p className="mt-1 text-sm text-stone-500">{cfg.sub}</p>
      </div>
      <div className="flex gap-2 print:hidden">
        <Button variant="outline" icon={Download} onClick={() => alert('Demo: ekspor laporan akan diaktifkan setelah integrasi backend.')}>Ekspor</Button>
        {!readOnly && <Button icon={Plus} onClick={() => setShowModal(true)}>Tambah Data</Button>}
      </div>
    </div>

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cfg.stats.map(([label, value, tone]) => <div key={label} className="rounded-2xl border border-[#e0e9de] bg-white p-4 shadow-soft">
        <p className="text-xs text-stone-500">{label}</p>
        <p className="mt-2 font-display text-2xl font-extrabold text-leaf-900">{value}</p>
        <div className="mt-2"><Badge tone={tone}>Data demo</Badge></div>
      </div>)}
    </div>

    <section className="overflow-hidden rounded-2xl border border-[#e0e9de] bg-white shadow-soft">
      <div className="flex flex-wrap items-center gap-2.5 border-b border-stone-100 p-4">
        <SearchInput value={search} onChange={setSearch} placeholder={`Cari ${page.toLowerCase()}...`}/>
        {cfg.filterOptions.length > 1 && <FilterSelect icon={Users} label="Filter" value={filter} onChange={setFilter} options={cfg.filterOptions}/>}
        {(search || filter !== 'Semua') && <Button variant="ghost" onClick={() => { setSearch(''); setFilter('Semua') }}>Reset filter</Button>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="bg-leaf-50/70">
            <tr>{cfg.cols.map((col) => <th key={col} className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-stone-400">{col}</th>)}</tr>
          </thead>
          <tbody>
            {filteredRows.map((row, index) => <tr key={`${page}-${row[0]}-${index}`} className="border-t border-stone-100 transition hover:bg-leaf-50/40">
              {row.map((cell, cellIndex) => <td key={cellIndex} className="px-5 py-4 text-xs text-stone-600">{cellIndex === 0 ? <span className="font-extrabold text-leaf-900">{cell}</span> : renderCell(cell, cellIndex)}</td>)}
            </tr>)}
          </tbody>
        </table>
      </div>
      {filteredRows.length === 0 && <EmptyState title="Data tidak ditemukan" desc="Coba ubah kata kunci pencarian atau filter yang aktif."/>}
      <div className="border-t border-stone-100 px-5 py-3 text-[11px] text-stone-400">Menampilkan {filteredRows.length} dari {cfg.rows.length} data · Modul pratinjau, backend belum terhubung</div>
    </section>

    {showModal && <Modal
      title={`Tambah ${page}`}
      subtitle="Ini pratinjau alur form. Skema lengkap mengikuti backend saat modul diaktifkan."
      icon={Icon}
      onClose={() => setShowModal(false)}
      footer={<>
        <Button variant="outline" onClick={() => setShowModal(false)}>Batal</Button>
        <Button onClick={() => { setShowModal(false); alert('Form CRUD lengkap akan diimplementasikan bertahap.') }}>Lanjutkan</Button>
      </>}
    >
      <div className="mt-5 rounded-xl border border-dashed border-leaf-200 bg-leaf-50 p-4 text-xs leading-5 text-stone-600">
        <p className="font-bold text-leaf-800">Field yang akan disiapkan</p>
        <p className="mt-2">Identitas data · kategori · cabang/asrama terkait · status · catatan tambahan</p>
      </div>
      <p className="mt-3 text-[10px] text-stone-400">Role aktif: {role}. Simulasi UI, bukan batas otorisasi produksi.</p>
    </Modal>}
  </div>
}
