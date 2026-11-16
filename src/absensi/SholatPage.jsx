// Halaman Absensi Sholat (v0.3): filter kategori, cabang→asrama, rentang
// tanggal, jenis sholat, status, dan pencarian. Statistik dihitung dari hasil filter.
import { useEffect, useMemo, useState } from 'react'
import {
  Building2, CalendarCheck, ChevronRight, ClipboardCheck, Clock3, House, Pencil,
  Plus, UserRound,
} from 'lucide-react'
import {
  Avatar, Badge, Button, EmptyState, Field, FilterDateRange, FilterSelect,
  GenderGate, Modal, Pagination, SearchInput, formatDateID, inputClass, toDateKey,
} from '../ui'
import { ABSENSI_STATUS, SHOLAT_LIST, dormsOfBranch } from '../data/master'

const PAGE_SIZE = 10
const statusTone = (status) => status === 'Hadir' ? 'green' : status === 'Izin' ? 'amber' : status === 'Sakit' ? 'blue' : status === 'Terlambat' ? 'amber' : 'red'
const todayValue = () => toDateKey()

export default function SholatPage({ santri, records, setRecords, role, genderFilter, setGenderFilter, notify }) {
  const [fBranch, setFBranch] = useState('Semua')
  const [fDorm, setFDorm] = useState('Semua')
  const [fFrom, setFFrom] = useState('')
  const [fTo, setFTo] = useState('')
  const [fSholat, setFSholat] = useState('Semua')
  const [fStatus, setFStatus] = useState('Semua')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ nis: '', date: todayValue(), sholat: SHOLAT_LIST[0], status: 'Hadir' })
  const [errors, setErrors] = useState({})

  const santriMap = useMemo(() => new Map(santri.map((item) => [item.nis, item])), [santri])
  const genderSantri = useMemo(() => santri.filter((item) => item.gender === genderFilter), [santri, genderFilter])
  const branches = useMemo(() => [...new Set(genderSantri.map((item) => item.branch))], [genderSantri])
  const dormOptions = fBranch === 'Semua'
    ? [...new Set(genderSantri.map((item) => item.dorm))]
    : dormsOfBranch(fBranch).filter((dorm) => dorm.gender === genderFilter).map((dorm) => dorm.name)

  const allowedNis = useMemo(() => new Set(genderSantri.filter((item) => {
    const matchesBranch = fBranch === 'Semua' || item.branch === fBranch
    const matchesDorm = fDorm === 'Semua' || item.dorm === fDorm
    const matchesQuery = !query || `${item.name} ${item.nis}`.toLowerCase().includes(query.toLowerCase())
    return matchesBranch && matchesDorm && matchesQuery
  }).map((item) => item.nis)), [genderSantri, fBranch, fDorm, query])

  const rows = useMemo(() => records.filter((record) => {
    if (!allowedNis.has(record.nis)) return false
    if (fFrom && record.date < fFrom) return false
    if (fTo && record.date > fTo) return false
    if (fSholat !== 'Semua' && record.sholat !== fSholat) return false
    if (fStatus !== 'Semua' && record.status !== fStatus) return false
    return true
  }).sort((a, b) => `${b.date}${b.sholat}${santriMap.get(a.nis)?.name || ''}`.localeCompare(`${a.date}${a.sholat}${santriMap.get(b.nis)?.name || ''}`)), [records, allowedNis, fFrom, fTo, fSholat, fStatus, santriMap])

  useEffect(() => { setPage(1) }, [genderFilter, fBranch, fDorm, fFrom, fTo, fSholat, fStatus, query])
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
    if (page > maxPage) setPage(maxPage)
  }, [rows.length, page])

  if (!genderFilter) {
    return <GenderGate
      title="Absensi Sholat"
      description="Catat dan pantau kehadiran sholat berjamaah. Pilih kategori santri terlebih dahulu."
      setGenderFilter={setGenderFilter}
    />
  }

  const countStatus = (status) => rows.filter((record) => record.status === status).length
  const hasFilter = fBranch !== 'Semua' || fDorm !== 'Semua' || fFrom || fTo || fSholat !== 'Semua' || fStatus !== 'Semua' || query
  const resetFilters = () => {
    setFBranch('Semua'); setFDorm('Semua'); setFFrom(''); setFTo(''); setFSholat('Semua'); setFStatus('Semua'); setQuery('')
  }
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const paged = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const openAdd = () => {
    setEditing(null)
    setErrors({})
    setForm({ nis: genderSantri[0]?.nis || '', date: todayValue(), sholat: SHOLAT_LIST[0], status: 'Hadir' })
    setFormOpen(true)
  }
  const openEdit = (record) => {
    setEditing(record)
    setErrors({})
    setForm({ nis: record.nis, date: record.date, sholat: record.sholat, status: record.status })
    setFormOpen(true)
  }

  const save = (event) => {
    event.preventDefault()
    const next = {}
    const selected = santriMap.get(form.nis)
    if (!selected || selected.gender !== genderFilter) next.nis = 'Pilih santri sesuai kategori aktif.'
    if (!form.date) next.date = 'Tanggal wajib diisi.'
    if (!form.sholat) next.sholat = 'Jenis sholat wajib dipilih.'
    if (!form.status) next.status = 'Status kehadiran wajib dipilih.'
    setErrors(next)
    if (Object.keys(next).length) return

    const id = `sh-${form.nis}-${form.date}-${form.sholat}`
    const duplicate = records.find((record) => record.id === id && record.id !== editing?.id)
    if (duplicate) {
      setErrors({ sholat: 'Absensi santri untuk tanggal dan jenis sholat ini sudah tercatat. Gunakan tombol edit pada tabel.' })
      return
    }

    if (editing) {
      setRecords((current) => current.map((record) => record.id === editing.id ? { ...record, ...form, id } : record))
      notify(`Absensi ${selected?.name} diperbarui menjadi ${form.status}.`)
    } else {
      setRecords((current) => [...current, { id, ...form }])
      notify(`Absensi ${selected?.name} (${form.sholat}) dicatat: ${form.status}.`)
    }
    setFormOpen(false)
    setEditing(null)
  }

  const formSantri = genderSantri.filter((item) => !form.branch || form.branch === 'Semua' || item.branch === form.branch)

  return <div className="space-y-5">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="flex items-center gap-2 text-xs text-stone-400"><span>Workspace</span><ChevronRight size={12}/><span className="text-leaf-700">Absensi Sholat</span></div>
        <h2 className="mt-2 font-display text-2xl font-extrabold text-leaf-900">Absensi Sholat</h2>
        <p className="mt-1 text-sm text-stone-500">Catat kehadiran sholat berjamaah per santri, tanggal, dan waktu sholat.</p>
        <div className="mt-2"><Badge tone={genderFilter === 'Ikhwan' ? 'leaf' : 'blue'}>Kategori aktif: {genderFilter}</Badge></div>
      </div>
      <Button icon={Plus} onClick={openAdd}>Catat Absensi</Button>
    </div>

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {[
        ['Hadir', countStatus('Hadir'), 'green'], ['Izin', countStatus('Izin'), 'amber'], ['Sakit', countStatus('Sakit'), 'blue'],
        ['Terlambat', countStatus('Terlambat'), 'amber'], ['Tidak Hadir', countStatus('Tidak Hadir'), 'red'],
      ].map(([label, value, tone]) => <div key={label} className="rounded-2xl border border-[#e0e9de] bg-white p-4 shadow-soft">
        <p className="text-xs text-stone-500">{label}</p>
        <p className="mt-2 font-display text-2xl font-extrabold text-leaf-900">{value}</p>
        <div className="mt-2"><Badge tone={tone}>Sesuai filter</Badge></div>
      </div>)}
    </div>

    <section className="overflow-hidden rounded-2xl border border-[#e0e9de] bg-white shadow-soft">
      <div className="flex flex-wrap items-center gap-2.5 border-b border-stone-100 p-4">
        <SearchInput value={query} onChange={setQuery} placeholder="Cari nama santri atau NIS..." />
        <FilterSelect icon={Building2} label="Cabang" value={fBranch} onChange={(value) => { setFBranch(value); setFDorm('Semua') }} options={['Semua', ...branches]}/>
        <FilterSelect icon={House} label="Asrama" value={fDorm} onChange={setFDorm} options={['Semua', ...dormOptions]}/>
        <FilterDateRange from={fFrom} to={fTo} onFrom={setFFrom} onTo={setFTo} label="Tanggal"/>
        <FilterSelect icon={Clock3} label="Sholat" value={fSholat} onChange={setFSholat} options={['Semua', ...SHOLAT_LIST]}/>
        <FilterSelect icon={ClipboardCheck} label="Status" value={fStatus} onChange={setFStatus} options={['Semua', ...ABSENSI_STATUS]}/>
        {hasFilter && <Button variant="ghost" onClick={resetFilters}>Reset filter</Button>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left">
          <thead className="bg-leaf-50/70">
            <tr className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              <th className="px-5 py-3">Tanggal</th>
              <th className="px-4 py-3">NIS</th>
              <th className="px-4 py-3">Nama Santri</th>
              <th className="px-4 py-3">Jenis Kelamin</th>
              <th className="px-4 py-3">Cabang</th>
              <th className="px-4 py-3">Asrama</th>
              <th className="px-4 py-3">Sholat</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((record) => {
              const item = santriMap.get(record.nis)
              if (!item) return null
              return <tr key={record.id} className="border-t border-stone-100 transition hover:bg-leaf-50/40">
                <td className="px-5 py-4"><p className="text-xs font-semibold text-stone-700">{formatDateID(record.date, { day: 'numeric', month: 'short', year: 'numeric' })}</p></td>
                <td className="px-4 py-4 text-xs font-bold text-stone-500">{item.nis}</td>
                <td className="px-4 py-4"><div className="flex items-center gap-2.5"><Avatar name={item.name} tone={item.gender === 'Ikhwan' ? 'leaf' : 'blue'} size="sm"/><p className="text-xs font-extrabold text-leaf-900">{item.name}</p></div></td>
                <td className="px-4 py-4"><Badge tone={item.gender === 'Ikhwan' ? 'leaf' : 'blue'}>{item.gender}</Badge></td>
                <td className="px-4 py-4 text-xs text-stone-600">{item.branch}</td>
                <td className="px-4 py-4 text-xs text-stone-600">{item.dorm}</td>
                <td className="px-4 py-4"><Badge tone="neutral">{record.sholat}</Badge></td>
                <td className="px-4 py-4"><Badge tone={statusTone(record.status)}>{record.status}</Badge></td>
                <td className="px-4 py-4 text-right"><button title="Edit absensi" onClick={() => openEdit(record)} className="rounded-lg p-2 text-stone-400 hover:bg-leaf-100 hover:text-leaf-700"><Pencil size={15}/></button></td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && <EmptyState title="Absensi sholat tidak ditemukan" desc="Tidak ada catatan yang cocok. Ubah kategori, cabang, asrama, rentang tanggal, jenis sholat, status, atau kata kunci pencarian."/>}
      <div className="border-t border-stone-100 px-5 py-3 text-[11px] text-stone-400">Menampilkan {paged.length} dari {rows.length} catatan absensi · Statistik mengikuti hasil filter</div>
      <Pagination page={page} pageCount={pageCount} onChange={setPage}/>
    </section>

    {formOpen && <Modal
      title={editing ? 'Edit Absensi Sholat' : 'Catat Absensi Sholat'}
      subtitle={`Hanya santri ${genderFilter} yang dapat dicatat pada kategori ini.`}
      icon={CalendarCheck}
      onClose={() => { setFormOpen(false); setEditing(null) }}
      onSubmit={save}
      footer={<>
        <Button variant="outline" onClick={() => { setFormOpen(false); setEditing(null) }}>Batal</Button>
        <Button type="submit" icon={Plus}>{editing ? 'Simpan Perubahan' : 'Simpan Absensi'}</Button>
      </>}
    >
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Cabang (untuk menyaring pilihan)" className="sm:col-span-2">
          <select value={form.branch || 'Semua'} onChange={(event) => setForm({ ...form, branch: event.target.value, nis: '' })} className={inputClass}>
            <option value="Semua">Semua cabang {genderFilter}</option>
            {branches.map((branch) => <option key={branch} value={branch}>{branch}</option>)}
          </select>
        </Field>
        <Field label="Santri" required error={errors.nis} className="sm:col-span-2">
          <select value={form.nis} onChange={(event) => setForm({ ...form, nis: event.target.value })} className={`${inputClass} ${errors.nis ? 'border-rose-300' : ''}`}>
            <option value="">— Pilih santri —</option>
            {formSantri.map((item) => <option key={item.nis} value={item.nis}>{item.nis} · {item.name} · {item.dorm}</option>)}
          </select>
        </Field>
        <Field label="Tanggal" required error={errors.date}>
          <input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} className={`${inputClass} ${errors.date ? 'border-rose-300' : ''}`}/>
        </Field>
        <Field label="Jenis sholat" required error={errors.sholat}>
          <select value={form.sholat} onChange={(event) => setForm({ ...form, sholat: event.target.value })} className={`${inputClass} ${errors.sholat ? 'border-rose-300' : ''}`}>
            {SHOLAT_LIST.map((sholat) => <option key={sholat} value={sholat}>{sholat}</option>)}
          </select>
        </Field>
        <Field label="Status kehadiran" required className="sm:col-span-2">
          <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className={inputClass}>
            {ABSENSI_STATUS.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </Field>
      </div>
    </Modal>}
  </div>
}
