// Halaman Kegiatan (v0.3): kategori peserta dapat dikelola melalui modal (+).
// Menghindari duplikasi agenda dan menjaga relasi kategori ↔ kegiatan.
import { useMemo, useState } from 'react'
import {
  Building2, CalendarDays, ChevronRight, CircleAlert, Clock3, House, Layers,
  MapPin, Pencil, Plus, Search, Tags, Trash2, Users,
} from 'lucide-react'
import {
  Avatar, Badge, Button, EmptyState, Field, FilterSelect, Modal, SearchInput,
  formatDateID, inputClass, toDateKey,
} from '../ui'
import { BRANCHES, KATEGORI_KEGIATAN, dormsOfBranch } from '../data/master'

const toneOfCategory = (category) => category === 'Tahfidz' ? 'green' : category === 'Sholat' ? 'amber' : category === 'Pembinaan' ? 'red' : 'leaf'
const categoryStatus = (date) => {
  const today = toDateKey()
  return date === today ? { label: 'Hari ini', tone: 'amber' } : date > today ? { label: 'Akan datang', tone: 'blue' } : { label: 'Selesai', tone: 'neutral' }
}

const blankForm = (participantCategories) => ({
  title: '',
  category: KATEGORI_KEGIATAN[0],
  date: toDateKey(),
  time: '08:00',
  participantCategoryId: participantCategories[0]?.id || '',
  participantNis: [],
  branch: BRANCHES[0],
  dorm: 'Semua Asrama',
  location: '',
  notes: '',
})

