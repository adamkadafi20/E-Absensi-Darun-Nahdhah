// Halaman Data Santri (v0.3): filter lengkap, CRUD, kolom Poin,
// serta Import/Export Excel. Seluruh data disimpan pada state React (demo).
import { useEffect, useMemo, useState } from 'react'
import {
  Building2, ChevronRight, CircleAlert, Download, Eye, House, Pencil, Plus,
  Trash2, TrendingUp, Upload, UserRound, Users,
} from 'lucide-react'
import {
  Avatar, Badge, Button, EmptyState, Field, FilterSelect, GenderGate, Modal,
  Pagination, SearchInput, formatDateID, formatNumber, inputClass,
} from '../ui'
import {
  BRANCHES, DORMS, STATUS_SANTRI, calcPoin, dormsOfBranch, findDorm,
  generateNextNis,
} from '../data/master'
import { SantriExportModal, SantriImportModal } from './SantriExcel'

const PAGE_SIZE = 8
const genderTone = (gender) => gender === 'Ikhwan' ? 'leaf' : 'blue'

const blankForm = () => ({
  name: '',
  branch: BRANCHES[0],
  dorm: dormsOfBranch(BRANCHES[0])[0].name,
  status: 'Aktif',
  attendance: 100,
  tahfidz: '0 Juz',
})

