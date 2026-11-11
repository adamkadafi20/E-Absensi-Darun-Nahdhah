// Modul Tahfidz: Super Admin mengelola jadwal & pembagian santri,
// Admin/Muhafidz/Muhafidzah hanya melihat santri yang ditugaskan kepadanya.
import { useMemo, useState } from 'react'
import {
  ArrowRight, BookOpen, Building2, CalendarDays, ChevronRight, Clock3, Eye,
  History, House, NotebookPen, Pencil, Plus, ShieldCheck, Trash2, UserRound,
  Users,
} from 'lucide-react'
import {
  Avatar, Badge, Button, EmptyState, FilterDate, FilterSelect, Modal,
  SearchInput, Toast, formatDateID,
} from '../ui'
import {
  MUHAFIDZ_ACCOUNTS, getMuhafidz, getTahfidzAccount, surahLabel,
} from '../data/tahfidz'
import JadwalForm from './JadwalForm'
import SetoranForm from './SetoranForm'

const shortDate = (dateKey) => formatDateID(dateKey, { day: 'numeric', month: 'short', year: 'numeric' })
const penilaianTone = (p) => p === 'Lancar' ? 'green' : p === 'Kurang Lancar' ? 'amber' : 'red'
const kategoriTone = (k) => k === 'Ziyadah' ? 'green' : 'brown'

function MiniStat({ label, value, note }) {
  return <div className="rounded-2xl border border-[#eee5da] bg-white p-4 shadow-soft">
    <p className="text-xs text-stone-500">{label}</p>
    <p className="mt-2 font-display text-2xl font-extrabold text-latte-900">{value}</p>
    {note && <p className="mt-1 text-[10px] text-stone-400">{note}</p>}
  </div>
}

export default function TahfidzPage(props) {
  const [toast, setToast] = useState(null)
  const notify = (message, tone = 'success') => setToast({ message, tone, at: Date.now() })
  const account = getTahfidzAccount(props.role)
  const body = !account
    ? <EmptyState title="Akses terbatas" desc="Modul Tahfidz hanya dapat diakses oleh Super Admin dan Muhafidz/Muhafidzah yang mendapat penugasan." />
    : props.role === 'Super Admin'
      ? <JadwalTahfidzPage {...props} notify={notify} />
      : <MuhafidzPage {...props} account={account} notify={notify} />
  return <>{body}<Toast toast={toast} onClose={() => setToast(null)} /></>
}

/* ================= SUPER ADMIN: MANAJEMEN JADWAL ================= */