export default function ActivitiesPage({ activities, setActivities, santri, role, participantCategories, setParticipantCategories, kegiatanRecords, setKegiatanRecords, notify }) {
  const [query, setQuery] = useState('')
  const [fCategory, setFCategory] = useState('Semua')
  const [fParticipant, setFParticipant] = useState('Semua')
  const [fBranch, setFBranch] = useState('Semua')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(() => blankForm(participantCategories))
  const [errors, setErrors] = useState({})
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [categoryModal, setCategoryModal] = useState(false)
  const [catEditing, setCatEditing] = useState(null)
  const [catForm, setCatForm] = useState({ name: '', gender: '' })
  const [catError, setCatError] = useState('')
  const [participantQuery, setParticipantQuery] = useState('')

  const isSuper = role === 'Super Admin'
  const canManage = role !== 'Santri'
  const today = toDateKey()

  const filtered = useMemo(() => activities.filter((item) => {
    const matchesQuery = !query || `${item.title} ${item.branch} ${item.location} ${item.notes} ${item.participants}`.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = fCategory === 'Semua' || item.category === fCategory
    const matchesParticipant = fParticipant === 'Semua' || item.participantCategoryId === fParticipant
    const matchesBranch = fBranch === 'Semua' || item.branch === fBranch
    return matchesQuery && matchesCategory && matchesParticipant && matchesBranch
  }).slice().sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)), [activities, query, fCategory, fParticipant, fBranch])

  const categoryOf = (item) => participantCategories.find((category) => category.id === item.participantCategoryId)
  const participantLabel = (item) => categoryOf(item)?.name || item.participants || '-'

  const selectedCategory = categoryOf({ participantCategoryId: form.participantCategoryId })
  const candidateParticipants = useMemo(() => santri.filter((item) => {
    if (selectedCategory?.gender && item.gender !== selectedCategory.gender) return false
    if (form.branch && form.branch !== 'Semua Cabang' && item.branch !== form.branch) return false
    if (form.dorm && form.dorm !== 'Semua Asrama' && item.dorm !== form.dorm) return false
    return !participantQuery || `${item.name} ${item.nis}`.toLowerCase().includes(participantQuery.toLowerCase())
  }), [santri, selectedCategory, form.branch, form.dorm, participantQuery])

  const hasFilter = query || fCategory !== 'Semua' || fParticipant !== 'Semua' || fBranch !== 'Semua'
  const resetFilters = () => { setQuery(''); setFCategory('Semua'); setFParticipant('Semua'); setFBranch('Semua') }

  if (!canManage) {
    return <section className="rounded-2xl border border-[#e0e9de] bg-white shadow-soft">
      <EmptyState title="Akses terbatas" desc="Akun Santri hanya dapat melihat ringkasan kegiatan melalui portal santri. Pengelolaan agenda dilakukan Super Admin atau Admin Cabang."/>
    </section>
  }

  const openAdd = () => {
    setEditing(null)
    setErrors({})
    setParticipantQuery('')
    setForm(blankForm(participantCategories))
    setShowModal(true)
  }
  const openEdit = (item) => {
    setEditing(item)
    setErrors({})
    setParticipantQuery('')
    setForm({
      title: item.title,
      category: item.category,
      date: item.date,
      time: item.time,
      participantCategoryId: item.participantCategoryId || participantCategories[0]?.id || '',
      participantNis: item.participantNis || [],
      branch: item.branch || BRANCHES[0],
      dorm: item.dorm || 'Semua Asrama',
      location: item.location || '',
      notes: item.notes || '',
    })
    setShowModal(true)
  }

  const changeBranch = (branch) => setForm((current) => ({
    ...current,
    branch,
    dorm: 'Semua Asrama',
    participantNis: current.participantNis.filter((nis) => {
      const participant = santri.find((item) => item.nis === nis)
      return participant && (branch === 'Semua Cabang' || participant.branch === branch)
    }),
  }))

  const toggleParticipant = (nis) => setForm((current) => ({
    ...current,
    participantNis: current.participantNis.includes(nis) ? current.participantNis.filter((item) => item !== nis) : [...current.participantNis, nis],
  }))

  const saveActivity = (event) => {
    event.preventDefault()
    const next = {}
    const category = participantCategories.find((item) => item.id === form.participantCategoryId)
    if (!form.title.trim()) next.title = 'Nama kegiatan wajib diisi.'
    if (!form.date) next.date = 'Tanggal wajib diisi.'
    if (!form.time) next.time = 'Waktu wajib diisi.'
    if (!form.participantCategoryId || !category) next.participantCategoryId = 'Kategori peserta wajib dipilih.'
    const duplicate = activities.some((item) => item.id !== editing?.id &&
      item.title.trim().toLowerCase() === form.title.trim().toLowerCase() &&
      item.date === form.date && item.time === form.time && item.branch === form.branch)
    if (duplicate) next.title = 'Kegiatan dengan nama, tanggal, waktu, dan cabang yang sama sudah ada.'
    setErrors(next)
    if (Object.keys(next).length) return

    const payload = {
      title: form.title.trim(),
      category: form.category,
      date: form.date,
      time: form.time,
      participantCategoryId: form.participantCategoryId,
      participants: category.name,
      participantNis: form.participantNis,
      branch: form.branch,
      dorm: form.dorm,
      location: form.location.trim(),
      notes: form.notes.trim(),
    }
    if (editing) {
      setActivities((current) => current.map((item) => item.id === editing.id ? { ...item, ...payload } : item))
      notify(`Kegiatan "${payload.title}" berhasil diperbarui.`)
    } else {
      setActivities((current) => [...current, { ...payload, id: `event-${Date.now()}` }])
      notify(`Kegiatan "${payload.title}" berhasil ditambahkan ke kalender.`)
    }
    setShowModal(false)
    setEditing(null)
  }

  const removeActivity = () => {
    if (!deleteTarget) return
    setActivities((current) => current.filter((item) => item.id !== deleteTarget.id))
    setKegiatanRecords?.((current) => current.filter((record) => record.eventId !== deleteTarget.id))
    notify(`Kegiatan "${deleteTarget.title}" dan absensinya dihapus.`, 'info')
    setDeleteTarget(null)
  }

  const openCategoryAdd = () => { setCatEditing(null); setCatForm({ name: '', gender: '' }); setCatError('') }
  const openCategoryEdit = (category) => { setCatEditing(category); setCatForm({ name: category.name, gender: category.gender || '' }); setCatError('') }
  const saveCategory = (event) => {
    event.preventDefault()
    const name = catForm.name.trim()
    if (!name) { setCatError('Nama kategori wajib diisi.'); return }
    const duplicate = participantCategories.some((item) => item.id !== catEditing?.id && item.name.toLowerCase() === name.toLowerCase())
    if (duplicate) { setCatError('Nama kategori peserta sudah digunakan.'); return }
    const payload = { name, gender: catForm.gender || null }
    if (catEditing) {
      setParticipantCategories((current) => current.map((item) => item.id === catEditing.id ? { ...item, ...payload } : item))
      setActivities((current) => current.map((activity) => activity.participantCategoryId === catEditing.id ? { ...activity, participants: name } : activity))
      notify(`Kategori peserta "${name}" diperbarui dan disinkronkan ke kegiatan terkait.`)
    } else {
      setParticipantCategories((current) => [...current, { ...payload, id: `pc-${Date.now()}` }])
      notify(`Kategori peserta "${name}" ditambahkan.`)
    }
    openCategoryAdd()
  }
  const deleteCategory = (category) => {
    const used = activities.filter((item) => item.participantCategoryId === category.id)
    if (used.length > 0) {
      notify(`Kategori "${category.name}" masih dipakai ${used.length} kegiatan. Ubah kategori peserta kegiatan tersebut sebelum menghapus.`, 'error')
      return
    }
    setParticipantCategories((current) => current.filter((item) => item.id !== category.id))
    if (form.participantCategoryId === category.id) setForm((current) => ({ ...current, participantCategoryId: participantCategories.find((item) => item.id !== category.id)?.id || '' }))
    notify(`Kategori peserta "${category.name}" dihapus.`, 'info')
  }

  const upcoming = filtered.filter((item) => item.date >= today).length
  const usedCategories = new Set(filtered.map((item) => item.participantCategoryId).filter(Boolean)).size

  return <div className="space-y-5">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="flex items-center gap-2 text-xs text-stone-400"><span>Workspace</span><ChevronRight size={12}/><span className="text-leaf-700">Kegiatan</span></div>
        <h2 className="mt-2 font-display text-2xl font-extrabold text-leaf-900">Manajemen Kegiatan</h2>
        <p className="mt-1 text-sm text-stone-500">Atur jadwal, kategori peserta, peserta spesifik, cabang, dan asrama. Agenda langsung muncul di kalender Dashboard.</p>
        <div className="mt-2 flex flex-wrap gap-2"><Badge tone="leaf">{activities.length} agenda</Badge><Badge tone="neutral">{participantCategories.length} kategori peserta</Badge></div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" icon={Tags} onClick={() => { setCategoryModal(true); openCategoryAdd() }}>Kelola Kategori Peserta</Button>
        <Button icon={Plus} onClick={openAdd}>Tambah Kegiatan</Button>
      </div>
    </div>

    <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-2xl border border-[#e0e9de] bg-white p-4 shadow-soft"><p className="text-xs text-stone-500">Hasil filter</p><p className="mt-2 font-display text-2xl font-extrabold text-leaf-900">{filtered.length}</p><p className="mt-1 text-[10px] text-stone-400">dari {activities.length} agenda</p></div>
      <div className="rounded-2xl border border-[#e0e9de] bg-white p-4 shadow-soft"><p className="text-xs text-stone-500">Agenda mendatang</p><p className="mt-2 font-display text-2xl font-extrabold text-leaf-900">{upcoming}</p><p className="mt-1 text-[10px] text-stone-400">Hari ini dan berikutnya</p></div>
      <div className="rounded-2xl border border-[#e0e9de] bg-white p-4 shadow-soft"><p className="text-xs text-stone-500">Kategori peserta terpakai</p><p className="mt-2 font-display text-2xl font-extrabold text-leaf-900">{usedCategories}</p><p className="mt-1 text-[10px] text-stone-400">Pada hasil filter</p></div>
    </div>

    <section className="overflow-hidden rounded-2xl border border-[#e0e9de] bg-white shadow-soft">
      <div className="flex flex-wrap items-center gap-2.5 border-b border-stone-100 p-4">
        <SearchInput value={query} onChange={setQuery} placeholder="Cari nama kegiatan, peserta, cabang..." />
        <FilterSelect icon={Layers} label="Kategori" value={fCategory} onChange={setFCategory} options={['Semua', ...KATEGORI_KEGIATAN]}/>
        <FilterSelect icon={Tags} label="Peserta" value={fParticipant} onChange={setFParticipant} options={[{ value: 'Semua', label: 'Semua kategori peserta' }, ...participantCategories.map((category) => ({ value: category.id, label: category.name }))]}/>
        <FilterSelect icon={Building2} label="Cabang" value={fBranch} onChange={setFBranch} options={['Semua', ...BRANCHES]}/>
        {hasFilter && <Button variant="ghost" onClick={resetFilters}>Reset filter</Button>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left">
          <thead className="bg-leaf-50/70">
            <tr className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              <th className="px-5 py-3">Kegiatan</th>
              <th className="px-4 py-3">Tanggal & Waktu</th>
              <th className="px-4 py-3">Kategori Peserta</th>
              <th className="px-4 py-3">Peserta Spesifik</th>
              <th className="px-4 py-3">Cabang / Asrama</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => {
              const status = categoryStatus(item.date)
              return <tr key={item.id} className="border-t border-stone-100 transition hover:bg-leaf-50/40">
                <td className="px-5 py-4"><p className="text-xs font-extrabold text-leaf-900">{item.title}</p>{item.location && <p className="mt-1 flex items-center gap-1 text-[10px] text-stone-400"><MapPin size={11}/>{item.location}</p>}</td>
                <td className="px-4 py-4"><p className="text-xs font-semibold text-stone-700">{formatDateID(item.date, { day: 'numeric', month: 'short', year: 'numeric' })}</p><p className="mt-1 flex items-center gap-1 text-[10px] text-stone-400"><Clock3 size={11}/>{item.time} WIB</p></td>
                <td className="px-4 py-4"><Badge tone="leaf">{participantLabel(item)}</Badge></td>
                <td className="px-4 py-4">{item.participantNis?.length > 0 ? <div className="flex max-w-[210px] flex-wrap gap-1">{item.participantNis.slice(0, 2).map((nis) => <span key={nis} className="rounded-full bg-leaf-100 px-2 py-0.5 text-[10px] font-bold text-leaf-700">{santri.find((s) => s.nis === nis)?.name || nis}</span>)}{item.participantNis.length > 2 && <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-500">+{item.participantNis.length - 2}</span>}</div> : <span className="text-[11px] text-stone-400">Semua peserta kategori</span>}</td>
                <td className="px-4 py-4"><p className="text-xs font-semibold text-stone-600">{item.branch}</p><p className="mt-1 text-[10px] text-stone-400">{item.dorm || 'Semua Asrama'}</p></td>
                <td className="px-4 py-4"><Badge tone={toneOfCategory(item.category)}>{item.category}</Badge></td>
                <td className="px-4 py-4"><Badge tone={status.tone}>{status.label}</Badge></td>
                <td className="px-4 py-4"><div className="flex justify-end gap-1">
                  <button title="Edit kegiatan" onClick={() => openEdit(item)} className="rounded-lg p-2 text-stone-400 hover:bg-leaf-100 hover:text-leaf-700"><Pencil size={15}/></button>
                  <button title="Hapus kegiatan" onClick={() => setDeleteTarget(item)} className="rounded-lg p-2 text-stone-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={15}/></button>
                </div></td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && <EmptyState title="Belum ada kegiatan" desc="Tidak ada agenda yang cocok dengan filter. Ubah pencarian/kategori, atau tambahkan kegiatan baru."/>}
      <div className="border-t border-stone-100 px-5 py-3 text-[11px] text-stone-400">Menampilkan {filtered.length} dari {activities.length} agenda · Perubahan langsung tercermin pada kalender Dashboard</div>
    </section>

    {showModal && <Modal
      title={editing ? 'Edit Kegiatan' : 'Tambah Kegiatan'}
      subtitle="Kategori peserta menentukan peserta yang dapat dicatat pada absensi kegiatan."
      icon={CalendarDays}
      size="lg"
      onClose={() => { setShowModal(false); setEditing(null) }}
      onSubmit={saveActivity}
      footer={<>
        <Button variant="outline" onClick={() => { setShowModal(false); setEditing(null) }}>Batal</Button>
        <Button type="submit" icon={Plus}>{editing ? 'Simpan Perubahan' : 'Simpan Kegiatan'}</Button>
      </>}
    >
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Nama kegiatan" required error={errors.title} className="sm:col-span-2">
          <input autoFocus value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className={`${inputClass} ${errors.title ? 'border-rose-300' : ''}`} placeholder="Contoh: Kajian Kitab Akhlak"/>
        </Field>
        <Field label="Tanggal" required error={errors.date}>
          <input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} className={`${inputClass} ${errors.date ? 'border-rose-300' : ''}`}/>
        </Field>
        <Field label="Waktu" required error={errors.time}>
          <input type="time" value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} className={`${inputClass} ${errors.time ? 'border-rose-300' : ''}`}/>
        </Field>
        <Field label="Kategori kegiatan">
          <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className={inputClass}>
            {KATEGORI_KEGIATAN.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </Field>
        <div>
          <Field label="Kategori peserta" required error={errors.participantCategoryId}>
            <div className="mt-2 flex items-center gap-2">
              <select value={form.participantCategoryId} onChange={(event) => setForm({ ...form, participantCategoryId: event.target.value, participantNis: [] })} className={`${inputClass} !mt-0 flex-1 ${errors.participantCategoryId ? 'border-rose-300' : ''}`}>
                <option value="">— Pilih kategori peserta —</option>
                {participantCategories.map((category) => <option key={category.id} value={category.id}>{category.name}{category.gender ? ` · ${category.gender}` : ' · Ikhwan & Akhwat'}</option>)}
              </select>
              <button type="button" title="Tambah kategori peserta" aria-label="Tambah kategori peserta" onClick={() => { setCategoryModal(true); openCategoryAdd() }} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-leaf-700 text-white transition hover:bg-leaf-800"><Plus size={17}/></button>
            </div>
          </Field>
        </div>
        <Field label="Cabang">
          <select value={form.branch} onChange={(event) => changeBranch(event.target.value)} className={inputClass}>
            <option value="Semua Cabang">Semua Cabang</option>
            {BRANCHES.map((branch) => <option key={branch} value={branch}>{branch}</option>)}
          </select>
        </Field>
        <Field label="Asrama">
          <select value={form.dorm} onChange={(event) => setForm({ ...form, dorm: event.target.value, participantNis: [] })} className={inputClass} disabled={form.branch === 'Semua Cabang'}>
            <option value="Semua Asrama">Semua Asrama</option>
            {(form.branch === 'Semua Cabang' ? [] : dormsOfBranch(form.branch)).map((dorm) => <option key={dorm.name} value={dorm.name}>{dorm.name} · {dorm.gender}</option>)}
          </select>
        </Field>
        <Field label="Lokasi (opsional)">
          <input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} className={inputClass} placeholder="Contoh: Aula utama"/>
        </Field>
        <Field label="Catatan (opsional)" className="sm:col-span-2">
          <textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} rows={2} className={`${inputClass} resize-y`} placeholder="Keterangan atau pengingat untuk peserta..."/>
        </Field>
        <div className="sm:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-bold text-stone-600">Peserta spesifik (opsional)</p>
            {form.participantNis.length > 0 && <button type="button" onClick={() => setForm({ ...form, participantNis: [] })} className="text-[11px] font-bold text-stone-400 hover:text-rose-500">Kosongkan pilihan ({form.participantNis.length})</button>}
          </div>
          <p className="mt-1 text-[10px] text-stone-400">Kosongkan untuk memakai seluruh peserta kategori. Pilihan mengikuti kategori gender peserta, cabang, dan asrama.</p>
          <div className="mt-2 overflow-hidden rounded-xl border border-stone-200">
            <div className="flex items-center gap-2 border-b border-stone-100 bg-leaf-50/70 px-3 py-2">
              <Search size={14} className="shrink-0 text-stone-400"/>
              <input value={participantQuery} onChange={(event) => setParticipantQuery(event.target.value)} placeholder="Cari nama atau NIS peserta..." className="w-full bg-transparent text-xs outline-none placeholder:text-stone-400"/>
            </div>
            <div className="max-h-40 divide-y divide-stone-50 overflow-y-auto">
              {candidateParticipants.map((item) => <label key={item.nis} className="flex cursor-pointer items-center gap-3 px-3 py-2.5 transition hover:bg-leaf-50/60">
                <input type="checkbox" checked={form.participantNis.includes(item.nis)} onChange={() => toggleParticipant(item.nis)} className="rounded border-stone-300 accent-leaf-700"/>
                <Avatar name={item.name} tone={item.gender === 'Ikhwan' ? 'leaf' : 'blue'} size="sm"/>
                <div className="min-w-0 flex-1"><p className="text-xs font-bold text-leaf-900">{item.name}</p><p className="mt-0.5 text-[10px] text-stone-400">{item.nis} · {item.dorm}</p></div>
                <Badge tone={item.gender === 'Ikhwan' ? 'leaf' : 'blue'}>{item.gender}</Badge>
              </label>)}
              {candidateParticipants.length === 0 && <p className="px-3 py-5 text-center text-xs text-stone-400">Tidak ada peserta yang cocok dengan kategori, cabang, atau asrama kegiatan ini.</p>}
            </div>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-stone-500"><Users size={13} className="text-leaf-500"/>{form.participantNis.length > 0 ? `${form.participantNis.length} peserta spesifik dipilih` : `Seluruh peserta kategori ${selectedCategory?.name || '-'}`}</p>
        </div>
      </div>
    </Modal>}

    {deleteTarget && <Modal
      title="Hapus Kegiatan?"
      subtitle="Absensi kegiatan terkait juga dihapus dari state demo."
      icon={CircleAlert}
      onClose={() => setDeleteTarget(null)}
      footer={<>
        <Button variant="outline" onClick={() => setDeleteTarget(null)}>Batal</Button>
        <Button onClick={removeActivity} icon={Trash2}>Hapus {deleteTarget.title}</Button>
      </>}
    >
      <p className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-[11px] leading-5 text-rose-700">Kegiatan <strong>{deleteTarget.title}</strong> pada {formatDateID(deleteTarget.date)} pukul {deleteTarget.time} WIB akan dihapus beserta catatan absensinya. Riwayat setoran Tahfidz tidak terpengaruh.</p>
    </Modal>}

    {categoryModal && <Modal
      title="Kategori Peserta Kegiatan"
      subtitle="Kategori menentukan gender peserta. Kategori yang masih dipakai kegiatan tidak dapat dihapus."
      icon={Tags}
      size="lg"
      onClose={() => { setCategoryModal(false); openCategoryAdd() }}
      footer={<Button variant="outline" onClick={() => { setCategoryModal(false); openCategoryAdd() }}>Tutup</Button>}
    >
      <form onSubmit={saveCategory} className="mt-5 rounded-2xl border border-stone-100 bg-leaf-50/60 p-4">
        <p className="text-xs font-extrabold text-leaf-900">{catEditing ? `Edit kategori: ${catEditing.name}` : 'Tambah kategori peserta baru'}</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_180px_auto]">
          <Field label="Nama kategori" required>
            <input value={catForm.name} onChange={(event) => setCatForm({ ...catForm, name: event.target.value })} className={inputClass} placeholder="Contoh: Kelompok Tahfidz"/>
          </Field>
          <Field label="Kategori gender">
            <select value={catForm.gender} onChange={(event) => setCatForm({ ...catForm, gender: event.target.value })} className={inputClass}>
              <option value="">Ikhwan & Akhwat</option>
              <option value="Ikhwan">Ikhwan</option>
              <option value="Akhwat">Akhwat</option>
            </select>
          </Field>
          <div className="flex items-end gap-2">
            <Button type="submit" icon={catEditing ? Pencil : Plus}>{catEditing ? 'Simpan' : 'Tambah'}</Button>
            {catEditing && <Button variant="outline" onClick={openCategoryAdd}>Batal</Button>}
          </div>
        </div>
        {catError && <p className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-rose-600"><CircleAlert size={12}/>{catError}</p>}
      </form>
      <div className="mt-4 space-y-2">
        {participantCategories.map((category) => {
          const used = activities.filter((item) => item.participantCategoryId === category.id).length
          return <div key={category.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-stone-100 px-3.5 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-extrabold text-leaf-900">{category.name}</p>
              <p className="mt-0.5 text-[10px] text-stone-400">{category.gender || 'Ikhwan & Akhwat'} · dipakai {used} kegiatan</p>
            </div>
            <Badge tone={used > 0 ? 'green' : 'neutral'}>{used > 0 ? 'Terhubung' : 'Belum dipakai'}</Badge>
            <button title="Edit kategori" onClick={() => openCategoryEdit(category)} className="rounded-lg p-2 text-stone-400 hover:bg-leaf-100 hover:text-leaf-700"><Pencil size={14}/></button>
            <button title="Hapus kategori" onClick={() => deleteCategory(category)} disabled={used > 0} className={`rounded-lg p-2 ${used > 0 ? 'cursor-not-allowed text-stone-200' : 'text-stone-400 hover:bg-rose-50 hover:text-rose-600'}`}><Trash2 size={14}/></button>
          </div>
        })}
      </div>
      {isSuper && <p className="mt-4 text-[10px] leading-5 text-stone-400">Super Admin dapat mengelola seluruh kategori. Perubahan nama kategori otomatis memperbarui label peserta pada kegiatan yang memakainya.</p>}
    </Modal>}
  </div>
}