export default function SantriPage({ santri, setSantri, role, genderFilter, setGenderFilter, rewards, hukuman, notify }) {
  const [fBranch, setFBranch] = useState('Semua')
  const [fDorm, setFDorm] = useState('Semua')
  const [fStatus, setFStatus] = useState('Semua')
  const [nameQuery, setNameQuery] = useState('')
  const [nisQuery, setNisQuery] = useState('')
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(blankForm)
  const [errors, setErrors] = useState({})
  const [detail, setDetail] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [importOpen, setImportOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)

  const dormOptions = fBranch === 'Semua' ? DORMS.map((dorm) => dorm.name) : dormsOfBranch(fBranch).map((dorm) => dorm.name)
  const formDorms = dormsOfBranch(form.branch)
  const formGender = findDorm(form.dorm)?.gender || 'Ikhwan'

  const filtered = useMemo(() => santri.filter((item) => {
    const matchesGender = item.gender === genderFilter
    const matchesBranch = fBranch === 'Semua' || item.branch === fBranch
    const matchesDorm = fDorm === 'Semua' || item.dorm === fDorm
    const matchesStatus = fStatus === 'Semua' || item.status === fStatus
    const matchesName = !nameQuery || item.name.toLowerCase().includes(nameQuery.toLowerCase())
    const matchesNis = !nisQuery || item.nis.toLowerCase().includes(nisQuery.toLowerCase())
    return matchesGender && matchesBranch && matchesDorm && matchesStatus && matchesName && matchesNis
  }), [santri, genderFilter, fBranch, fDorm, fStatus, nameQuery, nisQuery])

  useEffect(() => { setPage(1) }, [genderFilter, fBranch, fDorm, fStatus, nameQuery, nisQuery])
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    if (page > maxPage) setPage(maxPage)
  }, [filtered.length, page])

  if (!genderFilter) {
    return <GenderGate
      title="Data Santri"
      description="Kelola profil, penempatan, dan status santri. Pilih kategori terlebih dahulu agar data tidak tercampur."
      setGenderFilter={setGenderFilter}
    />
  }

  const resetFilters = () => {
    setFBranch('Semua'); setFDorm('Semua'); setFStatus('Semua'); setNameQuery(''); setNisQuery('')
  }
  const hasFilter = fBranch !== 'Semua' || fDorm !== 'Semua' || fStatus !== 'Semua' || nameQuery || nisQuery
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const avgAttendance = filtered.length ? Math.round(filtered.reduce((sum, item) => sum + (Number(item.attendance) || 0), 0) / filtered.length) : 0
  const canManage = role !== 'Santri'
  const poinOf = (nis) => calcPoin(nis, rewards, hukuman)

  const openAdd = () => {
    setEditing(null)
    setErrors({})
    setForm(blankForm())
    setModal(true)
  }
  const openEdit = (item) => {
    setEditing(item)
    setErrors({})
    setForm({ name: item.name, branch: item.branch, dorm: item.dorm, status: item.status, attendance: item.attendance, tahfidz: item.tahfidz })
    setModal(true)
  }

  const changeBranch = (branch) => {
    const first = dormsOfBranch(branch)[0]
    setForm((current) => ({ ...current, branch, dorm: first ? first.name : '' }))
  }

  const save = (event) => {
    event.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = 'Nama lengkap wajib diisi.'
    if (!form.dorm) next.dorm = 'Asrama wajib dipilih.'
    const duplicate = santri.some((item) => item.nis !== editing?.nis &&
      item.name.toLowerCase() === form.name.trim().toLowerCase() &&
      item.branch === form.branch && item.dorm === form.dorm)
    if (duplicate) next.name = 'Santri dengan nama, cabang, dan asrama yang sama sudah terdaftar.'
    setErrors(next)
    if (Object.keys(next).length) return

    const payload = {
      name: form.name.trim(),
      gender: formGender,
      branch: form.branch,
      dorm: form.dorm,
      status: form.status,
      attendance: Number(form.attendance) || 0,
      tahfidz: form.tahfidz || '0 Juz',
    }

    if (editing) {
      setSantri((current) => current.map((item) => item.nis === editing.nis ? { ...item, ...payload } : item))
      notify(`Data ${payload.name} berhasil diperbarui. NIS ${editing.nis} tidak berubah.`)
    } else {
      const nis = generateNextNis(santri.map((item) => item.nis))
      setSantri((current) => [{ ...payload, nis }, ...current])
      notify(`Santri ${payload.name} ditambahkan dengan NIS otomatis ${nis}.`)
    }
    setModal(false)
    setEditing(null)
  }

  const remove = () => {
    if (!deleteTarget) return
    setSantri((current) => current.filter((item) => item.nis !== deleteTarget.nis))
    notify(`Data ${deleteTarget.name} telah dihapus dari daftar demo.`, 'info')
    setDeleteTarget(null)
  }

  const handleImport = (rows) => {
    setSantri((current) => [...rows, ...current])
    notify(`${rows.length} santri berhasil diimport dengan NIS otomatis.`, 'success')
  }

  return <div className="space-y-5">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="flex items-center gap-2 text-xs text-stone-400"><span>Workspace</span><ChevronRight size={12}/><span className="text-leaf-700">Data Santri</span></div>
        <h2 className="mt-2 font-display text-2xl font-extrabold text-leaf-900">Data Santri</h2>
        <p className="mt-1 text-sm text-stone-500">Kelola profil, penempatan cabang/asrama, kehadiran, poin, dan status santri.</p>
        <div className="mt-2"><Badge tone={genderTone(genderFilter)}>Kategori aktif: {genderFilter}</Badge></div>
      </div>
      {canManage && <div className="flex flex-wrap gap-2">
        <Button variant="outline" icon={Upload} onClick={() => setImportOpen(true)}>Import Excel</Button>
        <Button variant="outline" icon={Download} onClick={() => setExportOpen(true)}>Export Excel</Button>
        <Button icon={Plus} onClick={openAdd}>Tambah Santri</Button>
      </div>}
    </div>

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-2xl border border-[#e0e9de] bg-white p-4 shadow-soft"><p className="text-xs text-stone-500">Hasil filter</p><p className="mt-2 font-display text-2xl font-extrabold text-leaf-900">{formatNumber(filtered.length)}</p><p className="mt-1 text-[10px] text-stone-400">dari {formatNumber(santri.filter((item) => item.gender === genderFilter).length)} santri {genderFilter}</p></div>
      <div className="rounded-2xl border border-[#e0e9de] bg-white p-4 shadow-soft"><p className="text-xs text-stone-500">Status aktif</p><p className="mt-2 font-display text-2xl font-extrabold text-leaf-900">{filtered.filter((item) => item.status === 'Aktif').length}</p><p className="mt-1 text-[10px] text-stone-400">Sesuai filter aktif</p></div>
      <div className="rounded-2xl border border-[#e0e9de] bg-white p-4 shadow-soft"><p className="text-xs text-stone-500">Perlu perhatian</p><p className="mt-2 font-display text-2xl font-extrabold text-leaf-900">{filtered.filter((item) => item.status === 'Perlu perhatian').length}</p><p className="mt-1 text-[10px] text-stone-400">Perlu pembinaan lanjutan</p></div>
      <div className="rounded-2xl border border-[#e0e9de] bg-white p-4 shadow-soft"><p className="text-xs text-stone-500">Rata-rata kehadiran</p><p className="mt-2 font-display text-2xl font-extrabold text-leaf-900">{avgAttendance}%</p><p className="mt-1 flex items-center gap-1 text-[10px] text-stone-400"><TrendingUp size={11} className="text-emerald-600"/>Dihitung dari hasil filter</p></div>
    </div>

    <section className="overflow-hidden rounded-2xl border border-[#e0e9de] bg-white shadow-soft">
      <div className="flex flex-wrap items-center gap-2.5 border-b border-stone-100 p-4">
        <SearchInput value={nameQuery} onChange={setNameQuery} placeholder="Cari nama santri..." className="min-w-[180px]"/>
        <SearchInput value={nisQuery} onChange={setNisQuery} placeholder="Cari NIS..." className="min-w-[150px]"/>
        <FilterSelect icon={Building2} label="Cabang" value={fBranch} onChange={(value) => { setFBranch(value); setFDorm('Semua') }} options={['Semua', ...BRANCHES]}/>
        <FilterSelect icon={House} label="Asrama" value={fDorm} onChange={setFDorm} options={['Semua', ...dormOptions]}/>
        <FilterSelect icon={Users} label="Status" value={fStatus} onChange={setFStatus} options={['Semua', ...STATUS_SANTRI]}/>
        {hasFilter && <Button variant="ghost" onClick={resetFilters}>Reset filter</Button>}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-left">
          <thead className="bg-leaf-50/70">
            <tr className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              <th className="px-5 py-3">NIS</th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Jenis Kelamin</th>
              <th className="px-4 py-3">Cabang</th>
              <th className="px-4 py-3">Asrama</th>
              <th className="px-4 py-3">Kehadiran</th>
              <th className="px-4 py-3">Poin</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((item, index) => {
              const poin = poinOf(item.nis)
              return <tr key={item.nis} className="border-t border-stone-100 transition hover:bg-leaf-50/40">
                <td className="px-5 py-4 text-xs font-bold text-stone-500">{item.nis}</td>
                <td className="px-4 py-4"><div className="flex items-center gap-3"><Avatar name={item.name} tone={item.gender === 'Ikhwan' ? 'leaf' : 'blue'} size="sm"/><div><p className="text-xs font-extrabold text-leaf-900">{item.name}</p><p className="mt-0.5 text-[10px] text-stone-400">Tahfidz {item.tahfidz}</p></div></div></td>
                <td className="px-4 py-4"><Badge tone={genderTone(item.gender)}>{item.gender}</Badge></td>
                <td className="px-4 py-4 text-xs font-semibold text-stone-600">{item.branch}</td>
                <td className="px-4 py-4 text-xs text-stone-600">{item.dorm}</td>
                <td className="px-4 py-4"><div className="flex items-center gap-2"><div className="h-1.5 w-14 rounded-full bg-stone-100"><div className="h-full rounded-full bg-leaf-600" style={{ width: `${Math.min(100, Number(item.attendance) || 0)}%` }}/></div><span className="text-xs font-bold text-stone-600">{item.attendance}%</span></div></td>
                <td className="px-4 py-4"><Badge tone={poin > 0 ? 'green' : poin < 0 ? 'red' : 'neutral'}>{poin > 0 ? `+${poin}` : poin} poin</Badge></td>
                <td className="px-4 py-4"><Badge tone={item.status === 'Aktif' ? 'green' : item.status === 'Perlu perhatian' ? 'amber' : 'neutral'}>{item.status}</Badge></td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-1">
                    <button title="Lihat detail" onClick={() => setDetail(item)} className="rounded-lg p-2 text-stone-400 hover:bg-leaf-100 hover:text-leaf-700"><Eye size={15}/></button>
                    {canManage && <>
                      <button title="Edit data" onClick={() => openEdit(item)} className="rounded-lg p-2 text-stone-400 hover:bg-leaf-100 hover:text-leaf-700"><Pencil size={15}/></button>
                      <button title="Hapus data" onClick={() => setDeleteTarget(item)} className="rounded-lg p-2 text-stone-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={15}/></button>
                    </>}
                  </div>
                </td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && <EmptyState title="Data santri tidak ditemukan" desc="Tidak ada santri yang cocok dengan filter aktif. Ubah kategori, cabang, asrama, status, atau kata kunci pencarian."/>}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 px-5 py-3 text-[11px] text-stone-400">
        <span>Menampilkan {paged.length} dari {filtered.length} santri {genderFilter} · NIS otomatis & tidak berubah saat edit</span>
        {hasFilter && <button onClick={resetFilters} className="font-bold text-leaf-700 hover:underline">Reset filter</button>}
      </div>
      <Pagination page={page} pageCount={pageCount} onChange={setPage}/>
    </section>

    {modal && <Modal
      title={editing ? 'Edit Data Santri' : 'Tambah Santri'}
      subtitle={editing ? `NIS ${editing.nis} terkunci dan tidak berubah.` : 'NIS dibuat otomatis dengan pola DN-2XXXX saat data disimpan.'}
      icon={UserRound}
      onClose={() => { setModal(false); setEditing(null) }}
      onSubmit={save}
      footer={<>
        <Button variant="outline" onClick={() => { setModal(false); setEditing(null) }}>Batal</Button>
        <Button type="submit" icon={Plus}>{editing ? 'Simpan Perubahan' : 'Simpan Santri'}</Button>
      </>}
    >
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Nama lengkap" required error={errors.name} className="sm:col-span-2">
          <input autoFocus value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className={`${inputClass} ${errors.name ? 'border-rose-300' : ''}`} placeholder="Nama santri"/>
        </Field>
        <Field label="NIS">
          <input readOnly value={editing ? editing.nis : 'Otomatis saat disimpan'} className={`${inputClass} bg-leaf-50 text-stone-500`}/>
        </Field>
        <Field label="Jenis kelamin (mengikuti asrama)">
          <input readOnly value={formGender} className={`${inputClass} bg-leaf-50 text-stone-500`}/>
        </Field>
        <Field label="Cabang" required>
          <select value={form.branch} onChange={(event) => changeBranch(event.target.value)} className={inputClass}>
            {BRANCHES.map((branch) => <option key={branch} value={branch}>{branch}</option>)}
          </select>
        </Field>
        <Field label="Asrama" required error={errors.dorm}>
          <select value={form.dorm} onChange={(event) => setForm({ ...form, dorm: event.target.value })} className={`${inputClass} ${errors.dorm ? 'border-rose-300' : ''}`}>
            {formDorms.map((dorm) => <option key={dorm.name} value={dorm.name}>{dorm.name} · {dorm.gender}</option>)}
          </select>
        </Field>
        <Field label="Status">
          <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className={inputClass}>
            {STATUS_SANTRI.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </Field>
        <Field label="Kehadiran (%)">
          <input type="number" min={0} max={100} value={form.attendance} onChange={(event) => setForm({ ...form, attendance: event.target.value })} className={inputClass}/>
        </Field>
        <Field label="Capaian tahfidz" className="sm:col-span-2">
          <input value={form.tahfidz} onChange={(event) => setForm({ ...form, tahfidz: event.target.value })} className={inputClass} placeholder="Contoh: 5 Juz"/>
        </Field>
      </div>
      <p className="mt-4 rounded-xl bg-leaf-50 px-3.5 py-3 text-[11px] leading-5 text-stone-500">Jenis kelamin diturunkan dari asrama yang dipilih. Master asrama: {DORMS.map((dorm) => `${dorm.name} (${dorm.gender})`).join(', ')}.</p>
    </Modal>}

    {detail && <Modal
      title={`Detail Santri — ${detail.name}`}
      subtitle={`${detail.nis} · ${detail.gender} · ${detail.branch}`}
      icon={Eye}
      size="lg"
      onClose={() => setDetail(null)}
      footer={<Button variant="outline" onClick={() => setDetail(null)}>Tutup</Button>}
    >
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {[
          ['NIS', detail.nis], ['Nama lengkap', detail.name], ['Jenis kelamin', detail.gender],
          ['Cabang', detail.branch], ['Asrama', detail.dorm], ['Status', detail.status],
          ['Kehadiran', `${detail.attendance}%`], ['Capaian tahfidz', detail.tahfidz],
        ].map(([label, value]) => <div key={label} className="rounded-xl border border-stone-100 bg-leaf-50/60 px-3.5 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">{label}</p>
          <p className="mt-1 text-xs font-extrabold text-leaf-900">{value}</p>
        </div>)}
      </div>
      <div className="mt-5 rounded-2xl border border-stone-100">
        <div className="flex items-center justify-between border-b border-stone-100 px-4 py-3">
          <p className="text-xs font-extrabold text-leaf-900">Rincian Poin</p>
          <Badge tone={poinOf(detail.nis) >= 0 ? 'green' : 'red'}>{poinOf(detail.nis)} poin</Badge>
        </div>
        <div className="divide-y divide-stone-50 text-[11px]">
          {(rewards || []).filter((item) => item.nis === detail.nis).map((item) => <div key={item.id} className="flex items-center justify-between gap-2 px-4 py-2.5"><span className="text-stone-600">{formatDateID(item.date, { day: 'numeric', month: 'short', year: 'numeric' })} · Reward: {item.title}</span><span className="font-bold text-emerald-700">+{item.poin}</span></div>)}
          {(hukuman || []).filter((item) => item.nis === detail.nis).map((item) => <div key={item.id} className="flex items-center justify-between gap-2 px-4 py-2.5"><span className="text-stone-600">{formatDateID(item.date, { day: 'numeric', month: 'short', year: 'numeric' })} · Hukuman: {item.violation}</span><span className="font-bold text-rose-600">−{item.poin}</span></div>)}
          {poinOf(detail.nis) === 0 && <p className="px-4 py-3 text-center text-stone-400">Belum ada catatan reward atau hukuman.</p>}
        </div>
        <p className="border-t border-stone-100 px-4 py-2.5 text-[10px] text-stone-400">Poin = total poin reward − total poin pelanggaran (bukan nilai acak).</p>
      </div>
    </Modal>}

    {deleteTarget && <Modal
      title="Hapus Data Santri?"
      subtitle="Data yang dihapus hanya dari state demo pada sesi ini."
      icon={CircleAlert}
      onClose={() => setDeleteTarget(null)}
      footer={<>
        <Button variant="outline" onClick={() => setDeleteTarget(null)}>Batal</Button>
        <Button onClick={remove} icon={Trash2}>Hapus {deleteTarget.name}</Button>
      </>}
    >
      <p className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-[11px] leading-5 text-rose-700">Menghapus <strong>{deleteTarget.name}</strong> ({deleteTarget.nis}) akan mengeluarkan data dari tabel. Riwayat absensi dan setoran yang sudah ada tidak ikut dihapus pada prototipe ini.</p>
    </Modal>}

    {importOpen && <SantriImportModal santri={santri} onImport={handleImport} onClose={() => setImportOpen(false)}/>}
    {exportOpen && <SantriExportModal allRows={santri} filteredRows={filtered} poinOf={poinOf} onClose={() => setExportOpen(false)} notify={notify}/>}
  </div>
}
