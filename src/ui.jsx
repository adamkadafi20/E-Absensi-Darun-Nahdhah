// Komponen dan helper UI bersama (tema hijau tanaman), dipakai semua modul.
import { useEffect } from 'react'
import {
  CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, ChevronRight as BreadcrumbChevron,
  CircleAlert, FileText, Search, TrendingUp, UserRound, Users, X,
} from 'lucide-react'

export const formatNumber = (n) => new Intl.NumberFormat('id-ID').format(n)

export const toDateKey = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const addDaysToKey = (days) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return toDateKey(date)
}

export const nowTimeValue = () => {
  const date = new Date()
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

export const formatDateID = (dateKey, options = { day: 'numeric', month: 'long', year: 'numeric' }) => {
  if (!dateKey) return '-'
  return new Intl.DateTimeFormat('id-ID', options).format(new Date(`${dateKey}T12:00:00`))
}

export const inputClass = 'mt-2 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm font-normal outline-none transition focus:border-leaf-400 focus:ring-2 focus:ring-leaf-100'

export function Badge({ children, tone = 'neutral' }) {
  const tones = {
    neutral: 'bg-stone-100 text-stone-600',
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-rose-50 text-rose-700',
    leaf: 'bg-leaf-100 text-leaf-700',
    blue: 'bg-sky-50 text-sky-700',
  }
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${tones[tone] || tones.neutral}`}>{children}</span>
}

export function Button({ children, variant = 'primary', onClick, icon: Icon, className = '', type = 'button', disabled = false }) {
  const styles = variant === 'primary'
    ? 'bg-leaf-700 text-white hover:bg-leaf-800 shadow-sm'
    : variant === 'outline'
      ? 'border border-leaf-200 bg-white text-leaf-800 hover:bg-leaf-50'
      : 'text-leaf-600 hover:bg-leaf-100'
  return <button type={type} onClick={onClick} disabled={disabled} className={`inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${styles} ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}>
    {Icon && <Icon size={15} strokeWidth={2.2} />}{children}
  </button>
}

