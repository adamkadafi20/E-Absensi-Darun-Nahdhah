// Form jadwal setoran Tahfidz — hanya Super Admin yang boleh membuat/mengedit.
import { useMemo, useState } from 'react'
import { CalendarDays, Check, Search, TriangleAlert, Users, X } from 'lucide-react'
import { Badge, Button, Field, Modal, inputClass, toDateKey } from '../ui'
import { MUHAFIDZ_ACCOUNTS, findJadwalConflicts } from '../data/tahfidz'

const blankForm = () => ({ muhafidzId: '', branch: '', dorm: 'Semua Asrama', date: toDateKey(), startTime: '16:00', endTime: '17:00', santriNis: [] })

export default function JadwalForm({ editing, jadwalList, santri, onClose, onSave }) {
  const [form, setForm] = useState(() => editing ? { ...blankForm(), ...editing } : blankForm())
  const [errors, setErrors] = useState({})
  const [santriQuery, setSantriQuery] = useState('')
  const [acknowledge, setAcknowledge] = useState(false)
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const branches = useMemo(() => [...new Set(santri.map((s) => s.branch))], [santri])
  const dorms = useMemo(() => form.branch ? ['Semua Asrama', ...new Set(santri.filter((s) => s.branch === form.branch).map((s) => s.dorm))] : ['Semua Asrama'], [santri, form.branch])

  const candidateSantri = useMemo(() => santri.filter((s) =>
    (!form.branch || s.branch === form.branch) &&
    (form.dorm === 'Semua Asrama' || s.dorm === form.dorm) &&
    `${s.name} ${s.nis}`.toLowerCase().includes(santriQuery.toLowerCase())
  ), [santri, form.branch, form.dorm, santriQuery])

  const conflicts = useMemo(() => findJadwalConflicts(jadwalList, { ...form, id: editing?.id }, santri), [jadwalList, form, editing, santri])

  const changeBranch = (branch) => setForm((current) => ({ ...current, branch, dorm: 'Semua Asrama', santriNis: [] }))
  const changeDorm = (dorm) => setForm((current) => ({
    ...current,
    dorm,
    santriNis: current.santriNis.filter((nis) => {
      const s = santri.find((x) => x.nis === nis)
      return s && (dorm === 'Semua Asrama' || s.dorm === dorm)
    }),
  }))
  const toggleSantri = (nis) => setForm((current) => ({
    ...current,
    santriNis: current.santriNis.includes(nis) ? current.santriNis.filter((x) => x !== nis) : [...current.santriNis, nis],
  }))

  const validate = () => {
    const next = {}
    if (!form.muhafidzId) next.muhafidzId = 'Muhafidz/Muhafidzah wajib dipilih.'
    if (!form.branch) next.branch = 'Cabang wajib dipilih.'
    if (!form.date) next.date = 'Tanggal setoran wajib dipilih.'
    if (!form.startTime || !form.endTime) next.endTime = 'Jam mulai dan selesai wajib diisi.'
    else if (form.endTime <= form.startTime) next.endTime = 'Jam selesai harus lebih besar dari jam mulai.'
    if (form.santriNis.length === 0) next.santriNis = 'Pilih minimal satu santri yang ditugaskan.'
    if (conflicts.length && !acknowledge) next.conflicts = 'Ada potensi bentrok jadwal/penugasan ganda. Centang konfirmasi di bawah untuk tetap menyimpan.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = (event) => {
    event.preventDefault()
    if (!validate()) return
    onSave({
      muhafidzId: form.muhafidzId,
      branch: form.branch,
      dorm: form.dorm,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      santriNis: form.santriNis,
    })
  }

  return <Modal
    title={editing ? 'Edit Jadwal Setoran' : 'Tambah Jadwal Setoran'}
    subtitle="Pembagian santri kepada Muhafidz/Muhafidzah sepenuhnya dikendalikan Super Admin."
    icon={CalendarDays}
    size="lg"
    onClose={onClose}
    onSubmit={submit}
    footer={<>
      <Button variant="outline" onClick={onClose}>Batal</Button>
      <Button type="submit" icon={Check}>{editing ? 'Simpan Perubahan' : 'Simpan Jadwal'}</Button>
    </>}
  >
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      <Field label="Nama Muhafidz/Muhafidzah" required error={errors.muhafidzId} className="sm:col-span-2">
        <select value={form.muhafidzId} onChange={(event) => set('muhafidzId', event.target.value)} className={`${inputClass} ${errors.muhafidzId ? 'border-rose-300' : ''}`}>
          <option value="">— Pilih pengajar —</option>
          {MUHAFIDZ_ACCOUNTS.map((m) => <option key={m.id} value={m.id}>{m.name} · {m.role} · {m.branch}</option>)}
        </select>
      </Field>
      <Field label="Cabang" required error={errors.branch}>
        <select value={form.branch} onChange={(event) => changeBranch(event.target.value)} className={`${inputClass} ${errors.branch ? 'border-rose-300' : ''}`}>
          <option value="">— Pilih cabang —</option>
          {branches.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </Field>
      <Field label="Asrama" error={errors.dorm}>
        <select value={form.dorm} onChange={(event) => changeDorm(event.target.value)} disabled={!form.branch} className={`${inputClass} disabled:bg-stone-50`}>
          {dorms.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </Field>
      <Field label="Tanggal setoran" required error={errors.date}>
        <input type="date" value={form.date} onChange={(event) => set('date', event.target.value)} className={`${inputClass} ${errors.date ? 'border-rose-300' : ''}`} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Jam mulai" required>
          <input type="time" value={form.startTime} onChange={(event) => set('startTime', event.target.value)} className={inputClass} />
        </Field>
        <Field label="Jam selesai" required>
          <input type="time" value={form.endTime} onChange={(event) => set('endTime', event.target.value)} className={inputClass} />
        </Field>
        {errors.endTime && <p className="col-span-2 -mt-2 text-[10px] font-semibold text-rose-500">{errors.endTime}</p>}
      </div>
      <div className="sm:col-span-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-stone-600">Daftar santri yang ditugaskan <span className="text-rose-500">*</span></p>
          {form.santriNis.length > 0 && <button type="button" onClick={() => set('santriNis', [])} className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-400 hover:text-rose-500"><X size={12}/> Hapus pilihan ({form.santriNis.length})</button>}
        </div>
        <div className="mt-2 overflow-hidden rounded-xl border border-stone-200">
          <div className="flex items-center gap-2 border-b border-stone-100 bg-latte-50/70 px-3 py-2">
            <Search size={14} className="shrink-0 text-stone-400"/>
            <input value={santriQuery} onChange={(event) => setSantriQuery(event.target.value)} placeholder="Cari nama atau NIS santri..." className="w-full bg-transparent text-xs outline-none placeholder:text-stone-400" />
          </div>
          <div className="max-h-44 divide-y divide-stone-50 overflow-y-auto">
            {candidateSantri.map((s) => (
              <label key={s.nis} className="flex cursor-pointer items-center gap-3 px-3 py-2.5 transition hover:bg-latte-50/60">
                <input type="checkbox" checked={form.santriNis.includes(s.nis)} onChange={() => toggleSantri(s.nis)} className="rounded border-stone-300 accent-latte-700" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-latte-900">{s.name}</p>
                  <p className="mt-0.5 text-[10px] text-stone-400">{s.nis} · {s.dorm}</p>
                </div>
                <Badge tone={s.gender === 'Ikhwan' ? 'brown' : 'blue'}>{s.gender}</Badge>
              </label>
            ))}
            {candidateSantri.length === 0 && <p className="px-3 py-5 text-center text-xs text-stone-400">Tidak ada santri yang cocok. Pastikan cabang/asrama sudah dipilih atau ubah kata kunci pencarian.</p>}
          </div>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-stone-500"><Users size={13} className="text-latte-500"/>{form.santriNis.length} santri dipilih{form.santriNis.length > 0 ? `: ${form.santriNis.map((nis) => santri.find((s) => s.nis === nis)?.name || nis).join(', ')}` : ''}</p>
        {errors.santriNis && <p className="mt-1 text-[10px] font-semibold text-rose-500">{errors.santriNis}</p>}
      </div>
    </div>
    {conflicts.length > 0 && <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
      <p className="flex items-center gap-2 text-xs font-extrabold text-amber-700"><TriangleAlert size={14}/> Peringatan bentrok jadwal / penugasan ganda</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-[11px] leading-5 text-amber-700">{conflicts.map((c, i) => <li key={i}>{c}</li>)}</ul>
      <label className="mt-3 flex items-start gap-2 text-[11px] font-semibold text-amber-800">
        <input type="checkbox" checked={acknowledge} onChange={(event) => setAcknowledge(event.target.checked)} className="mt-0.5 rounded border-amber-300 accent-amber-600" />
        Saya paham ada bentrok; tetap simpan jadwal ini.
      </label>
    </div>}
    {errors.conflicts && <p className="mt-2 text-[10px] font-semibold text-rose-500">{errors.conflicts}</p>}
  </Modal>
}
