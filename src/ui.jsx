// Komponen dan helper UI bersama, dipakai App.jsx dan modul Tahfidz.
import { useEffect } from 'react'
import { CalendarDays, CheckCircle2, CircleAlert, FileText, Search, TrendingUp, X } from 'lucide-react'

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

export const inputClass = 'mt-2 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm font-normal outline-none transition focus:border-latte-400 focus:ring-2 focus:ring-latte-100'

export function Badge({ children, tone = 'neutral' }) {
  const tones = {
    neutral: 'bg-stone-100 text-stone-600',
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-rose-50 text-rose-700',
    brown: 'bg-latte-100 text-latte-700',
    blue: 'bg-sky-50 text-sky-700',
  }
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${tones[tone] || tones.neutral}`}>{children}</span>
}

export function Button({ children, variant = 'primary', onClick, icon: Icon, className = '', type = 'button', disabled = false }) {
  const styles = variant === 'primary'
    ? 'bg-latte-700 text-white hover:bg-latte-800 shadow-sm'
    : variant === 'outline'
      ? 'border border-latte-200 bg-white text-latte-800 hover:bg-latte-50'
      : 'text-latte-600 hover:bg-latte-100'
  return <button type={type} onClick={onClick} disabled={disabled} className={`inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${styles} ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}>
    {Icon && <Icon size={15} strokeWidth={2.2} />}{children}
  </button>
}

export function StatCard({ label, value, change, icon: Icon, color, note }) {
  return <div className="rounded-2xl border border-[#eee5da] bg-white p-5 shadow-soft">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold text-stone-500">{label}</p>
        <p className="mt-3 font-display text-3xl font-extrabold tracking-tight text-latte-900">{value}</p>
      </div>
      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${color}`}><Icon size={20} /></div>
    </div>
    <div className="mt-4 flex items-center gap-2 text-[11px]">
      <span className="inline-flex items-center gap-1 font-extrabold text-emerald-700"><TrendingUp size={12}/>{change}</span>
      <span className="text-stone-400">{note}</span>
    </div>
  </div>
}

export function Avatar({ name, tone = 'brown', size = 'md' }) {
  const colors = { brown: 'bg-latte-200 text-latte-800', green: 'bg-[#e5eee1] text-[#5e7655]', blue: 'bg-sky-100 text-sky-700', rose: 'bg-rose-100 text-rose-700', gold: 'bg-amber-100 text-amber-700' }
  const sz = size === 'sm' ? 'h-8 w-8 text-[10px]' : 'h-10 w-10 text-xs'
  return <div className={`flex ${sz} shrink-0 items-center justify-center rounded-xl font-extrabold ${colors[tone]}`}>{name.split(' ').slice(0, 2).map(s => s[0]).join('')}</div>
}

export function EmptyState({ title, desc }) {
  return <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-latte-100 text-latte-600"><FileText size={23}/></div>
    <h3 className="mt-4 font-display font-extrabold text-latte-900">{title}</h3>
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
  return <div className="fixed inset-0 z-[80] flex items-center justify-center bg-latte-900/40 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <Tag onSubmit={onSubmit} role="dialog" aria-modal="true" className={`max-h-[90vh] w-full ${widths[size] || widths.md} overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-6`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {Icon && <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-latte-100 text-latte-700"><Icon size={19}/></div>}
          <h3 className="mt-3 font-display text-xl font-extrabold text-latte-900">{title}</h3>
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
    info: { style: 'border-latte-200 bg-latte-50 text-latte-800', icon: CircleAlert },
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
    <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} aria-label={placeholder} className="w-full rounded-xl border border-stone-200 bg-latte-50/50 py-2.5 pl-9 pr-3 text-xs outline-none transition focus:border-latte-400"/>
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
