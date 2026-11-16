// Halaman Absensi Kegiatan (v0.3): filter kategori, cabang→asrama, rentang
// tanggal, daftar kegiatan dari master, status, dan pencarian.
import { useEffect, useMemo, useState } from 'react'
import {
  Building2, CalendarCheck, ChevronRight, ClipboardCheck, Clock3, House, Pencil,
  Plus, UserRound,
} from 'lucide-react'
import {
  Avatar, Badge, Button, EmptyState, Field, FilterDateRange, FilterSelect,
  GenderGate, Modal, Pagination, SearchInput, formatDateID, inputClass, toDateKey,
} from '../ui'
import { ABSENSI_STATUS, BRANCHES, dormsOfBranch } from '../data/master'

const PAGE_SIZE = 10
const statusTone = (status) => status === 'Hadir' ? 'green' : status === 'Izin' ? 'amber' : status === 'Sakit' ? 'blue' : status === 'Terlambat' ? 'amber' : 'red'

export default function KegiatanAbsensiPage({ santri, activities, participantCategories, records, setRecords, role, genderFilter, setGenderFilter, notify }) {
  const [fBranch, setFBranch] = useState('Semua')
  const [fDorm, setFDorm] = useState('Semua')
  const [fEvent, setFEvent] = useState('Semua')
  const [fFrom, setFFrom] = useState('')
  const [fTo, setFTo] = useState('')
  const [fStatus, setFStatus] = useState('Semua')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ eventId: '', nis: '', status: 'Hadir' })
  const [errors, setErrors] = useState({})

  const santriMap = useMemo(() => new Map(santri.map((item) => [item.nis, item])), [santri])
  const activityMap = useMemo(() => new Map(activities.map((item) => [item.id, item])), [activities])
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
    if (fEvent !== 'Semua' && record.eventId !== fEvent) return false
    if (fFrom && record.date < fFrom) return false
    if (fTo && record.date > fTo) return false
    if (fStatus !== 'Semua' && record.status !== fStatus) return false
    return true
  }).sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`)), [records, allowedNis, fEvent, fFrom, fTo, fStatus])

  useEffect(() => { setPage(1) }, [genderFilter, fBranch, fDorm, fEvent, fFrom, fTo, fStatus, query])
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
    if (page > maxPage) setPage(maxPage)
  }, [rows.length, page])

  if (!genderFilter) {
    return <GenderGate
      title="Absensi Kegiatan"
      description="Catat kehadiran santri pada agenda kegiatan. Pilih kategori santri terlebih dahulu."
      setGenderFilter={setGenderFilter}
    />
  }

  const countStatus = (status) => rows.filter((record) => record.status === status).length
  const hasFilter = fBranch !== 'Semua' || fDorm !== 'Semua' || fEvent !== 'Semua' || fFrom || fTo || fStatus !== 'Semua' || query
  const resetFilters = () => {
    setFBranch('Semua'); setFDorm('Semua'); setFEvent('Semua'); setFFrom(''); setFTo(''); setFStatus('Semua'); setQuery('')
  }
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const paged = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const eligibleFor = (activity) => {
    if (!activity) return []
    const category = participantCategories.find((item) => item.id === activity.participantCategoryId)
    return genderSantri.filter((item) => {
      if (category?.gender && item.gender !== category.gender) return false
      if (Array.isArray(activity.participantNis) && activity.participantNis.length > 0 && !activity.participantNis.includes(item.nis)) return false
      if (activity.branch && activity.branch !== 'Semua Cabang' && item.branch !== activity.branch) return false
      if (activity.dorm && activity.dorm !== 'Semua Asrama' && item.dorm !== activity.dorm) return false
      return true
    })
  }

  const openAdd = () => {
    setEditing(null)
    setErrors({})
    const firstEvent = activities[0]
    setForm({ eventId: firstEvent?.id || '', nis: '', status: 'Hadir' })
    setFormOpen(true)
  }
  const openEdit = (record) => {
    setEditing(record)
    setErrors({})
    setForm({ eventId: record.eventId || '', nis: record.nis, status: record.status })
    setFormOpen(true)
  }

  const save = (event) => {
    event.preventDefault()
    const next = {}
    const activity = activityMap.get(form.eventId)
    const selected = santriMap.get(form.nis)
    if (!activity) next.eventId = 'Kegiatan wajib dipilih.'
    if (!selected || selected.gender !== genderFilter) next.nis = 'Pilih santri sesuai kategori aktif.'
    else if (activity && !eligibleFor(activity).some((item) => item.nis === selected.nis)) next.nis = 'Santri tidak termasuk peserta kegiatan ini (kategori peserta/cabang/asrama).'
    setErrors(next)
    if (Object.keys(next).length) return

    const id = `kt-${activity.id}-${selected.nis}`
    const duplicate = records.find((record) => record.id === id && record.id !== editing?.id)
    if (duplicate) {
      setErrors({ nis: 'Absensi santri pada kegiatan ini sudah tercatat. Gunakan tombol edit pada tabel.' })
      return
    }

    const payload = {
      id,
      eventId: activity.id,
      nis: selected.nis,
      title: activity.title,
      date: activity.date,
      time: activity.time,
      status: form.status,
    }
    if (editing) {
      setRecords((current) => current.map((record) => record.id === editing.id ? payload : record))
      notify(`Absensi kegiatan ${selected.name} diperbarui menjadi ${form.status}.`)
    } else {
      setRecords((current) => [...current, payload])
      notify(`Absensi ${selected.name} pada ${activity.title} dicatat: ${form.status}.`)
    }
    setFormOpen(false)
    setEditing(null)
  }

  const selectedActivity = activityMap.get(form.eventId)
  const formSantri = eligibleFor(selectedActivity)

  return <div className="space-y-5">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="flex items-center gap-2 text-xs text-stone-400"><span>Workspace</span><ChevronRight size={12}/><span className="text-leaf-700">Absensi Kegiatan</span></div>
        <h2 className="mt-2 font-display text-2xl font-extrabold text-leaf-900">Absensi Kegiatan</h2>
        <p className="mt-1 text-sm text-stone-500">Catat kehadiran peserta pada agenda kegiatan yang tersimpan di master kegiatan.</p>
        <div className="mt-2"><Badge tone={genderFilter === 'Ikhwan' ? 'leaf' : 'blue'}>Kategori aktif: {genderFilter}</Badge></div>
      </div>
      <Button icon={Plus} onClick={openAdd} disabled={activities.length === 0}>Catat Absensi</Button>
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
        <FilterSelect icon={CalendarCheck} label="Kegiatan" value={fEvent} onChange={setFEvent} options={[{ value: 'Semua', label: 'Semua kegiatan' }, ...activities.map((item) => ({ value: item.id, label: `${item.title} · ${formatDateID(item.date, { day: 'numeric', month: 'short' })}` }))]}/>
        <FilterSelect icon={Building2} label="Cabang" value={fBranch} onChange={(value) => { setFBranch(value); setFDorm('Semua') }} options={['Semua', ...branches]}/>
        <FilterSelect icon={House} label="Asrama" value={fDorm} onChange={setFDorm} options={['Semua', ...dormOptions]}/>
        <FilterDateRange from={fFrom} to={fTo} onFrom={setFFrom} onTo={setFTo} label="Tanggal"/>
        <FilterSelect icon={ClipboardCheck} label="Status" value={fStatus} onChange={setFStatus} options={['Semua', ...ABSENSI_STATUS]}/>
        {hasFilter && <Button variant="ghost" onClick={resetFilters}>Reset filter</Button>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left">
          <thead className="bg-leaf-50/70">
            <tr className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              <th className="px-5 py-3">Tanggal</th>
              <th className="px-4 py-3">NIS</th>
              <th className="px-4 py-3">Nama Santri</th>
              <th className="px-4 py-3">Jenis Kelamin</th>
              <th className="px-4 py-3">Kegiatan</th>
              <th className="px-4 py-3">Cabang</th>
              <th className="px-4 py-3">Asrama</th>
              <th className="px-4 py-3">Waktu</th>
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
                <td className="px-4 py-4 text-xs font-semibold text-stone-700">{record.title || activityMap.get(record.eventId)?.title || 'Kegiatan dihapus'}</td>
                <td className="px-4 py-4 text-xs text-stone-600">{item.branch}</td>
                <td className="px-4 py-4 text-xs text-stone-600">{item.dorm}</td>
                <td className="px-4 py-4 text-xs text-stone-600">{record.time || '-'} WIB</td>
                <td className="px-4 py-4"><Badge tone={statusTone(record.status)}>{record.status}</Badge></td>
                <td className="px-4 py-4 text-right"><button title="Edit absensi" onClick={() => openEdit(record)} className="rounded-lg p-2 text-stone-400 hover:bg-leaf-100 hover:text-leaf-700"><Pencil size={15}/></button></td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && <EmptyState title="Absensi kegiatan tidak ditemukan" desc={activities.length === 0 ? 'Belum ada master kegiatan. Tambahkan kegiatan terlebih dahulu pada halaman Kegiatan.' : 'Tidak ada catatan yang cocok. Ubah kegiatan, kategori, cabang, asrama, rentang tanggal, status, atau pencarian.'}/>}
      <div className="border-t border-stone-100 px-5 py-3 text-[11px] text-stone-400">Menampilkan {paged.length} dari {rows.length} catatan · Daftar kegiatan mengikuti master kegiatan</div>
      <Pagination page={page} pageCount={pageCount} onChange={setPage}/>
    </section>

    {formOpen && <Modal
      title={editing ? 'Edit Absensi Kegiatan' : 'Catat Absensi Kegiatan'}
      subtitle={`Peserta mengikuti kategori peserta, cabang, dan asrama pada kegiatan. Kategori aktif: ${genderFilter}.`}
      icon={CalendarCheck}
      onClose={() => { setFormOpen(false); setEditing(null) }}
      onSubmit={save}
      footer={<>
        <Button variant="outline" onClick={() => { setFormOpen(false); setEditing(null) }}>Batal</Button>
        <Button type="submit" icon={Plus}>{editing ? 'Simpan Perubahan' : 'Simpan Absensi'}</Button>
      </>}
    >
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Kegiatan" required error={errors.eventId} className="sm:col-span-2">
          <select value={form.eventId} onChange={(event) => setForm({ ...form, eventId: event.target.value, nis: '' })} className={`${inputClass} ${errors.eventId ? 'border-rose-300' : ''}`}>
            <option value="">— Pilih kegiatan —</option>
            {activities.map((item) => <option key={item.id} value={item.id}>{item.title} · {formatDateID(item.date, { day: 'numeric', month: 'short', year: 'numeric' })} · {item.time} WIB</option>)}
          </select>
        </Field>
        <Field label="Peserta" required error={errors.nis} className="sm:col-span-2">
          <select value={form.nis} onChange={(event) => setForm({ ...form, nis: event.target.value })} className={`${inputClass} ${errors.nis ? 'border-rose-300' : ''}`}>
            <option value="">— Pilih peserta —</option>
            {formSantri.map((item) => <option key={item.nis} value={item.nis}>{item.nis} · {item.name} · {item.dorm}</option>)}
          </select>
          {selectedActivity && formSantri.length === 0 && <span className="mt-1 block text-[10px] font-semibold text-amber-600">Tidak ada santri {genderFilter} yang memenuhi kategori peserta, cabang, dan asrama kegiatan ini.</span>}
        </Field>
        <Field label="Status kehadiran" required className="sm:col-span-2">
          <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className={inputClass}>
            {ABSENSI_STATUS.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </Field>
      </div>
      {selectedActivity && <div className="mt-4 rounded-xl bg-leaf-50 px-3.5 py-3 text-[11px] leading-5 text-stone-600">
        <p className="font-extrabold text-leaf-900">{selectedActivity.title}</p>
        <p className="mt-1">{formatDateID(selectedActivity.date)} · {selectedActivity.time} WIB · {selectedActivity.branch} · {selectedActivity.dorm}</p>
        <p className="mt-1">Peserta: {participantCategories.find((item) => item.id === selectedActivity.participantCategoryId)?.name || selectedActivity.participants || '-'}{selectedActivity.participantNis?.length > 0 ? ` · ${selectedActivity.participantNis.length} peserta spesifik` : ''}</p>
      </div>}
    </Modal>}
  </div>
}