function JadwalTahfidzPage({ santri, jadwal, setJadwal, setoran, genderFilter, setGenderFilter, notify }) {
  const [query, setQuery] = useState('')
  const [fMuhafidz, setFMuhafidz] = useState('Semua')
  const [fBranch, setFBranch] = useState('Semua')
  const [fDorm, setFDorm] = useState('Semua')
  const [fDate, setFDate] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [detail, setDetail] = useState(null)

  const getSantri = (nis) => santri.find((s) => s.nis === nis)
  const santriOf = (j) => (j.santriNis || []).map(getSantri).filter(Boolean)
  const branches = useMemo(() => [...new Set(jadwal.map((j) => j.branch))], [jadwal])
  const dorms = useMemo(() => [...new Set(jadwal.filter((j) => fBranch === 'Semua' || j.branch === fBranch).flatMap((j) => [j.dorm, ...santriOf(j).map((s) => s.dorm)]))], [jadwal, fBranch, santri])

  const rows = jadwal.filter((j) => {
    const pengajar = getMuhafidz(j.muhafidzId)
    const santriIn = santriOf(j)
    const matchesQuery = !query || `${pengajar?.name || ''} ${j.branch} ${j.dorm} ${santriIn.map((s) => `${s.name} ${s.nis}`).join(' ')}`.toLowerCase().includes(query.toLowerCase())
    const matchesMuhafidz = fMuhafidz === 'Semua' || j.muhafidzId === fMuhafidz
    const matchesBranch = fBranch === 'Semua' || j.branch === fBranch
    const matchesDorm = fDorm === 'Semua' || j.dorm === fDorm || santriIn.some((s) => s.dorm === fDorm)
    const matchesDate = !fDate || j.date === fDate
    const matchesGender = genderFilter === 'Semua' || santriIn.some((s) => s.gender === genderFilter)
    return matchesQuery && matchesMuhafidz && matchesBranch && matchesDorm && matchesDate && matchesGender
  }).sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`))

  const saveJadwal = (data) => {
    if (editing) {
      setJadwal((current) => current.map((j) => j.id === editing.id ? { ...j, ...data } : j))
      notify('Jadwal setoran berhasil diperbarui.')
    } else {
      setJadwal((current) => [...current, { ...data, id: `tfj-${Date.now()}` }])
      notify('Jadwal setoran baru berhasil dibuat.')
    }
    setShowForm(false)
    setEditing(null)
  }

  const deleteJadwal = (j) => {
    const pengajar = getMuhafidz(j.muhafidzId)
    if (window.confirm(`Hapus jadwal ${pengajar?.name || ''} pada ${shortDate(j.date)} pukul ${j.startTime}–${j.endTime}? Riwayat setoran yang sudah tercatat tetap tersimpan.`)) {
      setJadwal((current) => current.filter((item) => item.id !== j.id))
      setDetail(null)
      notify('Jadwal dihapus. Riwayat setoran yang pernah dicatat tetap tersimpan.', 'info')
    }
  }

  const uniqueAssigned = new Set(jadwal.flatMap((j) => j.santriNis)).size

  return <div className="space-y-5">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="flex items-center gap-2 text-xs text-stone-400"><span>Workspace</span><ChevronRight size={12}/><span className="text-latte-700">Tahfidz</span></div>
        <h2 className="mt-2 font-display text-2xl font-extrabold text-latte-900">Tahfidz — Manajemen Jadwal</h2>
        <p className="mt-1 text-sm text-stone-500">Atur jadwal setoran, pilih Muhafidz/Muhafidzah penerima, dan bagi santri yang menjadi tanggung jawabnya.</p>
        <div className="mt-2"><Badge tone={genderFilter === 'Ikhwan' ? 'brown' : genderFilter === 'Akhwat' ? 'blue' : 'neutral'}>Tampilan: {genderFilter === 'Semua' ? 'Semua santri' : genderFilter}</Badge></div>
      </div>
      <Button icon={Plus} onClick={() => { setEditing(null); setShowForm(true) }}>Tambah Jadwal</Button>
    </div>

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <MiniStat label="Total jadwal" value={jadwal.length} note="Seluruh cabang" />
      <MiniStat label="Muhafidz/Muhafidzah" value={MUHAFIDZ_ACCOUNTS.length} note="Akun pengajar terdaftar" />
      <MiniStat label="Santri terpenugaskan" value={uniqueAssigned} note="Unik per santri" />
      <MiniStat label="Setoran tercatat" value={setoran.length} note="Seluruh riwayat" />
    </div>

    <section className="rounded-2xl border border-[#eee5da] bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-latte-100 text-latte-700"><Users size={17}/></div>
          <div>
            <h3 className="font-display text-base font-extrabold text-latte-900">Pembagian santri per pengajar</h3>
            <p className="mt-1 text-xs text-stone-500">Klik kartu untuk menyaring tabel jadwal. Hanya Super Admin yang dapat mengubah penugasan.</p>
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {MUHAFIDZ_ACCOUNTS.map((m) => {
          const mine = jadwal.filter((j) => j.muhafidzId === m.id)
          const assigned = new Set(mine.flatMap((j) => j.santriNis))
          const recorded = setoran.filter((s) => s.muhafidzId === m.id).length
          const selected = fMuhafidz === m.id
          return <button key={m.id} onClick={() => setFMuhafidz(selected ? 'Semua' : m.id)} className={`rounded-2xl border p-4 text-left transition ${selected ? 'border-latte-400 bg-latte-50 ring-2 ring-latte-100' : 'border-[#eee5da] bg-white hover:border-latte-300'}`}>
            <div className="flex items-center gap-3">
              <Avatar name={m.name} tone={m.role === 'Muhafidzah' ? 'rose' : 'green'} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-extrabold text-latte-900">{m.name}</p>
                <p className="mt-0.5 text-[10px] text-stone-400">{m.role} · {m.branch}</p>
              </div>
              {selected && <Badge tone="brown">Difilter</Badge>}
            </div>
            <div className="mt-3 flex gap-4 border-t border-stone-100 pt-3 text-[10px] font-semibold text-stone-500">
              <span><strong className="text-latte-900">{mine.length}</strong> jadwal</span>
              <span><strong className="text-latte-900">{assigned.size}</strong> santri</span>
              <span><strong className="text-latte-900">{recorded}</strong> setoran</span>
            </div>
          </button>
        })}
      </div>
    </section>

    <section className="overflow-hidden rounded-2xl border border-[#eee5da] bg-white shadow-soft">
      <div className="flex flex-wrap items-center gap-3 border-b border-stone-100 p-4">
        <SearchInput value={query} onChange={setQuery} placeholder="Cari pengajar, santri, atau NIS..." />
        <FilterSelect icon={UserRound} label="Pengajar" value={fMuhafidz} onChange={(v) => setFMuhafidz(v)} options={[{ value: 'Semua', label: 'Semua pengajar' }, ...MUHAFIDZ_ACCOUNTS.map((m) => ({ value: m.id, label: m.name }))]} />
        <FilterSelect icon={Building2} label="Cabang" value={fBranch} onChange={(v) => { setFBranch(v); setFDorm('Semua') }} options={['Semua', ...branches]} />
        <FilterSelect icon={House} label="Asrama" value={fDorm} onChange={setFDorm} options={['Semua', ...dorms]} />
        <FilterDate value={fDate} onChange={setFDate} />
        {(fMuhafidz !== 'Semua' || fBranch !== 'Semua' || fDorm !== 'Semua' || fDate) && <Button variant="ghost" onClick={() => { setFMuhafidz('Semua'); setFBranch('Semua'); setFDorm('Semua'); setFDate('') }}>Reset filter</Button>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left">
          <thead className="bg-latte-50/70">
            <tr className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              <th className="px-5 py-3">No.</th>
              <th className="px-4 py-3">Muhafidz/Muhafidzah</th>
              <th className="px-4 py-3">Cabang</th>
              <th className="px-4 py-3">Asrama</th>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Waktu</th>
              <th className="px-4 py-3">Santri</th>
              <th className="px-4 py-3">Daftar santri</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((j, i) => {
              const pengajar = getMuhafidz(j.muhafidzId)
              const santriIn = santriOf(j)
              const fullNames = santriIn.map((s) => `${s.name} (${s.nis})`).join(', ') || (j.santriNis.join(', ') || '-')
              return <tr key={j.id} className="border-t border-stone-100 transition hover:bg-latte-50/40">
                <td className="px-5 py-4 text-xs font-semibold text-stone-400">{i + 1}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={pengajar?.name || '?'} tone={pengajar?.role === 'Muhafidzah' ? 'rose' : 'green'} size="sm" />
                    <div>
                      <p className="text-xs font-extrabold text-latte-900">{pengajar?.name || 'Akun dihapus'}</p>
                      <p className="mt-0.5 text-[10px] text-stone-400">{pengajar?.role}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-xs font-semibold text-stone-600">{j.branch}</td>
                <td className="px-4 py-4 text-xs text-stone-600">{j.dorm}</td>
                <td className="px-4 py-4"><p className="text-xs font-semibold text-stone-700">{shortDate(j.date)}</p></td>
                <td className="px-4 py-4"><p className="flex items-center gap-1 text-xs font-semibold text-stone-700"><Clock3 size={12} className="text-latte-500"/>{j.startTime}–{j.endTime}</p></td>
                <td className="px-4 py-4"><Badge tone="brown">{j.santriNis.length} santri</Badge></td>
                <td className="px-4 py-4">
                  <div className="flex max-w-[230px] flex-wrap gap-1" title={fullNames}>
                    {santriIn.slice(0, 2).map((s) => <span key={s.nis} className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${s.gender === 'Ikhwan' ? 'bg-latte-100 text-latte-700' : 'bg-sky-50 text-sky-700'}`}>{s.name}</span>)}
                    {santriIn.length > 2 && <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-500">+{santriIn.length - 2}</span>}
                    {santriIn.length === 0 && <span className="text-[10px] text-stone-400">{j.santriNis.join(', ') || '-'}</span>}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-1">
                    <button title="Detail jadwal" onClick={() => setDetail(j)} className="rounded-lg p-2 text-stone-400 hover:bg-latte-100 hover:text-latte-700"><Eye size={15}/></button>
                    <button title="Edit jadwal" onClick={() => { setEditing(j); setShowForm(true) }} className="rounded-lg p-2 text-stone-400 hover:bg-latte-100 hover:text-latte-700"><Pencil size={15}/></button>
                    <button title="Hapus jadwal" onClick={() => deleteJadwal(j)} className="rounded-lg p-2 text-stone-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={15}/></button>
                  </div>
                </td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && <EmptyState title="Jadwal tidak ditemukan" desc="Coba ubah pencarian atau filter pengajar, cabang, asrama, tanggal, dan kategori santri."/>}
      <div className="border-t border-stone-100 px-5 py-3 text-[11px] text-stone-400">Menampilkan {rows.length} dari {jadwal.length} jadwal · Jadwal & pembagian santri dikendalikan Super Admin</div>
    </section>

    {showForm && <JadwalForm editing={editing} jadwalList={jadwal} santri={santri} onClose={() => { setShowForm(false); setEditing(null) }} onSave={saveJadwal} />}

    {detail && <Modal
      title="Detail Jadwal Setoran"
      subtitle={`${getMuhafidz(detail.muhafidzId)?.name || '-'} · ${getMuhafidz(detail.muhafidzId)?.role || '-'}`}
      icon={CalendarDays}
      size="lg"
      onClose={() => setDetail(null)}
      footer={<>
        <Button variant="outline" onClick={() => setDetail(null)}>Tutup</Button>
        <Button icon={Pencil} onClick={() => { setEditing(detail); setShowForm(true); setDetail(null) }}>Edit Jadwal</Button>
      </>}
    >
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {[['Cabang', detail.branch], ['Asrama', detail.dorm], ['Tanggal', shortDate(detail.date)], ['Waktu', `${detail.startTime}–${detail.endTime} WIB`]].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-stone-100 bg-latte-50/60 px-3.5 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">{label}</p>
            <p className="mt-1 text-xs font-extrabold text-latte-900">{value}</p>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs font-bold text-stone-600">Santri yang ditugaskan ({detail.santriNis.length})</p>
      <div className="mt-2 overflow-x-auto rounded-xl border border-stone-100">
        <table className="w-full min-w-[420px] text-left">
          <thead className="bg-latte-50/70"><tr className="text-[10px] font-bold uppercase tracking-wider text-stone-400"><th className="px-4 py-2.5">NIS</th><th className="px-4 py-2.5">Nama</th><th className="px-4 py-2.5">Kategori</th><th className="px-4 py-2.5">Asrama</th><th className="px-4 py-2.5">Setoran jadwal ini</th></tr></thead>
          <tbody>
            {detail.santriNis.map((nis) => {
              const s = getSantri(nis)
              const count = setoran.filter((item) => item.jadwalId === detail.id && item.santriNis === nis).length
              return <tr key={nis} className="border-t border-stone-50">
                <td className="px-4 py-2.5 text-xs font-semibold text-stone-500">{nis}</td>
                <td className="px-4 py-2.5 text-xs font-bold text-latte-900">{s?.name || 'Santri terhapus'}</td>
                <td className="px-4 py-2.5">{s ? <Badge tone={s.gender === 'Ikhwan' ? 'brown' : 'blue'}>{s.gender}</Badge> : '-'}</td>
                <td className="px-4 py-2.5 text-xs text-stone-600">{s?.dorm || '-'}</td>
                <td className="px-4 py-2.5">{count > 0 ? <Badge tone="green">Sudah {count}×</Badge> : <Badge tone="amber">Belum</Badge>}</td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
    </Modal>}
  </div>
}

/* ================= ADMIN / MUHAFIDZ / MUHAFIDZAH: SETORAN ================= */

function MuhafidzPage({ account, santri, jadwal, setSetoran, setoran, genderFilter, setGenderFilter, notify, onOpenRiwayat }) {
  const [selectedId, setSelectedId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formSantriNis, setFormSantriNis] = useState(null)
  const [riwayatSantri, setRiwayatSantri] = useState(null)

  // Admin hanya melihat jadwal miliknya — penugasan ditentukan Super Admin.
  const myJadwal = useMemo(() => jadwal.filter((j) => j.muhafidzId === account.id)
    .sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`)), [jadwal, account])
  const active = myJadwal.find((j) => j.id === selectedId) || myJadwal[0]
  const activeSantri = useMemo(() => (active?.santriNis || []).map((nis) => santri.find((s) => s.nis === nis)).filter(Boolean), [active, santri])
  const visibleSantri = genderFilter === 'Semua' ? activeSantri : activeSantri.filter((s) => s.gender === genderFilter)
  const setoranCount = (nis) => setoran.filter((s) => s.jadwalId === active?.id && s.santriNis === nis).length
  const recorded = activeSantri.filter((s) => setoranCount(s.nis) > 0).length
  const riwayatSantriList = (nis) => setoran.filter((s) => s.santriNis === nis && s.muhafidzId === account.id).sort((a, b) => `${b.tanggal} ${b.waktu}`.localeCompare(`${a.tanggal} ${a.waktu}`))

  const submitSetoran = (data) => {
    const s = santri.find((x) => x.nis === data.santriNis)
    setSetoran((current) => [...current, { ...data, id: `tfs-${Date.now()}`, muhafidzId: account.id }])
    setShowForm(false)
    setFormSantriNis(null)
    notify(`Setoran ${s?.name || data.santriNis} berhasil dicatat pada riwayat.`)
  }

  if (!active) return <div className="space-y-5">
    <div>
      <div className="flex items-center gap-2 text-xs text-stone-400"><span>Workspace</span><ChevronRight size={12}/><span className="text-latte-700">Tahfidz</span></div>
      <h2 className="mt-2 font-display text-2xl font-extrabold text-latte-900">Tahfidz</h2>
      <p className="mt-1 text-sm text-stone-500">Daftar santri setoran dan pencatatan hafalan.</p>
    </div>
    <section className="rounded-2xl border border-[#eee5da] bg-white shadow-soft">
      <EmptyState title="Belum ada jadwal penugasan" desc={`Super Admin belum membuat jadwal setoran untuk ${account.name}. Anda tidak dapat memilih santri sendiri; hubungi Super Admin untuk pembagian santri.`}/>
    </section>
  </div>

  return <div className="space-y-5">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="flex items-center gap-2 text-xs text-stone-400"><span>Workspace</span><ChevronRight size={12}/><span className="text-latte-700">Tahfidz</span></div>
        <h2 className="mt-2 font-display text-2xl font-extrabold text-latte-900">Tahfidz — Setoran Harian</h2>
        <p className="mt-1 text-sm text-stone-500">Terima dan catat setoran santri yang ditugaskan Super Admin kepada Anda.</p>
        <div className="mt-2"><Badge tone={genderFilter === 'Ikhwan' ? 'brown' : genderFilter === 'Akhwat' ? 'blue' : 'neutral'}>Tampilan: {genderFilter === 'Semua' ? 'Semua santri' : genderFilter}</Badge></div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" icon={History} onClick={() => onOpenRiwayat?.()}>Riwayat Setoran</Button>
        <Button icon={NotebookPen} onClick={() => { setFormSantriNis(null); setShowForm(true) }}>Catat Setoran</Button>
      </div>
    </div>

    <section className="rounded-2xl border border-[#eee5da] bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-center gap-4">
        <Avatar name={account.name} tone="green" size="lg" />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Muhafidz/Muhafidzah yang sedang login</p>
          <p className="mt-1 font-display text-lg font-extrabold text-latte-900">{account.name}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge tone="brown"><ShieldCheck size={12}/> {account.role}</Badge>
            <Badge tone="neutral"><Building2 size={12}/> {account.branch}</Badge>
          </div>
        </div>
        <p className="max-w-xs rounded-xl bg-latte-50 px-3.5 py-3 text-[11px] leading-5 text-stone-500">
          Daftar santri di bawah sepenuhnya ditentukan Super Admin. Anda tidak dapat mengubah jadwal atau memindahkan penugasan santri. <span className="text-stone-400">(Demo: akun Admin Cabang diikat ke akun {account.name}.)</span>
        </p>
      </div>
    </section>

    <div>
      <p className="mb-2 flex items-center gap-2 text-xs font-bold text-stone-500"><CalendarDays size={14} className="text-latte-500"/> Jadwal penugasan Anda ({myJadwal.length})</p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {myJadwal.map((j) => {
          const isSelected = j.id === active.id
          return <button key={j.id} onClick={() => setSelectedId(j.id)} className={`shrink-0 rounded-xl border px-3.5 py-2.5 text-left transition ${isSelected ? 'border-latte-700 bg-latte-700 text-white shadow-sm' : 'border-latte-200 bg-white text-stone-600 hover:bg-latte-50'}`}>
            <p className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-latte-100' : 'text-stone-400'}`}>{shortDate(j.date)}</p>
            <p className="mt-1 text-xs font-extrabold">{j.startTime}–{j.endTime} WIB</p>
            <p className={`mt-0.5 text-[10px] font-semibold ${isSelected ? 'text-latte-100/80' : 'text-stone-400'}`}>{j.santriNis.length} santri · {j.dorm === 'Semua Asrama' ? 'Semua asrama' : j.dorm}</p>
          </button>
        })}
      </div>
    </div>

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <MiniStat label="Jadwal ditugaskan" value={myJadwal.length} note="Dari Super Admin" />
      <MiniStat label="Santri dalam jadwal" value={activeSantri.length} note={shortDate(active.date)} />
      <MiniStat label="Sudah setoran" value={recorded} note={`${setoran.filter((s) => s.jadwalId === active.id).length} catatan pada jadwal ini`} />
      <MiniStat label="Belum setoran" value={activeSantri.length - recorded} note="Menunggu setoran" />
    </div>

    <section className="overflow-hidden rounded-2xl border border-[#eee5da] bg-white shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 p-4">
        <div className="flex items-center gap-2 text-xs text-stone-500"><BookOpen size={14} className="text-latte-500"/>Santri pada jadwal: <strong className="text-latte-800">{shortDate(active.date)} · {active.startTime}–{active.endTime} WIB · {active.branch}</strong></div>
        <Badge tone={recorded === activeSantri.length && activeSantri.length > 0 ? 'green' : 'amber'}>Pencatatan: {recorded}/{activeSantri.length} santri</Badge>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left">
          <thead className="bg-latte-50/70">
            <tr className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              <th className="px-5 py-3">No.</th>
              <th className="px-4 py-3">NIS</th>
              <th className="px-4 py-3">Nama Santri</th>
              <th className="px-4 py-3">Ikhwan/Akhwat</th>
              <th className="px-4 py-3">Cabang</th>
              <th className="px-4 py-3">Asrama</th>
              <th className="px-4 py-3">Jadwal Setoran</th>
              <th className="px-4 py-3">Status Setoran</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {visibleSantri.map((s, i) => {
              const count = setoranCount(s.nis)
              return <tr key={s.nis} className="border-t border-stone-100 transition hover:bg-latte-50/40">
                <td className="px-5 py-4 text-xs font-semibold text-stone-400">{i + 1}</td>
                <td className="px-4 py-4 text-xs font-semibold text-stone-500">{s.nis}</td>
                <td className="px-4 py-4"><div className="flex items-center gap-2.5"><Avatar name={s.name} size="sm" tone={s.gender === 'Ikhwan' ? 'brown' : 'blue'}/><p className="text-xs font-extrabold text-latte-900">{s.name}</p></div></td>
                <td className="px-4 py-4"><Badge tone={s.gender === 'Ikhwan' ? 'brown' : 'blue'}>{s.gender}</Badge></td>
                <td className="px-4 py-4 text-xs text-stone-600">{s.branch}</td>
                <td className="px-4 py-4 text-xs text-stone-600">{s.dorm}</td>
                <td className="px-4 py-4"><p className="text-xs font-semibold text-stone-700">{shortDate(active.date)}</p><p className="mt-0.5 flex items-center gap-1 text-[10px] text-stone-400"><Clock3 size={11}/>{active.startTime}–{active.endTime} WIB</p></td>
                <td className="px-4 py-4">{count > 0 ? <Badge tone="green">Sudah setoran {count}×</Badge> : <Badge tone="amber">Belum setoran</Badge>}</td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-1.5">
                    <button onClick={() => { setFormSantriNis(s.nis); setShowForm(true) }} className="inline-flex items-center gap-1.5 rounded-lg bg-latte-700 px-2.5 py-1.5 text-[11px] font-bold text-white transition hover:bg-latte-800"><NotebookPen size={13}/> Input Setoran</button>
                    <button onClick={() => setRiwayatSantri(s)} className="inline-flex items-center gap-1.5 rounded-lg border border-latte-200 px-2.5 py-1.5 text-[11px] font-bold text-latte-700 transition hover:bg-latte-50"><History size={13}/> Riwayat</button>
                  </div>
                </td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
      {visibleSantri.length === 0 && <EmptyState title="Tidak ada santri pada tampilan ini" desc={genderFilter === 'Semua' ? 'Jadwal ini belum memiliki santri terpilih.' : `Tidak ada santri ${genderFilter} pada jadwal ini.`}/>}
      <div className="border-t border-stone-100 px-5 py-3 text-[11px] text-stone-400">Menampilkan {visibleSantri.length} dari {activeSantri.length} santri pada jadwal terpilih · Data penugasan dari Super Admin</div>
    </section>

    {showForm && <SetoranForm jadwal={active} santriList={activeSantri} preselectedNis={formSantriNis} onClose={() => { setShowForm(false); setFormSantriNis(null) }} onSubmit={submitSetoran} />}

    {riwayatSantri && <Modal
      title={`Riwayat Setoran — ${riwayatSantri.name}`}
      subtitle={`${riwayatSantri.nis} · ${riwayatSantri.gender} · hanya setoran yang dicatat oleh Anda`}
      icon={History}
      size="lg"
      onClose={() => setRiwayatSantri(null)}
      footer={<>
        <Button variant="outline" onClick={() => setRiwayatSantri(null)}>Tutup</Button>
        <Button icon={ArrowRight} onClick={() => { const nis = riwayatSantri.nis; setRiwayatSantri(null); onOpenRiwayat?.(nis) }}>Buka Halaman Riwayat</Button>
      </>}
    >
      <div className="mt-5 space-y-3">
        {riwayatSantriList(riwayatSantri.nis).length === 0 && <EmptyState title="Belum ada riwayat setoran" desc="Santri ini belum memiliki setoran yang dicatat oleh Anda."/>}
        {riwayatSantriList(riwayatSantri.nis).map((item) => (
          <div key={item.id} className="rounded-2xl border border-stone-100 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs font-extrabold text-latte-900">{shortDate(item.tanggal)} · {item.waktu} WIB</p>
                <p className="mt-1 text-[10px] text-stone-400">{item.keterangan}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Badge tone={kategoriTone(item.kategori)}>{item.kategori}</Badge>
                <Badge tone={penilaianTone(item.penilaian)}>{item.penilaian}</Badge>
              </div>
            </div>
            <div className="mt-3 grid gap-2 text-xs text-stone-600 sm:grid-cols-2">
              <p><strong className="text-latte-800">{item.halaman}</strong> halaman · Juz <strong className="text-latte-800">{item.juz}</strong></p>
              <p>Surat <strong className="text-latte-800">{surahLabel(item.surah)}</strong> · hal. {item.noHalaman}–{item.noHalaman + item.halaman - 1}</p>
            </div>
            {item.catatan && <p className="mt-2 border-t border-stone-100 pt-2 text-[11px] leading-5 text-stone-500">{item.catatan}</p>}
          </div>
        ))}
      </div>
    </Modal>}
  </div>
}
