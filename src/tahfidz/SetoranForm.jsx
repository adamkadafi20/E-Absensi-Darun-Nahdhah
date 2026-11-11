// Form input hasil setoran Tahfidz — dicatat oleh Muhafidz/Muhafidzah.
// Santri hanya bisa dipilih dari daftar penugasan jadwal aktif.
import { useState } from 'react'
import { BookOpen, Check } from 'lucide-react'
import { Badge, Button, Field, Modal, inputClass, nowTimeValue, toDateKey } from '../ui'
import { KATEGORI_SETORAN, KETERANGAN_SETORAN, PENILAIAN_SETORAN, SURAH_LIST } from '../data/tahfidz'

export default function SetoranForm({ jadwal, santriList, preselectedNis, onClose, onSubmit }) {
  const [form, setForm] = useState(() => ({
    santriNis: preselectedNis || '',
    kategori: '',
    halaman: 1,
    juz: '',
    surah: '',
    noHalaman: '',
    keterangan: '',
    penilaian: '',
    tanggal: jadwal?.date || toDateKey(),
    waktu: nowTimeValue(),
    catatan: '',
  }))
  const [errors, setErrors] = useState({})
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const selectedSantri = santriList.find((s) => s.nis === form.santriNis)

  const validate = () => {
    const next = {}
    if (!form.santriNis || !jadwal.santriNis.includes(form.santriNis)) next.santriNis = 'Pilih santri dari jadwal penugasan.'
    if (!form.kategori) next.kategori = 'Kategori setoran wajib dipilih.'
    const halaman = Number(form.halaman)
    if (!Number.isInteger(halaman) || halaman < 1 || halaman > 20) next.halaman = 'Jumlah halaman harus 1–20.'
    if (!form.juz || Number(form.juz) < 1 || Number(form.juz) > 30) next.juz = 'Juz harus 1–30.'
    if (!form.surah) next.surah = 'Surat wajib dipilih.'
    const awal = Number(form.noHalaman)
    if (!awal || awal < 1 || awal > 604) next.noHalaman = 'Nomor halaman harus 1–604.'
    else if (awal + halaman - 1 > 604) next.noHalaman = `Halaman awal + jumlah halaman melebihi halaman 604 (maksimal awal ${605 - halaman}).`
    if (!form.keterangan) next.keterangan = 'Keterangan wajib dipilih.'
    if (!form.penilaian) next.penilaian = 'Penilaian wajib dipilih.'
    if (!form.tanggal) next.tanggal = 'Tanggal setoran wajib diisi.'
    if (!form.waktu) next.waktu = 'Waktu setoran wajib diisi.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = (event) => {
    event.preventDefault()
    if (!validate()) return
    onSubmit({
      jadwalId: jadwal.id,
      santriNis: form.santriNis,
      kategori: form.kategori,
      halaman: Number(form.halaman),
      juz: Number(form.juz),
      surah: Number(form.surah),
      noHalaman: Number(form.noHalaman),
      keterangan: form.keterangan,
      penilaian: form.penilaian,
      tanggal: form.tanggal,
      waktu: form.waktu,
      catatan: form.catatan.trim(),
    })
  }

  return <Modal
    title="Input Setoran Tahfidz"
    subtitle="Penilaian hafalan diberikan langsung oleh Muhafidz/Muhafidzah — tidak dihitung otomatis."
    icon={BookOpen}
    size="lg"
    onClose={onClose}
    onSubmit={submit}
    footer={<>
      <Button variant="outline" onClick={onClose}>Batal</Button>
      <Button type="submit" icon={Check}>Simpan Setoran</Button>
    </>}
  >
    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl bg-latte-50 px-3.5 py-3 text-[11px] font-semibold text-stone-600">
      <span className="text-latte-800">Jadwal aktif:</span>
      <span>{jadwal.date} · {jadwal.startTime}–{jadwal.endTime} WIB</span>
      <span>·</span>
      <span>{jadwal.branch} / {jadwal.dorm}</span>
    </div>
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      {preselectedNis ? (
        <div className="sm:col-span-2">
          <Field label="Nama santri" required>
            <input readOnly value={`${selectedSantri?.name || '-'} · ${form.santriNis}`} className={`${inputClass} bg-latte-50`} />
          </Field>
        </div>
      ) : (
        <div className="sm:col-span-2">
          <Field label="Nama santri (hanya santri yang ditugaskan)" required error={errors.santriNis}>
            <select value={form.santriNis} onChange={(event) => set('santriNis', event.target.value)} className={`${inputClass} ${errors.santriNis ? 'border-rose-300' : ''}`}>
              <option value="">— Pilih santri —</option>
              {santriList.map((s) => <option key={s.nis} value={s.nis}>{s.nis} · {s.name} ({s.gender})</option>)}
            </select>
          </Field>
        </div>
      )}
      {selectedSantri && <div className="sm:col-span-2 flex flex-wrap items-center gap-2"><Badge tone={selectedSantri.gender === 'Ikhwan' ? 'brown' : 'blue'}>{selectedSantri.gender}</Badge><Badge tone="neutral">{selectedSantri.branch}</Badge><Badge tone="neutral">{selectedSantri.dorm}</Badge></div>}
      <Field label="Kategori" required error={errors.kategori}>
        <select value={form.kategori} onChange={(event) => set('kategori', event.target.value)} className={`${inputClass} ${errors.kategori ? 'border-rose-300' : ''}`}>
          <option value="">— Pilih kategori —</option>
          {KATEGORI_SETORAN.map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
      </Field>
      <Field label="Jumlah halaman (1–20)" required error={errors.halaman}>
        <input type="number" min={1} max={20} step={1} value={form.halaman} onChange={(event) => set('halaman', event.target.value)} className={`${inputClass} ${errors.halaman ? 'border-rose-300' : ''}`} placeholder="1–20" />
      </Field>
      <Field label="Juz (1–30)" required error={errors.juz}>
        <select value={form.juz} onChange={(event) => set('juz', event.target.value)} className={`${inputClass} ${errors.juz ? 'border-rose-300' : ''}`}>
          <option value="">— Pilih juz —</option>
          {Array.from({ length: 30 }, (_, i) => i + 1).map((j) => <option key={j} value={j}>Juz {j}</option>)}
        </select>
      </Field>
      <Field label="Surat (Al-Fatihah – An-Nas)" required error={errors.surah}>
        <select value={form.surah} onChange={(event) => set('surah', event.target.value)} className={`${inputClass} ${errors.surah ? 'border-rose-300' : ''}`}>
          <option value="">— Pilih surat —</option>
          {SURAH_LIST.map((name, i) => <option key={name} value={i + 1}>{i + 1} · {name}</option>)}
        </select>
      </Field>
      <Field label="No. halaman (1–604)" required error={errors.noHalaman}>
        <input type="number" min={1} max={604} step={1} value={form.noHalaman} onChange={(event) => set('noHalaman', event.target.value)} className={`${inputClass} ${errors.noHalaman ? 'border-rose-300' : ''}`} placeholder="Halaman awal setoran" />
      </Field>
      <Field label="Keterangan" required error={errors.keterangan}>
        <select value={form.keterangan} onChange={(event) => set('keterangan', event.target.value)} className={`${inputClass} ${errors.keterangan ? 'border-rose-300' : ''}`}>
          <option value="">— Pilih keterangan —</option>
          {KETERANGAN_SETORAN.map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
      </Field>
      <Field label="Penilaian hafalan" required error={errors.penilaian}>
        <select value={form.penilaian} onChange={(event) => set('penilaian', event.target.value)} className={`${inputClass} ${errors.penilaian ? 'border-rose-300' : ''}`}>
          <option value="">— Pilih penilaian —</option>
          {PENILAIAN_SETORAN.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </Field>
      <Field label="Tanggal setoran" required error={errors.tanggal}>
        <input type="date" value={form.tanggal} onChange={(event) => set('tanggal', event.target.value)} className={`${inputClass} ${errors.tanggal ? 'border-rose-300' : ''}`} />
      </Field>
      <Field label="Waktu setoran" required error={errors.waktu}>
        <input type="time" value={form.waktu} onChange={(event) => set('waktu', event.target.value)} className={`${inputClass} ${errors.waktu ? 'border-rose-300' : ''}`} />
      </Field>
      <Field label="Catatan tambahan (opsional)" className="sm:col-span-2">
        <textarea rows={3} value={form.catatan} onChange={(event) => set('catatan', event.target.value)} className={`${inputClass} resize-y`} placeholder="Catatan Muhafidz/Muhafidzah untuk setoran ini..." />
      </Field>
    </div>
    <p className="mt-4 rounded-xl border border-dashed border-latte-200 bg-latte-50 px-3.5 py-3 text-[11px] leading-5 text-stone-500">
      Validasi: jumlah halaman 1–20 · juz 1–30 · nomor halaman 1–604 · jumlah halaman + halaman awal tidak boleh melebihi halaman 604. Santri harus terdaftar pada jadwal penugasan.
    </p>
  </Modal>
}