export function StatCard({ label, value, change, icon: Icon, color, note }) {
  return <div className="rounded-2xl border border-[#e0e9de] bg-white p-5 shadow-soft">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold text-stone-500">{label}</p>
        <p className="mt-3 font-display text-3xl font-extrabold tracking-tight text-leaf-900">{value}</p>
      </div>
      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${color}`}><Icon size={20} /></div>
    </div>
    <div className="mt-4 flex items-center gap-2 text-[11px]">
      <span className="inline-flex items-center gap-1 font-extrabold text-emerald-700"><TrendingUp size={12}/>{change}</span>
      <span className="text-stone-400">{note}</span>
    </div>
  </div>
}

export function Avatar({ name, tone = 'leaf', size = 'md' }) {
  const colors = { leaf: 'bg-leaf-200 text-leaf-800', green: 'bg-[#e4efdf] text-[#4f8060]', blue: 'bg-sky-100 text-sky-700', rose: 'bg-rose-100 text-rose-700', gold: 'bg-amber-100 text-amber-700' }
  const sz = size === 'sm' ? 'h-8 w-8 text-[10px]' : size === 'lg' ? 'h-12 w-12 text-sm' : 'h-10 w-10 text-xs'
  return <div className={`flex ${sz} shrink-0 items-center justify-center rounded-xl font-extrabold ${colors[tone]}`}>{name.split(' ').slice(0, 2).map(s => s[0]).join('')}</div>
}

export function EmptyState({ title, desc }) {
  return <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-leaf-100 text-leaf-600"><FileText size={23}/></div>
    <h3 className="mt-4 font-display font-extrabold text-leaf-900">{title}</h3>
    <p className="mt-1 max-w-sm text-sm text-stone-500">{desc}</p>
  </div>
}

// Pembungkus field formulir dengan label dan pesan error.
export function Field({ label, required = false, className = '', error, children }) {
  return <label className={`block text-xs font-bold text-stone-600 ${className}`}>
    {label}{required && <span className="text-rose-500"> *</span>}
    {children}
    {error && <span className="mt-1 block text-[10px] font-semibold text-rose-500">{error}</span>}
  </label>
}

// Modal generik. Jika onSubmit diberikan, konten dibungkus form.
export function Modal({ title, subtitle, icon: Icon, onClose, children, footer, size = 'md', onSubmit }) {
  const widths = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }
  const Tag = onSubmit ? 'form' : 'div'
  return <div className="fixed inset-0 z-[80] flex items-center justify-center bg-leaf-900/40 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <Tag onSubmit={onSubmit} role="dialog" aria-modal="true" className={`max-h-[90vh] w-full ${widths[size] || widths.md} overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-6`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {Icon && <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf-100 text-leaf-700"><Icon size={19}/></div>}
          <h3 className="mt-3 font-display text-xl font-extrabold text-leaf-900">{title}</h3>
          {subtitle && <p className="mt-1 text-xs leading-5 text-stone-500">{subtitle}</p>}
        </div>
        <button type="button" onClick={onClose} aria-label="Tutup" className="shrink-0 rounded-xl p-2 text-stone-400 hover:bg-stone-100"><X size={18}/></button>
      </div>
      {children}
      {footer && <div className="mt-6 flex justify-end gap-2 border-t border-stone-100 pt-4">{footer}</div>}
    </Tag>
  </div>
}

export function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(onClose, 4200)
    return () => window.clearTimeout(timer)
  }, [toast, onClose])
  if (!toast) return null
  const tones = {
    success: { style: 'border-emerald-200 bg-emerald-50 text-emerald-800', icon: CheckCircle2 },
    error: { style: 'border-rose-200 bg-rose-50 text-rose-800', icon: CircleAlert },
    info: { style: 'border-leaf-200 bg-leaf-50 text-leaf-800', icon: CircleAlert },
  }
  const tone = tones[toast.tone] || tones.success
  return <div role="status" className={`fixed bottom-5 right-5 z-[95] flex max-w-sm items-start gap-2.5 rounded-2xl border px-4 py-3 text-xs font-semibold shadow-soft ${tone.style}`}>
    <tone.icon size={16} className="mt-0.5 shrink-0"/>{toast.message}
    <button type="button" onClick={onClose} aria-label="Tutup notifikasi" className="ml-1 shrink-0 opacity-60 hover:opacity-100"><X size={13}/></button>
  </div>
}

// Kotak pencarian toolbar tabel.
export function SearchInput({ value, onChange, placeholder, className = '' }) {
  return <div className={`relative min-w-[190px] flex-1 ${className}`}>
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={15}/>
    <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} aria-label={placeholder} className="w-full rounded-xl border border-stone-200 bg-leaf-50/50 py-2.5 pl-9 pr-3 text-xs outline-none transition focus:border-leaf-400"/>
  </div>
}

// Dropdown filter toolbar. options: string[] atau [{ value, label }].
export function FilterSelect({ icon: Icon, label, value, onChange, options, ariaLabel, className = '' }) {
  return <label className={`flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs font-semibold text-stone-500 ${className}`}>
    {Icon && <Icon size={14}/>}
    {label && <span className="hidden sm:inline">{label}</span>}
    <select aria-label={ariaLabel || label} value={value} onChange={(event) => onChange(event.target.value)} className="max-w-[160px] bg-transparent text-xs font-bold text-stone-700 outline-none">
      {options.map((option) => typeof option === 'string'
        ? <option key={option} value={option}>{option}</option>
        : <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
  </label>
}

export function FilterDate({ value, onChange, label = 'Tanggal' }) {
  return <label className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs font-semibold text-stone-500">
    <CalendarDays size={14}/><span className="hidden sm:inline">{label}</span>
    <input aria-label={`Filter ${label.toLowerCase()}`} type="date" value={value} onChange={(event) => onChange(event.target.value)} className="max-w-[145px] bg-transparent text-xs outline-none"/>
  </label>
}

// Filter rentang tanggal (dari – sampai). Keduanya opsional.
export function FilterDateRange({ from, to, onFrom, onTo, label = 'Tanggal' }) {
  return <div className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs font-semibold text-stone-500">
    <CalendarDays size={14} className="shrink-0"/>
    <span className="hidden shrink-0 sm:inline">{label}</span>
    <input aria-label={`${label} dari`} type="date" value={from} onChange={(event) => onFrom(event.target.value)} className="max-w-[125px] bg-transparent text-xs outline-none"/>
    <span className="shrink-0 text-stone-300">–</span>
    <input aria-label={`${label} sampai`} type="date" value={to} onChange={(event) => onTo(event.target.value)} className="max-w-[125px] bg-transparent text-xs outline-none"/>
  </div>
}

// Navigasi halaman tabel sederhana.
export function Pagination({ page, pageCount, onChange }) {
  if (pageCount <= 1) return null
  const start = Math.max(1, Math.min(page - 2, pageCount - 4))
  const pages = []
  for (let p = start; p < start + 5 && p <= pageCount; p++) pages.push(p)
  return <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 px-5 py-3">
    <p className="text-[11px] text-stone-400">Halaman {page} dari {pageCount}</p>
    <div className="flex items-center gap-1">
      <button aria-label="Halaman sebelumnya" disabled={page === 1} onClick={() => onChange(page - 1)} className="rounded-lg border border-stone-200 p-1.5 text-stone-400 transition enabled:hover:bg-leaf-50 disabled:opacity-40"><ChevronLeft size={14}/></button>
      {pages.map(p => <button key={p} onClick={() => onChange(p)} aria-label={`Halaman ${p}`} className={`h-7 min-w-7 rounded-lg px-2 text-[11px] font-bold transition ${p === page ? 'bg-leaf-700 text-white' : 'border border-stone-200 text-stone-500 hover:bg-leaf-50'}`}>{p}</button>)}
      <button aria-label="Halaman berikutnya" disabled={page === pageCount} onClick={() => onChange(page + 1)} className="rounded-lg border border-stone-200 p-1.5 text-stone-400 transition enabled:hover:bg-leaf-50 disabled:opacity-40"><ChevronRight size={14}/></button>
    </div>
  </div>
}

// Gerbang pilihan kategori santri. Ditampilkan pada modul Ikhwan/Akhwat
// saat pengguna belum memilih kategori — data tidak pernah tampil bercampur.
export function GenderGate({ title, description, setGenderFilter }) {
  const options = [
    { value: 'Ikhwan', label: 'Ikhwan', desc: 'Hanya menampilkan data santri putra pada seluruh tabel, statistik, dan hasil pencarian.', icon: Users },
    { value: 'Akhwat', label: 'Akhwat', desc: 'Hanya menampilkan data santri putri pada seluruh tabel, statistik, dan hasil pencarian.', icon: UserRound },
  ]
  return <div className="space-y-5">
    <div>
      <div className="flex items-center gap-2 text-xs text-stone-400"><span>Workspace</span><BreadcrumbChevron size={12}/><span className="font-bold text-leaf-700">{title}</span></div>
      <h2 className="mt-2 font-display text-2xl font-extrabold text-leaf-900">{title}</h2>
      <p className="mt-1 text-sm text-stone-500">{description}</p>
    </div>
    <section className="rounded-2xl border border-[#e0e9de] bg-white p-6 shadow-soft md:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-leaf-100 text-leaf-700"><Users size={20}/></div>
        <div>
          <h3 className="font-display text-lg font-extrabold text-leaf-900">Pilih Kategori Santri</h3>
          <p className="mt-0.5 text-xs text-stone-500">Data Ikhwan dan Akhwat ditampilkan terpisah — keduanya tidak pernah tercampur dalam satu tabel.</p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {options.map(option => (
          <button key={option.value} type="button" onClick={() => setGenderFilter(option.value)} className="group flex items-start gap-4 rounded-2xl border border-[#e0e9de] bg-white p-5 text-left transition hover:border-leaf-400 hover:bg-leaf-50">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-leaf-100 text-leaf-700 transition group-hover:bg-leaf-700 group-hover:text-white"><option.icon size={22}/></div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-base font-extrabold text-leaf-900">{option.label}</p>
              <p className="mt-1 text-xs leading-5 text-stone-500">{option.desc}</p>
              <p className="mt-2 text-[11px] font-bold text-leaf-600">Tampilkan data {option.label.toLowerCase()} →</p>
            </div>
          </button>
        ))}
      </div>
      <p className="mt-5 rounded-xl bg-leaf-50 px-4 py-3 text-[11px] leading-5 text-stone-500">
        Setelah memilih, kategori dapat diganti kapan saja melalui dropdown filter pada toolbar tabel atau submenu sidebar. Super Admin tetap dapat membuka kedua kategori secara bergantian.
      </p>
    </section>
  </div>
}
