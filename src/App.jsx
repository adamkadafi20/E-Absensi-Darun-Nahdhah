import { useEffect, useMemo, useState } from 'react'
import {
  Activity, AlarmClock, ArrowDownRight, ArrowRight, Award, Bell, BookOpen,
  Building2, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight,
  CircleHelp, ClipboardCheck, Download, FileText, Filter, GraduationCap,
  House, LayoutDashboard, LogOut, Menu, MoreHorizontal, Search, Settings,
  ShieldCheck, SlidersHorizontal, Sparkles, Users, UserRound, UserCog,
  X, Moon, Sun, HeartHandshake, BookMarked, Clock3, TrendingUp, MapPin,
  Plus, Pencil, Trash2, Eye, LockKeyhole, KeyRound, ChevronUp, BadgeCheck,
  CircleAlert, CalendarCheck, ChartNoAxesCombined, PanelLeftClose
} from 'lucide-react'

const navGroups = [
  { label: 'WORKSPACE', items: [
    ['Dashboard', LayoutDashboard],
    ['Absensi Sholat', ClipboardCheck],
    ['Absensi Kegiatan', CalendarCheck],
    ['Tahfidz', BookOpen],
    ['Data Santri', Users],
    ['Kegiatan', CalendarDays],
  ]},
  { label: 'PEMBINAAN', items: [
    ['Hukuman', ShieldCheck],
    ['Reward', Award],
    ['Asrama', House],
    ['Cabang', Building2],
  ]},
  { label: 'SISTEM', items: [
    ['Laporan PDF', FileText],
    ['Pengguna & Role', UserCog],
    ['Audit Log', Activity],
    ['Pengaturan', Settings],
  ]},
]

const initialSantri = [
  { nis: 'DN-24001', name: 'Ahmad Fauzan', gender: 'Ikhwan', branch: 'Pusat Darun Nahdhah', dorm: 'Asrama Al-Falah', status: 'Aktif', attendance: 96, tahfidz: '8 Juz' },
  { nis: 'DN-24002', name: 'Muhammad Rizki', gender: 'Ikhwan', branch: 'Pusat Darun Nahdhah', dorm: 'Asrama Al-Ikhlas', status: 'Aktif', attendance: 91, tahfidz: '5 Juz' },
  { nis: 'DN-24003', name: 'Aisyah Humaira', gender: 'Akhwat', branch: 'Cabang Depok', dorm: 'Asrama An-Nisa', status: 'Aktif', attendance: 98, tahfidz: '10 Juz' },
  { nis: 'DN-24004', name: 'Fatimah Zahra', gender: 'Akhwat', branch: 'Cabang Depok', dorm: 'Asrama An-Nisa', status: 'Aktif', attendance: 94, tahfidz: '6 Juz' },
  { nis: 'DN-24005', name: 'Abdullah Hakim', gender: 'Ikhwan', branch: 'Cabang Bogor', dorm: 'Asrama Al-Falah', status: 'Perlu perhatian', attendance: 76, tahfidz: '3 Juz' },
  { nis: 'DN-24006', name: 'Nadia Safitri', gender: 'Akhwat', branch: 'Cabang Bogor', dorm: 'Asrama An-Nisa', status: 'Aktif', attendance: 89, tahfidz: '4 Juz' },
]

const activityRows = [
  { title: 'Sholat Subuh berjamaah', type: 'Sholat', time: '04.30', present: 184, total: 192, status: 'Selesai' },
  { title: 'Setoran tahfidz pagi', type: 'Tahfidz', time: '06.00', present: 176, total: 192, status: 'Berlangsung' },
  { title: 'Kajian Kitab Akhlak', type: 'Kegiatan', time: '08.00', present: 188, total: 192, status: 'Terjadwal' },
  { title: 'Sholat Dzuhur berjamaah', type: 'Sholat', time: '12.15', present: 0, total: 192, status: 'Terjadwal' },
]

const formatNumber = (n) => new Intl.NumberFormat('id-ID').format(n)

const toDateKey = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const addDaysToKey = (days) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return toDateKey(date)
}

const formatDateID = (dateKey, options = { day: 'numeric', month: 'long', year: 'numeric' }) => {
  if (!dateKey) return '-'
  return new Intl.DateTimeFormat('id-ID', options).format(new Date(`${dateKey}T12:00:00`))
}

const createInitialActivities = () => [
  { id: 'event-1', title: 'Kajian Kitab Akhlak', category: 'Kegiatan', date: addDaysToKey(0), time: '08:00', participants: 'Semua santri', branch: 'Pusat Darun Nahdhah', location: 'Aula utama', notes: 'Kajian rutin bersama pengasuh.' },
  { id: 'event-2', title: 'Setoran Tahfidz Bersama', category: 'Tahfidz', date: addDaysToKey(1), time: '06:00', participants: 'Kelompok tahfidz', branch: 'Semua Cabang', location: 'Ruang tahfidz', notes: 'Bawa buku mutabaah hafalan.' },
  { id: 'event-3', title: 'Muhadharah Santri', category: 'Kegiatan', date: addDaysToKey(3), time: '19:30', participants: 'Ikhwan dan akhwat', branch: 'Cabang Depok', location: 'Aula cabang', notes: 'Latihan pidato bahasa Arab dan Indonesia.' },
  { id: 'event-4', title: 'Evaluasi Pekanan Asrama', category: 'Pembinaan', date: addDaysToKey(6), time: '16:00', participants: 'Pengurus asrama', branch: 'Cabang Bogor', location: 'Ruang musyrif', notes: 'Evaluasi kedisiplinan dan program pekanan.' },
]

function Brand({ compact = false }) {
  return <div className="flex items-center gap-3">
    <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-latte-700 text-white shadow-soft">
      <span className="font-display text-lg font-extrabold">د</span>
      <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-latte-50 bg-[#a8b79b]" />
    </div>
    {!compact && <div className="min-w-0">
      <p className="font-display text-sm font-extrabold tracking-tight text-latte-900">Darun Nahdhah</p>
      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[.19em] text-latte-500">E-Absensi System</p>
    </div>}
  </div>
}

function Badge({ children, tone = 'neutral' }) {
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

function Button({ children, variant = 'primary', onClick, icon: Icon, className = '', type = 'button' }) {
  const styles = variant === 'primary'
    ? 'bg-latte-700 text-white hover:bg-latte-800 shadow-sm'
    : variant === 'outline'
      ? 'border border-latte-200 bg-white text-latte-800 hover:bg-latte-50'
      : 'text-latte-600 hover:bg-latte-100'
  return <button type={type} onClick={onClick} className={`inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${styles} ${className}`}>
    {Icon && <Icon size={15} strokeWidth={2.2} />}{children}
  </button>
}

function StatCard({ label, value, change, icon: Icon, color, note }) {
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

function Avatar({ name, tone = 'brown', size = 'md' }) {
  const colors = { brown: 'bg-latte-200 text-latte-800', green: 'bg-[#e5eee1] text-[#5e7655]', blue: 'bg-sky-100 text-sky-700', rose: 'bg-rose-100 text-rose-700', gold: 'bg-amber-100 text-amber-700' }
  const sz = size === 'sm' ? 'h-8 w-8 text-[10px]' : 'h-10 w-10 text-xs'
  return <div className={`flex ${sz} shrink-0 items-center justify-center rounded-xl font-extrabold ${colors[tone]}`}>{name.split(' ').slice(0, 2).map(s => s[0]).join('')}</div>
}

function EmptyState({ title, desc }) {
  return <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-latte-100 text-latte-600"><FileText size={23}/></div>
    <h3 className="mt-4 font-display font-extrabold text-latte-900">{title}</h3>
    <p className="mt-1 max-w-sm text-sm text-stone-500">{desc}</p>
  </div>
}

function CalendarWidget({ activities }) {
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState(toDateKey())
  const [detailOpen, setDetailOpen] = useState(false)
  const monthLabel = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(month)
  const firstWeekday = (month.getDay() + 6) % 7
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7
  const cells = Array.from({ length: totalCells }, (_, index) => {
    const day = index - firstWeekday + 1
    return day > 0 && day <= daysInMonth ? day : null
  })
  const eventMap = useMemo(() => activities.reduce((map, item) => {
    if (!map[item.date]) map[item.date] = []
    map[item.date].push(item)
    return map
  }, {}), [activities])
  const eventsOnSelectedDate = eventMap[selectedDate] || []
  const todayKey = toDateKey()
  const changeMonth = (amount) => setMonth(current => new Date(current.getFullYear(), current.getMonth() + amount, 1))
  const pickDate = (day) => {
    if (!day) return
    const key = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    setSelectedDate(key)
    setDetailOpen(true)
  }
  const dotColor = (category) => category === 'Tahfidz' ? 'bg-emerald-600' : category === 'Sholat' ? 'bg-amber-500' : category === 'Pembinaan' ? 'bg-rose-500' : 'bg-latte-600'

  return <>
    <section className="rounded-2xl border border-[#eee5da] bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-latte-100 text-latte-700"><CalendarDays size={17}/></div><div><h3 className="font-display text-base font-extrabold text-latte-900">Kalender kegiatan</h3><p className="mt-1 text-xs text-stone-500">Klik tanggal bertitik untuk melihat pengingat.</p></div></div>
        </div>
        <div className="flex items-center gap-1">
          <button aria-label="Bulan sebelumnya" onClick={() => changeMonth(-1)} className="rounded-lg border border-latte-100 p-2 text-latte-700 hover:bg-latte-50"><ChevronLeft size={15}/></button>
          <button aria-label="Bulan berikutnya" onClick={() => changeMonth(1)} className="rounded-lg border border-latte-100 p-2 text-latte-700 hover:bg-latte-50"><ChevronRight size={15}/></button>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between gap-2"><h4 className="font-display text-sm font-extrabold capitalize text-latte-900">{monthLabel}</h4><button onClick={() => { const now = new Date(); setMonth(new Date(now.getFullYear(), now.getMonth(), 1)); setSelectedDate(todayKey); setDetailOpen(true) }} className="rounded-lg px-2.5 py-1.5 text-[10px] font-extrabold text-latte-700 hover:bg-latte-50">Hari ini</button></div>
      <div className="mt-3 grid grid-cols-7 gap-1 text-center">
        {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map(day => <div key={day} className="py-2 text-[10px] font-bold text-stone-400">{day}</div>)}
        {cells.map((day, index) => {
          if (!day) return <div key={`empty-${index}`} className="min-h-[48px] rounded-xl" />
          const key = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const dayEvents = eventMap[key] || []
          const isToday = key === todayKey
          const isSelected = key === selectedDate
          return <button key={key} onClick={() => pickDate(day)} aria-label={`${day} ${monthLabel}${dayEvents.length ? `, ${dayEvents.length} kegiatan` : ''}`} className={`relative flex min-h-[48px] flex-col items-center justify-start rounded-xl px-1 py-2 transition ${isSelected ? 'bg-latte-700 text-white shadow-sm' : isToday ? 'border border-latte-300 bg-latte-50 text-latte-800' : 'text-stone-600 hover:bg-latte-50'}`}>
            <span className="text-xs font-bold">{day}</span>
            {dayEvents.length > 0 && <span className="mt-1 flex max-w-full items-center justify-center gap-0.5">{dayEvents.slice(0, 3).map((event, dotIndex) => <span key={`${event.id}-${dotIndex}`} className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white' : dotColor(event.category)}`} />)}</span>}
            {dayEvents.length > 1 && <span className={`mt-0.5 text-[8px] font-bold ${isSelected ? 'text-white/80' : 'text-stone-400'}`}>{dayEvents.length} agenda</span>}
          </button>
        })}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-stone-100 pt-3">
        <span className="flex items-center gap-1.5 text-[10px] text-stone-500"><span className="h-2 w-2 rounded-full bg-latte-600"/>Kegiatan</span>
        <span className="flex items-center gap-1.5 text-[10px] text-stone-500"><span className="h-2 w-2 rounded-full bg-emerald-600"/>Tahfidz</span>
        <span className="flex items-center gap-1.5 text-[10px] text-stone-500"><span className="h-2 w-2 rounded-full bg-amber-500"/>Sholat</span>
        <span className="ml-auto text-[10px] font-semibold text-latte-700">{activities.length} agenda tersimpan</span>
      </div>
      {eventsOnSelectedDate.length > 0 && <div className="mt-4 rounded-xl bg-latte-50 p-3"><div className="flex items-center justify-between gap-2"><div><p className="text-[10px] font-bold uppercase tracking-wider text-latte-600">Agenda terdekat</p><p className="mt-1 text-xs font-extrabold text-latte-900">{eventsOnSelectedDate[0].title}</p></div><button onClick={() => setDetailOpen(true)} className="shrink-0 rounded-lg bg-white px-3 py-2 text-[10px] font-extrabold text-latte-700 shadow-sm hover:bg-latte-100">Lihat detail</button></div><p className="mt-1 text-[10px] text-stone-500">{formatDateID(selectedDate)} · {eventsOnSelectedDate[0].time} WIB</p></div>}
    </section>
    {detailOpen && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-latte-900/40 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setDetailOpen(false) }}>
      <div role="dialog" aria-modal="true" aria-labelledby="calendar-detail-title" className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between bg-latte-800 p-5 text-white"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-latte-200">Pengingat kegiatan</p><h3 id="calendar-detail-title" className="mt-2 font-display text-xl font-extrabold capitalize">{formatDateID(selectedDate)}</h3><p className="mt-1 text-xs text-latte-100/75">{eventsOnSelectedDate.length} kegiatan pada tanggal ini</p></div><button onClick={() => setDetailOpen(false)} aria-label="Tutup detail" className="rounded-xl bg-white/10 p-2 text-white hover:bg-white/20"><X size={17}/></button></div>
        <div className="max-h-[60vh] space-y-3 overflow-y-auto p-5">
          {eventsOnSelectedDate.length === 0 ? <div className="py-8 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-latte-50 text-latte-500"><CalendarDays size={21}/></div><p className="mt-3 text-sm font-extrabold text-latte-900">Belum ada kegiatan</p><p className="mt-1 text-xs text-stone-500">Belum ada agenda yang dijadwalkan pada tanggal ini.</p></div> : eventsOnSelectedDate.slice().sort((a, b) => a.time.localeCompare(b.time)).map(event => <div key={event.id} className="rounded-2xl border border-stone-100 p-4"><div className="flex items-start gap-3"><div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${event.category === 'Tahfidz' ? 'bg-emerald-50 text-emerald-700' : event.category === 'Sholat' ? 'bg-amber-50 text-amber-700' : event.category === 'Pembinaan' ? 'bg-rose-50 text-rose-700' : 'bg-latte-100 text-latte-700'}`}><CalendarDays size={18}/></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-2"><h4 className="text-sm font-extrabold text-latte-900">{event.title}</h4><Badge tone={event.category === 'Tahfidz' ? 'green' : event.category === 'Sholat' ? 'amber' : event.category === 'Pembinaan' ? 'red' : 'brown'}>{event.category}</Badge></div><div className="mt-3 grid gap-2 sm:grid-cols-2"><p className="flex items-center gap-2 text-xs text-stone-600"><Clock3 size={14} className="text-latte-500"/>{event.time} WIB</p><p className="flex items-center gap-2 text-xs text-stone-600"><Users size={14} className="text-latte-500"/>{event.participants}</p><p className="flex items-center gap-2 text-xs text-stone-600"><Building2 size={14} className="text-latte-500"/>{event.branch}</p>{event.location && <p className="flex items-center gap-2 text-xs text-stone-600"><MapPin size={14} className="text-latte-500"/>{event.location}</p>}</div>{event.notes && <p className="mt-3 border-t border-stone-100 pt-3 text-xs leading-5 text-stone-500">{event.notes}</p>}</div></div></div>)}
        </div>
        <div className="flex justify-end border-t border-stone-100 p-4"><Button variant="outline" onClick={() => setDetailOpen(false)}>Tutup</Button><Button onClick={() => { setDetailOpen(false); window.dispatchEvent(new CustomEvent('navigate', { detail: 'Kegiatan' })) }} icon={ArrowRight}>Buka halaman kegiatan</Button></div>
      </div>
    </div>}
  </>
}

function Dashboard({ role, santri, activities }) {
  const isSuper = role === 'Super Admin'
  const [liveNow, setLiveNow] = useState(() => new Date())
  useEffect(() => {
    const timer = window.setInterval(() => setLiveNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  const todayLabel = new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(liveNow)
  const timeLabel = new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).format(liveNow)
  return <div className="space-y-6">
    <div className="relative overflow-hidden rounded-[26px] bg-latte-800 p-6 text-white md:p-8">
      <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border border-white/10" />
      <div className="absolute -right-1 top-5 h-44 w-44 rounded-full border border-white/10" />
      <div className="absolute bottom-0 right-28 h-24 w-24 rounded-full bg-latte-500/20 blur-2xl" />
      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.17em] text-latte-100"><Sparkles size={12}/> Ringkasan hari ini · {todayLabel}</div>
        <div className="mt-4 inline-flex flex-wrap items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2"><span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-70"></span><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300"></span></span><span className="text-[10px] font-extrabold uppercase tracking-[.14em] text-emerald-100">REAL TIME</span><span className="text-xs font-bold tabular-nums text-white">{timeLabel} WIB</span><span className="text-[10px] text-latte-100/70">· Jam live, data dashboard masih demo</span></div>
        <h2 className="mt-5 font-display text-2xl font-extrabold leading-tight md:text-3xl">Assalamu’alaikum, {isSuper ? 'Pengelola Darun Nahdhah' : 'Admin Cabang'} <span className="inline-block">✦</span></h2>
        <p className="mt-2 max-w-lg text-sm leading-6 text-latte-100/80">Pantau kedisiplinan, aktivitas ibadah, dan perkembangan santri dari satu ruang kerja yang terintegrasi.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'Absensi Sholat' }))} className="!bg-white !text-latte-800 hover:!bg-latte-100" icon={ClipboardCheck}>Input Absensi</Button>
          <Button variant="ghost" onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'Laporan PDF' }))} className="!text-white hover:!bg-white/10" icon={ArrowRight}>Lihat Laporan</Button>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 hidden h-full w-[36%] items-end justify-center md:flex">
        <div className="mb-[-22px] mr-10 flex h-52 w-52 items-center justify-center rounded-t-full border border-white/15 bg-white/[.06]">
          <div className="flex h-36 w-36 items-center justify-center rounded-t-full border border-white/20 bg-white/[.05]">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10"><BookOpen size={34} strokeWidth={1.2}/></div>
          </div>
        </div>
      </div>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total Santri" value={formatNumber(isSuper ? 1248 : 192)} change="+8,2%" note="vs bulan lalu" icon={Users} color="bg-latte-100 text-latte-700"/>
      <StatCard label="Kehadiran Sholat" value="94,8%" change="+2,4%" note="rata-rata hari ini" icon={ClipboardCheck} color="bg-[#e8f0e4] text-[#637d5a]"/>
      <StatCard label="Setoran Tahfidz" value={formatNumber(isSuper ? 326 : 48)} change="+12,6%" note="setoran minggu ini" icon={BookOpen} color="bg-[#f8ead8] text-[#a16d35]"/>
      <StatCard label="Perlu Perhatian" value={formatNumber(isSuper ? 27 : 8)} change="−3 santri" note="dari minggu lalu" icon={HeartHandshake} color="bg-[#f9e7e3] text-[#b66c5e]"/>
    </div>

    <CalendarWidget activities={activities} />

    <div className="grid gap-5 xl:grid-cols-[1.45fr_1fr]">
      <section className="rounded-2xl border border-[#eee5da] bg-white p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h3 className="font-display text-base font-extrabold text-latte-900">Kehadiran santri</h3><p className="mt-1 text-xs text-stone-500">Persentase kehadiran 7 hari terakhir</p></div>
          <button className="inline-flex items-center gap-2 rounded-lg border border-latte-100 px-3 py-2 text-[11px] font-bold text-latte-700">Minggu ini <ChevronDown size={13}/></button>
        </div>
        <div className="mt-7 flex h-44 items-end justify-between gap-3 px-1">
          {[['Sab',68,78],['Min',78,86],['Sen',74,82],['Sel',85,92],['Rab',80,88],['Kam',90,96],['Jum',86,94]].map(([day, a, b]) => <div className="flex flex-1 flex-col items-center gap-2" key={day}>
            <div className="flex h-36 w-full items-end justify-center gap-1.5">
              <div className="w-[36%] rounded-t-md bg-latte-200 transition-all" style={{height: `${a}%`}}/>
              <div className="w-[36%] rounded-t-md bg-latte-700 transition-all" style={{height: `${b}%`}}/>
            </div><span className="text-[10px] font-semibold text-stone-400">{day}</span>
          </div>)}
        </div>
        <div className="mt-4 flex items-center justify-center gap-5 border-t border-stone-100 pt-4">
          <span className="flex items-center gap-2 text-[11px] font-semibold text-stone-500"><span className="h-2.5 w-2.5 rounded-sm bg-latte-200"/>Kegiatan</span>
          <span className="flex items-center gap-2 text-[11px] font-semibold text-stone-500"><span className="h-2.5 w-2.5 rounded-sm bg-latte-700"/>Sholat berjamaah</span>
        </div>
      </section>

      <section className="rounded-2xl border border-[#eee5da] bg-white p-5 shadow-soft">
        <div className="flex items-start justify-between"><div><h3 className="font-display text-base font-extrabold text-latte-900">Komposisi santri</h3><p className="mt-1 text-xs text-stone-500">Berdasarkan kategori</p></div><button className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-50"><MoreHorizontal size={18}/></button></div>
        <div className="mt-5 flex items-center gap-5">
          <div className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-full" style={{background: 'conic-gradient(#846044 0 57%, #d9c5ae 57% 100%)'}}>
            <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white"><span className="font-display text-2xl font-extrabold text-latte-900">{isSuper ? '1.248' : '192'}</span><span className="text-[10px] text-stone-400">Santri</span></div>
          </div>
          <div className="min-w-0 flex-1 space-y-4">
            <div><div className="flex items-center justify-between text-xs"><span className="flex items-center gap-2 font-semibold text-stone-600"><span className="h-2.5 w-2.5 rounded-full bg-latte-700"/>Ikhwan</span><strong className="text-latte-900">57%</strong></div><p className="mt-1 text-[10px] text-stone-400">{isSuper ? '711' : '109'} santri</p></div>
            <div><div className="flex items-center justify-between text-xs"><span className="flex items-center gap-2 font-semibold text-stone-600"><span className="h-2.5 w-2.5 rounded-full bg-latte-300"/>Akhwat</span><strong className="text-latte-900">43%</strong></div><p className="mt-1 text-[10px] text-stone-400">{isSuper ? '537' : '83'} santri</p></div>
          </div>
        </div>
        <div className="mt-5 rounded-xl bg-latte-50 p-3.5"><div className="flex items-center gap-2 text-xs font-bold text-latte-800"><Sparkles size={14}/>Insight singkat</div><p className="mt-1.5 text-[11px] leading-5 text-stone-500">Kehadiran sholat meningkat 2,4% dibanding periode sebelumnya. Pertahankan konsistensi pembinaan.</p></div>
      </section>
    </div>

    <section className="rounded-2xl border border-[#eee5da] bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-display text-base font-extrabold text-latte-900">Aktivitas hari ini</h3><p className="mt-1 text-xs text-stone-500">Jadwal dan ringkasan kehadiran terbaru</p></div><Button variant="outline" onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'Kegiatan' }))}>Semua aktivitas <ArrowRight size={14}/></Button></div>
      <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[580px] text-left"><thead><tr className="border-b border-stone-100 text-[10px] uppercase tracking-wider text-stone-400"><th className="pb-3 font-bold">Aktivitas</th><th className="pb-3 font-bold">Waktu</th><th className="pb-3 font-bold">Kehadiran</th><th className="pb-3 font-bold">Status</th><th className="pb-3 text-right font-bold">Detail</th></tr></thead><tbody>{activityRows.map((item) => <tr className="border-b border-stone-50 last:border-0" key={item.title}><td className="py-3.5"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-latte-50 text-latte-700">{item.type === 'Tahfidz' ? <BookOpen size={16}/> : item.type === 'Sholat' ? <Clock3 size={16}/> : <CalendarDays size={16}/>}</div><div><p className="text-xs font-bold text-latte-900">{item.title}</p><p className="mt-1 text-[10px] text-stone-400">{item.type}</p></div></div></td><td className="py-3.5 text-xs font-semibold text-stone-600">{item.time}</td><td className="py-3.5"><div className="flex items-center gap-2"><div className="h-1.5 w-20 overflow-hidden rounded-full bg-stone-100"><div className="h-full rounded-full bg-latte-600" style={{width: `${item.total ? item.present/item.total*100 : 0}%`}}/></div><span className="text-[10px] text-stone-500">{item.present ? `${item.present}/${item.total}` : 'Belum ada'}</span></div></td><td className="py-3.5"><Badge tone={item.status === 'Selesai' ? 'green' : item.status === 'Berlangsung' ? 'amber' : 'neutral'}>{item.status}</Badge></td><td className="py-3.5 text-right"><button className="rounded-lg p-2 text-stone-400 hover:bg-latte-50 hover:text-latte-700"><ChevronRight size={15}/></button></td></tr>)}</tbody></table></div>
    </section>
  </div>
}

function SantriPage({ santri, setSantri, role, genderFilter, setGenderFilter }) {
  const [query, setQuery] = useState('')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', nis: '', gender: 'Ikhwan', branch: 'Pusat Darun Nahdhah', dorm: 'Asrama Al-Falah', status: 'Aktif' })
  const filtered = useMemo(() => santri.filter(s => (s.name.toLowerCase().includes(query.toLowerCase()) || s.nis.toLowerCase().includes(query.toLowerCase())) && (genderFilter === 'Semua' || s.gender === genderFilter)), [santri, query, genderFilter])
  const openAdd = () => { setEditing(null); setForm({ name: '', nis: `DN-${String(24007 + santri.length).padStart(5, '0')}`, gender: 'Ikhwan', branch: 'Pusat Darun Nahdhah', dorm: 'Asrama Al-Falah', status: 'Aktif' }); setModal(true) }
  const save = (e) => { e.preventDefault(); if (!form.name.trim() || !form.nis.trim()) return; if (editing) setSantri(prev => prev.map(s => s.nis === editing.nis ? { ...s, ...form, attendance: s.attendance || 90, tahfidz: s.tahfidz || '0 Juz' } : s)); else setSantri(prev => [{ ...form, attendance: 100, tahfidz: '0 Juz' }, ...prev]); setModal(false) }
  const remove = (item) => { if (confirm(`Hapus data ${item.name}?`)) setSantri(prev => prev.filter(s => s.nis !== item.nis)) }
  return <div className="space-y-5">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><div className="flex items-center gap-2 text-xs text-stone-400"><span>Workspace</span><ChevronRight size={12}/><span className="text-latte-700">Data Santri</span></div><h2 className="mt-2 font-display text-2xl font-extrabold text-latte-900">Data Santri</h2><p className="mt-1 text-sm text-stone-500">Kelola profil, penempatan, dan status santri.</p><div className="mt-2"><Badge tone={genderFilter === 'Ikhwan' ? 'brown' : genderFilter === 'Akhwat' ? 'blue' : 'neutral'}>Tampilan: {genderFilter === 'Semua' ? 'Semua santri' : genderFilter}</Badge></div></div>{role !== 'Santri' && <Button icon={Plus} onClick={openAdd}>Tambah Santri</Button>}</div>
    <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-2xl border border-[#eee5da] bg-white p-4"><p className="text-xs text-stone-500">Total santri</p><p className="mt-2 font-display text-2xl font-extrabold text-latte-900">{santri.length}</p></div><div className="rounded-2xl border border-[#eee5da] bg-white p-4"><p className="text-xs text-stone-500">Ikhwan</p><p className="mt-2 font-display text-2xl font-extrabold text-latte-900">{santri.filter(s => s.gender === 'Ikhwan').length}</p></div><div className="rounded-2xl border border-[#eee5da] bg-white p-4"><p className="text-xs text-stone-500">Akhwat</p><p className="mt-2 font-display text-2xl font-extrabold text-latte-900">{santri.filter(s => s.gender === 'Akhwat').length}</p></div></div>
    <section className="overflow-hidden rounded-2xl border border-[#eee5da] bg-white shadow-soft">
      <div className="flex flex-wrap items-center gap-3 border-b border-stone-100 p-4"><div className="relative min-w-[200px] flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={15}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Cari nama atau NIS..." className="w-full rounded-xl border border-stone-200 bg-latte-50/50 py-2.5 pl-9 pr-3 text-xs outline-none transition focus:border-latte-400 focus:ring-2 focus:ring-latte-100"/></div><label className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs font-semibold text-stone-500"><Users size={14}/><span>Kategori</span><select aria-label="Filter kategori santri" value={genderFilter} onChange={e => setGenderFilter(e.target.value)} className="max-w-[125px] bg-transparent text-xs font-bold text-stone-700 outline-none"><option value="Semua">Semua santri</option><option value="Ikhwan">Ikhwan</option><option value="Akhwat">Akhwat</option></select></label><Button variant="outline" icon={Download} onClick={() => alert('Demo: ekspor CSV/PDF akan dihubungkan pada tahap backend.')}>Ekspor</Button></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left"><thead className="bg-latte-50/70"><tr className="text-[10px] uppercase tracking-wider text-stone-400"><th className="px-5 py-3 font-bold">Santri</th><th className="px-4 py-3 font-bold">Jenis kelamin</th><th className="px-4 py-3 font-bold">Cabang / Asrama</th><th className="px-4 py-3 font-bold">Kehadiran</th><th className="px-4 py-3 font-bold">Status</th><th className="px-4 py-3 text-right font-bold">Aksi</th></tr></thead><tbody>{filtered.map((s, i) => <tr key={s.nis} className="border-t border-stone-100 transition hover:bg-latte-50/40"><td className="px-5 py-4"><div className="flex items-center gap-3"><Avatar name={s.name} tone={i % 3 === 0 ? 'brown' : i % 3 === 1 ? 'green' : 'rose'}/><div><p className="text-xs font-extrabold text-latte-900">{s.name}</p><p className="mt-1 text-[10px] text-stone-400">{s.nis}</p></div></div></td><td className="px-4 py-4"><Badge tone={s.gender === 'Ikhwan' ? 'brown' : 'blue'}>{s.gender}</Badge></td><td className="px-4 py-4"><p className="text-xs font-semibold text-stone-700">{s.branch}</p><p className="mt-1 text-[10px] text-stone-400">{s.dorm}</p></td><td className="px-4 py-4"><div className="flex items-center gap-2"><div className="h-1.5 w-14 rounded-full bg-stone-100"><div className="h-full rounded-full bg-latte-600" style={{width: `${s.attendance}%`}}/></div><span className="text-xs font-bold text-stone-600">{s.attendance}%</span></div></td><td className="px-4 py-4"><Badge tone={s.status === 'Aktif' ? 'green' : 'amber'}>{s.status}</Badge></td><td className="px-4 py-4"><div className="flex justify-end gap-1"><button title="Lihat" onClick={() => alert(`${s.name}\\n${s.nis}\\n${s.gender}\\n${s.branch} · ${s.dorm}\\nTahfidz: ${s.tahfidz}`)} className="rounded-lg p-2 text-stone-400 hover:bg-latte-100 hover:text-latte-700"><Eye size={15}/></button>{role !== 'Santri' && <><button title="Edit" onClick={() => {setEditing(s); setForm({...s}); setModal(true)}} className="rounded-lg p-2 text-stone-400 hover:bg-latte-100 hover:text-latte-700"><Pencil size={15}/></button><button title="Hapus" onClick={() => remove(s)} className="rounded-lg p-2 text-stone-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={15}/></button></>}</div></td></tr>)}</tbody></table></div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 px-5 py-3"><p className="text-[11px] text-stone-400">Menampilkan {filtered.length} dari {santri.length} santri · Data dummy</p><div className="flex items-center gap-1"><button className="rounded-lg border border-stone-200 p-1.5 text-stone-400"><ChevronLeft size={14}/></button><button className="h-7 w-7 rounded-lg bg-latte-700 text-[11px] font-bold text-white">1</button><button className="rounded-lg border border-stone-200 p-1.5 text-stone-400"><ChevronRight size={14}/></button></div></div>
    </section>
    {modal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-latte-900/35 p-4 backdrop-blur-sm"><form onSubmit={save} className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><div><h3 className="font-display text-xl font-extrabold text-latte-900">{editing ? 'Edit Data Santri' : 'Tambah Santri'}</h3><p className="mt-1 text-xs text-stone-500">Form demo · perubahan tersimpan selama sesi ini.</p></div><button type="button" onClick={() => setModal(false)} className="rounded-xl p-2 text-stone-400 hover:bg-stone-100"><X size={18}/></button></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold text-stone-600">Nama lengkap<input required value={form.name} onChange={e => setForm({...form, name:e.target.value})} className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-2.5 font-normal outline-none focus:border-latte-400" placeholder="Nama santri"/></label><label className="text-xs font-bold text-stone-600">NIS<input required value={form.nis} onChange={e => setForm({...form, nis:e.target.value})} className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-2.5 font-normal outline-none focus:border-latte-400" placeholder="DN-24000"/></label><label className="text-xs font-bold text-stone-600">Jenis kelamin<select value={form.gender} onChange={e => setForm({...form, gender:e.target.value})} className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-2.5 font-normal outline-none"><option>Ikhwan</option><option>Akhwat</option></select></label><label className="text-xs font-bold text-stone-600">Status<select value={form.status} onChange={e => setForm({...form, status:e.target.value})} className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-2.5 font-normal outline-none"><option>Aktif</option><option>Perlu perhatian</option><option>Nonaktif</option></select></label><label className="text-xs font-bold text-stone-600 sm:col-span-2">Cabang<select value={form.branch} onChange={e => setForm({...form, branch:e.target.value})} className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-2.5 font-normal outline-none"><option>Pusat Darun Nahdhah</option><option>Cabang Depok</option><option>Cabang Bogor</option></select></label><label className="text-xs font-bold text-stone-600 sm:col-span-2">Asrama<select value={form.dorm} onChange={e => setForm({...form, dorm:e.target.value})} className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-2.5 font-normal outline-none"><option>Asrama Al-Falah</option><option>Asrama Al-Ikhlas</option><option>Asrama An-Nisa</option></select></label></div><div className="mt-6 flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setModal(false)}>Batal</Button><button type="submit" className="rounded-xl bg-latte-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-latte-800">Simpan Data</button></div></form></div>}
  </div>
}

function ActivitiesPage({ activities, setActivities, role }) {
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Semua')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const blankForm = () => ({ title: '', category: 'Kegiatan', date: toDateKey(), time: '08:00', participants: 'Semua santri', branch: 'Pusat Darun Nahdhah', location: '', notes: '' })
  const [form, setForm] = useState(blankForm)
  const openAdd = () => { setEditing(null); setForm(blankForm()); setShowModal(true) }
  const openEdit = (item) => { setEditing(item); setForm({ ...blankForm(), ...item }); setShowModal(true) }
  const saveActivity = (event) => {
    event.preventDefault()
    if (!form.title.trim() || !form.date || !form.time || !form.participants.trim() || !form.branch) return
    if (editing) setActivities(current => current.map(item => item.id === editing.id ? { ...item, ...form, title: form.title.trim() } : item))
    else setActivities(current => [...current, { ...form, id: `event-${Date.now()}`, title: form.title.trim() }])
    setShowModal(false)
    setEditing(null)
  }
  const deleteActivity = (item) => {
    if (window.confirm(`Hapus kegiatan "${item.title}"?`)) setActivities(current => current.filter(event => event.id !== item.id))
  }
  const filtered = activities.filter(item => `${item.title} ${item.branch} ${item.participants} ${item.location} ${item.category}`.toLowerCase().includes(query.toLowerCase()) && (categoryFilter === 'Semua' || item.category === categoryFilter)).slice().sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
  const today = toDateKey()
  const upcoming = activities.filter(item => item.date >= today).length

  return <div className="space-y-5">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><div className="flex items-center gap-2 text-xs text-stone-400"><span>Workspace</span><ChevronRight size={12}/><span className="text-latte-700">Kegiatan</span></div><h2 className="mt-2 font-display text-2xl font-extrabold text-latte-900">Manajemen Kegiatan</h2><p className="mt-1 text-sm text-stone-500">Atur jadwal, waktu, peserta, dan cabang. Setiap agenda langsung ditandai di kalender Dashboard.</p></div>{role !== 'Santri' && <Button icon={Plus} onClick={openAdd}>Tambah Kegiatan</Button>}</div>
    <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-2xl border border-[#eee5da] bg-white p-4 shadow-soft"><p className="text-xs text-stone-500">Total agenda</p><p className="mt-2 font-display text-2xl font-extrabold text-latte-900">{activities.length}</p><p className="mt-1 text-[10px] text-stone-400">Semua jadwal tersimpan</p></div><div className="rounded-2xl border border-[#eee5da] bg-white p-4 shadow-soft"><p className="text-xs text-stone-500">Agenda mendatang</p><p className="mt-2 font-display text-2xl font-extrabold text-latte-900">{upcoming}</p><p className="mt-1 text-[10px] text-stone-400">Hari ini dan berikutnya</p></div><div className="rounded-2xl border border-[#eee5da] bg-white p-4 shadow-soft"><p className="text-xs text-stone-500">Cabang terlibat</p><p className="mt-2 font-display text-2xl font-extrabold text-latte-900">{new Set(activities.map(item => item.branch)).size}</p><p className="mt-1 text-[10px] text-stone-400">Termasuk semua cabang</p></div></div>
    <section className="overflow-hidden rounded-2xl border border-[#eee5da] bg-white shadow-soft">
      <div className="flex flex-wrap items-center gap-3 border-b border-stone-100 p-4"><div className="relative min-w-[200px] flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={15}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Cari nama kegiatan, peserta, cabang..." className="w-full rounded-xl border border-stone-200 bg-latte-50/50 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-latte-400"/></div><div className="flex items-center gap-2 rounded-xl border border-stone-200 px-3 py-2.5 text-xs font-semibold text-stone-500"><Filter size={14}/><select aria-label="Filter kategori" value={categoryFilter} onChange={event => setCategoryFilter(event.target.value)} className="max-w-[150px] bg-transparent outline-none"><option>Semua</option><option>Kegiatan</option><option>Tahfidz</option><option>Sholat</option><option>Pembinaan</option></select></div></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left"><thead className="bg-latte-50/70"><tr>{['Kegiatan','Tanggal & waktu','Peserta','Cabang','Kategori','Aksi'].map(label => <th key={label} className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-stone-400">{label}</th>)}</tr></thead><tbody>{filtered.map(item => <tr key={item.id} className="border-t border-stone-100 hover:bg-latte-50/40"><td className="px-5 py-4"><p className="text-xs font-extrabold text-latte-900">{item.title}</p>{item.location && <p className="mt-1 flex items-center gap-1 text-[10px] text-stone-400"><MapPin size={11}/>{item.location}</p>}</td><td className="px-5 py-4"><p className="text-xs font-semibold text-stone-700">{formatDateID(item.date, { day: 'numeric', month: 'short', year: 'numeric' })}</p><p className="mt-1 flex items-center gap-1 text-[10px] text-stone-400"><Clock3 size={11}/>{item.time} WIB</p></td><td className="px-5 py-4 text-xs text-stone-600">{item.participants}</td><td className="px-5 py-4 text-xs text-stone-600">{item.branch}</td><td className="px-5 py-4"><Badge tone={item.category === 'Tahfidz' ? 'green' : item.category === 'Sholat' ? 'amber' : item.category === 'Pembinaan' ? 'red' : 'brown'}>{item.category}</Badge></td><td className="px-5 py-4"><div className="flex gap-1"><button title="Edit kegiatan" onClick={() => openEdit(item)} className="rounded-lg p-2 text-stone-400 hover:bg-latte-100 hover:text-latte-700"><Pencil size={15}/></button><button title="Hapus kegiatan" onClick={() => deleteActivity(item)} className="rounded-lg p-2 text-stone-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={15}/></button></div></td></tr>)}</tbody></table></div>
      {filtered.length === 0 && <EmptyState title="Belum ada kegiatan" desc="Coba ubah pencarian, atau tambahkan jadwal kegiatan baru."/>}
      <div className="border-t border-stone-100 px-5 py-3 text-[11px] text-stone-400">Menampilkan {filtered.length} dari {activities.length} agenda · Perubahan langsung tercermin pada kalender Dashboard.</div>
    </section>
    {showModal && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-latte-900/40 p-4 backdrop-blur-sm" onMouseDown={event => { if (event.target === event.currentTarget) setShowModal(false) }}><form onSubmit={saveActivity} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-6"><div className="flex items-start justify-between gap-3"><div><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-latte-100 text-latte-700"><CalendarDays size={19}/></div><h3 className="mt-3 font-display text-xl font-extrabold text-latte-900">{editing ? 'Edit Kegiatan' : 'Tambah Kegiatan'}</h3><p className="mt-1 text-xs text-stone-500">Lengkapi jadwal agar kegiatan muncul pada kalender Dashboard.</p></div><button type="button" onClick={() => setShowModal(false)} aria-label="Tutup formulir" className="rounded-xl p-2 text-stone-400 hover:bg-stone-100"><X size={18}/></button></div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-bold text-stone-600 sm:col-span-2">Nama kegiatan *<input required autoFocus value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-3 font-normal outline-none focus:border-latte-400 focus:ring-2 focus:ring-latte-100" placeholder="Contoh: Kajian Kitab Akhlak"/></label>
        <label className="text-xs font-bold text-stone-600">Tanggal *<input required type="date" value={form.date} onChange={event => setForm({ ...form, date: event.target.value })} className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-3 font-normal outline-none focus:border-latte-400"/></label>
        <label className="text-xs font-bold text-stone-600">Waktu *<input required type="time" value={form.time} onChange={event => setForm({ ...form, time: event.target.value })} className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-3 font-normal outline-none focus:border-latte-400"/></label>
        <label className="text-xs font-bold text-stone-600">Kategori *<select value={form.category} onChange={event => setForm({ ...form, category: event.target.value })} className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-3 py-3 font-normal outline-none focus:border-latte-400"><option>Kegiatan</option><option>Tahfidz</option><option>Sholat</option><option>Pembinaan</option></select></label>
        <label className="text-xs font-bold text-stone-600">Peserta *<select value={form.participants} onChange={event => setForm({ ...form, participants: event.target.value })} className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-3 py-3 font-normal outline-none focus:border-latte-400"><option>Semua santri</option><option>Ikhwan dan akhwat</option><option>Ikhwan</option><option>Akhwat</option><option>Kelompok tahfidz</option><option>Pengurus asrama</option><option>Petugas cabang</option></select></label>
        <label className="text-xs font-bold text-stone-600 sm:col-span-2">Cabang *<select required value={form.branch} onChange={event => setForm({ ...form, branch: event.target.value })} className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-3 py-3 font-normal outline-none focus:border-latte-400"><option>Semua Cabang</option><option>Pusat Darun Nahdhah</option><option>Cabang Depok</option><option>Cabang Bogor</option><option>Cabang Bekasi</option></select></label>
        <label className="text-xs font-bold text-stone-600 sm:col-span-2">Lokasi (opsional)<input value={form.location} onChange={event => setForm({ ...form, location: event.target.value })} className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-3 font-normal outline-none focus:border-latte-400" placeholder="Contoh: Aula utama"/></label>
        <label className="text-xs font-bold text-stone-600 sm:col-span-2">Catatan (opsional)<textarea value={form.notes} onChange={event => setForm({ ...form, notes: event.target.value })} rows={3} className="mt-2 w-full resize-y rounded-xl border border-stone-200 px-3 py-3 font-normal outline-none focus:border-latte-400" placeholder="Keterangan atau pengingat untuk peserta..."/></label>
      </div><div className="mt-6 flex justify-end gap-2 border-t border-stone-100 pt-4"><Button type="button" variant="outline" onClick={() => setShowModal(false)}>Batal</Button><Button type="submit" icon={Check}>{editing ? 'Simpan Perubahan' : 'Simpan Kegiatan'}</Button></div></form></div>}
  </div>
}

function GenericPage({ page, role, genderFilter, setGenderFilter }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Semua')
  const [selectedBranch, setSelectedBranch] = useState('Semua')
  const [selectedDorm, setSelectedDorm] = useState('Semua')
  const [selectedDate, setSelectedDate] = useState('')
  const [showModal, setShowModal] = useState(false)
  const genderFilteredPage = ['Absensi Sholat', 'Absensi Kegiatan', 'Tahfidz'].includes(page)
  const attendanceFilterPages = ['Absensi Sholat', 'Absensi Kegiatan', 'Tahfidz'].includes(page)
  useEffect(() => {
    setFilter('Semua')
    setSearch('')
    setSelectedBranch('Semua')
    setSelectedDorm('Semua')
    setSelectedDate('')
  }, [page])

  const configs = {
    'Absensi Sholat': {
      sub: 'Catat kehadiran sholat berjamaah. Filter berdasarkan kategori santri, cabang, asrama, dan tanggal.',
      icon: ClipboardCheck,
      stats: [['Hadir hari ini','182','green'],['Izin','6','amber'],['Sakit / terlambat','8','red']],
      cols: ['Nama Santri','Jenis Kelamin','Subuh','Dzuhur','Ashar','Maghrib','Isya','Rekap','Cabang','Asrama','Tanggal'],
      rows: [
        ['Ahmad Fauzan','Ikhwan','Hadir','Hadir','Hadir','Hadir','Hadir','100%','Pusat Darun Nahdhah','Asrama Al-Falah',toDateKey()],
        ['Muhammad Rizki','Ikhwan','Hadir','Terlambat','Izin','Hadir','Hadir','80%','Pusat Darun Nahdhah','Asrama Al-Ikhlas',toDateKey()],
        ['Aisyah Humaira','Akhwat','Hadir','Hadir','Hadir','Hadir','Hadir','100%','Cabang Depok','Asrama An-Nisa',toDateKey()],
        ['Abdullah Hakim','Ikhwan','Tidak hadir','Hadir','Sakit','Hadir','Izin','60%','Cabang Bogor','Asrama Al-Falah',addDaysToKey(-1)],
        ['Fatimah Zahra','Akhwat','Hadir','Hadir','Hadir','Terlambat','Hadir','80%','Cabang Depok','Asrama An-Nisa',addDaysToKey(-1)],
        ['Nadia Safitri','Akhwat','Sakit','Hadir','Hadir','Hadir','Hadir','80%','Cabang Bogor','Asrama An-Nisa',toDateKey()],
      ],
    },
    'Absensi Kegiatan': {
      sub: 'Catat kehadiran santri dalam kegiatan dengan pola yang serupa absensi sholat.',
      icon: CalendarCheck,
      stats: [['Hadir hari ini','174','green'],['Izin','10','amber'],['Sakit / terlambat','14','red']],
      cols: ['Nama Santri','Jenis Kelamin','Kegiatan','Waktu','Status Kehadiran','Cabang','Asrama','Tanggal'],
      rows: [
        ['Ahmad Fauzan','Ikhwan','Kajian Kitab Akhlak','08.00','Hadir','Pusat Darun Nahdhah','Asrama Al-Falah',toDateKey()],
        ['Muhammad Rizki','Ikhwan','Kajian Kitab Akhlak','08.00','Terlambat','Pusat Darun Nahdhah','Asrama Al-Ikhlas',toDateKey()],
        ['Aisyah Humaira','Akhwat','Setoran Tahfidz Pagi','06.00','Hadir','Cabang Depok','Asrama An-Nisa',toDateKey()],
        ['Fatimah Zahra','Akhwat','Muhadharah Santri','19.30','Sakit','Cabang Depok','Asrama An-Nisa',addDaysToKey(-1)],
        ['Abdullah Hakim','Ikhwan','Kerja Bakti Asrama','07.00','Tidak hadir','Cabang Bogor','Asrama Al-Falah',addDaysToKey(-1)],
        ['Nadia Safitri','Akhwat','Kajian Kitab Akhlak','08.00','Izin','Cabang Bogor','Asrama An-Nisa',toDateKey()],
      ],
    },
    'Kegiatan': { sub: 'Kelola jadwal kegiatan dan daftar kehadiran peserta.', icon: CalendarDays, stats: [['Kegiatan aktif','12','green'],['Selesai hari ini','4','blue'],['Akan datang','8','amber']], cols: ['Nama Kegiatan','Tanggal','Waktu','Peserta','Cabang','Status'], rows: [['Kajian Kitab Akhlak','23 Okt 2026','08.00','192','Pusat','Terjadwal'],['Setoran Tahfidz Pagi','23 Okt 2026','06.00','176','Semua cabang','Berlangsung'],['Muhadharah Jumat','24 Okt 2026','19.30','88','Cabang Depok','Akan datang'],['Kerja Bakti Asrama','25 Okt 2026','07.00','64','Cabang Bogor','Akan datang']] },
    'Tahfidz': {
      sub: 'Pantau target dan progres hafalan Al-Qur’an dengan filter kategori, cabang, asrama, dan tanggal setoran.',
      icon: BookOpen,
      stats: [['Setoran minggu ini','326','green'],['Target tercapai','78%','blue'],['Perlu evaluasi','18','amber']],
      cols: ['Nama Santri','Jenis Kelamin','Jenis Setoran','Surah / Ayat','Nilai','Pengajar','Tanggal','Cabang','Asrama'],
      rows: [
        ['Ahmad Fauzan','Ikhwan','Hafalan baru','Al-Baqarah 1–10','A','Ust. Hamdan',toDateKey(),'Pusat Darun Nahdhah','Asrama Al-Falah'],
        ['Aisyah Humaira','Akhwat','Murojaah','An-Nisa 1–15','A+','Usth. Maryam',toDateKey(),'Cabang Depok','Asrama An-Nisa'],
        ['Muhammad Rizki','Ikhwan','Hafalan baru','Ali Imran 1–8','B+','Ust. Hamdan',addDaysToKey(-1),'Pusat Darun Nahdhah','Asrama Al-Ikhlas'],
        ['Fatimah Zahra','Akhwat','Murojaah','Yasin 1–20','A','Usth. Maryam',addDaysToKey(-1),'Cabang Depok','Asrama An-Nisa'],
        ['Nadia Safitri','Akhwat','Hafalan baru','Al-Mulk 1–10','A','Usth. Maryam',addDaysToKey(-2),'Cabang Bogor','Asrama An-Nisa'],
        ['Abdullah Hakim','Ikhwan','Murojaah','Al-Kahfi 1–10','B','Ust. Hamdan',addDaysToKey(-2),'Cabang Bogor','Asrama Al-Falah'],
      ],
    },
    'Hukuman': { sub: 'Kelola catatan pelanggaran dan tindak lanjut pembinaan.', icon: ShieldCheck, stats: [['Catatan bulan ini','24','amber'],['Selesai ditindaklanjuti','18','green'],['Dalam proses','6','red']], cols: ['Santri','Pelanggaran','Tingkat','Tanggal','Status'], rows: [['Abdullah Hakim','Terlambat berjamaah','Ringan','22 Okt 2026','Dalam proses'],['Muhammad Rizki','Tidak mengikuti piket','Ringan','21 Okt 2026','Selesai'],['Santri DN-23918','Tidak hadir kegiatan','Sedang','20 Okt 2026','Selesai']] },
    'Reward': { sub: 'Dokumentasikan prestasi dan apresiasi bagi santri.', icon: Award, stats: [['Reward bulan ini','38','green'],['Santri berprestasi','31','blue'],['Total poin','1.240','amber']], cols: ['Penerima','Reward','Alasan','Tanggal','Poin'], rows: [['Aisyah Humaira','Hafalan terbaik','Mencapai target 10 juz','22 Okt 2026','100'],['Ahmad Fauzan','Teladan disiplin','Kehadiran 100%','21 Okt 2026','50'],['Fatimah Zahra','Prestasi akademik','Nilai kajian terbaik','19 Okt 2026','75']] },
    'Asrama': { sub: 'Atur unit asrama, kapasitas, dan penempatan santri.', icon: House, stats: [['Total asrama','12','brown'],['Kapasitas terisi','86%','green'],['Perlu peninjauan','2','amber']], cols: ['Nama Asrama','Kategori','Cabang','Penghuni','Kapasitas','Status'], rows: [['Asrama Al-Falah','Ikhwan','Pusat Darun Nahdhah','86','100','Aktif'],['Asrama Al-Ikhlas','Ikhwan','Pusat Darun Nahdhah','72','80','Aktif'],['Asrama An-Nisa','Akhwat','Cabang Depok','64','75','Aktif'],['Asrama Al-Madinah','Ikhwan','Cabang Bogor','48','60','Aktif']] },
    'Cabang': { sub: 'Kelola unit cabang Darun Nahdhah dalam satu sistem terpusat.', icon: Building2, stats: [['Cabang aktif','8','green'],['Total santri','1.248','brown'],['Admin cabang','8','blue']], cols: ['Nama Cabang','Penanggung Jawab','Jumlah Santri','Admin','Status'], rows: [['Pusat Darun Nahdhah','KH. Abdullah Karim','412','admin.pusat','Aktif'],['Cabang Depok','Ust. Ahmad Fauzi','286','admin.depok','Aktif'],['Cabang Bogor','Ust. Hamdan','198','admin.bogor','Aktif'],['Cabang Bekasi','Ust. M. Ridwan','152','admin.bekasi','Aktif']] },
    'Laporan PDF': { sub: 'Buat laporan individu atau rekap berdasarkan cabang dan periode.', icon: FileText, stats: [['Jenis laporan','5','brown'],['Laporan bulan ini','128','green'],['Siap diunduh','12','blue']], cols: ['Jenis Laporan','Periode','Cakupan','Dibuat oleh','Aksi'], rows: [['Absensi Sholat','Oktober 2026','Individu · Ahmad Fauzan','Admin Pusat','Unduh PDF'],['Kehadiran Kegiatan','Oktober 2026','Cabang Depok','Admin Depok','Unduh PDF'],['Perkembangan Tahfidz','September 2026','Individu · Aisyah','Admin Pusat','Unduh PDF'],['Rekap Santri','Triwulan III 2026','Semua cabang','Super Admin','Unduh PDF']] },
    'Pengguna & Role': { sub: 'Atur akun, peran, dan batas akses setiap pengguna.', icon: UserCog, stats: [['Total pengguna','1.276','brown'],['Admin aktif','8','green'],['Akun perlu ditinjau','3','amber']], cols: ['Pengguna','Username','Role','Cabang','Status'], rows: [['Super Administrator','superadmin','Super Admin','Semua cabang','Aktif'],['Admin Pusat','admin.pusat','Admin Cabang','Pusat Darun Nahdhah','Aktif'],['Admin Depok','admin.depok','Admin Cabang','Cabang Depok','Aktif'],['Ahmad Fauzan','DN-24001','Santri','Pusat Darun Nahdhah','Aktif']] },
    'Audit Log': { sub: 'Telusuri aktivitas penting untuk menjaga akuntabilitas data.', icon: Activity, stats: [['Aktivitas hari ini','246','green'],['Login berhasil','128','blue'],['Perlu ditinjau','2','amber']], cols: ['Pengguna','Aktivitas','Modul','Waktu','Alamat IP','Status'], rows: [['admin.pusat','Memperbarui absensi','Absensi Sholat','10.24','192.168.1.10','Berhasil'],['superadmin','Membuat akun admin','Pengguna','09.51','192.168.1.2','Berhasil'],['admin.depok','Mengubah data santri','Data Santri','09.16','192.168.1.18','Berhasil']] },
    'Pengaturan': { sub: 'Konfigurasi dasar aplikasi dan preferensi operasional.', icon: Settings, stats: [['Status sistem','Normal','green'],['Zona waktu','WIB','brown'],['Versi aplikasi','0.1.0','blue']], cols: ['Pengaturan','Nilai saat ini','Keterangan'], rows: [['Nama aplikasi','E-Absensi Darun Nahdhah','Identitas sistem'],['Zona waktu','Asia/Jakarta (WIB)','Waktu pencatatan'],['Format tanggal','DD MMM YYYY','Format tampilan'],['Backup database','Belum terhubung','Konfigurasi backend']] },
  }

  const cfg = configs[page] || configs.Kegiatan
  const Icon = cfg.icon
  const metadataIndexes = {
    'Absensi Sholat': { branch: 8, dorm: 9, date: 10 },
    'Absensi Kegiatan': { branch: 5, dorm: 6, date: 7 },
    'Tahfidz': { branch: 7, dorm: 8, date: 6 },
  }
  const meta = metadataIndexes[page]
  const branches = meta ? [...new Set(cfg.rows.map(row => row[meta.branch]))] : []
  const dorms = meta ? [...new Set(cfg.rows.filter(row => selectedBranch === 'Semua' || row[meta.branch] === selectedBranch).map(row => row[meta.dorm]))] : []
  const filteredRows = cfg.rows.filter(row => {
    const matchesSearch = row.join(' ').toLowerCase().includes(search.toLowerCase())
    const matchesGender = !genderFilteredPage || genderFilter === 'Semua' || row[1] === genderFilter
    const matchesBranch = !meta || selectedBranch === 'Semua' || row[meta.branch] === selectedBranch
    const matchesDorm = !meta || selectedDorm === 'Semua' || row[meta.dorm] === selectedDorm
    const matchesDate = !meta || !selectedDate || row[meta.date] === selectedDate
    const matchesOtherFilter = genderFilteredPage || filter === 'Semua' || row.some(cell => String(cell).toLowerCase().includes(filter.toLowerCase()))
    return matchesSearch && matchesGender && matchesBranch && matchesDorm && matchesDate && matchesOtherFilter
  })

  const renderCell = (cell, j) => {
    if (meta && j === meta.date) return <span className="whitespace-nowrap">{formatDateID(cell, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
    if (cell === 'Ikhwan') return <Badge tone="brown">{cell}</Badge>
    if (cell === 'Akhwat') return <Badge tone="blue">{cell}</Badge>
    if (['Aktif', 'Berhasil', 'Selesai', 'Hadir'].includes(cell)) return <Badge tone="green">{cell}</Badge>
    if (['Dalam proses', 'Perlu perhatian', 'Izin', 'Terlambat'].includes(cell)) return <Badge tone="amber">{cell}</Badge>
    if (cell === 'Sakit') return <Badge tone="blue">{cell}</Badge>
    if (['Tidak hadir', 'Nonaktif'].includes(cell)) return <Badge tone="red">{cell}</Badge>
    if (page === 'Laporan PDF' && cell === 'Unduh PDF') return <button onClick={() => alert('Demo: file PDF akan dibuat dari data backend.')} className="inline-flex items-center gap-1 font-bold text-latte-700 hover:underline"><Download size={13}/> {cell}</button>
    return cell
  }

  return <div className="space-y-5">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><div className="flex items-center gap-2 text-xs text-stone-400"><span>Workspace</span><ChevronRight size={12}/><span className="text-latte-700">{page}</span></div><h2 className="mt-2 font-display text-2xl font-extrabold text-latte-900">{page}</h2><p className="mt-1 text-sm text-stone-500">{cfg.sub}</p>{genderFilteredPage && <div className="mt-2"><Badge tone={genderFilter === 'Ikhwan' ? 'brown' : genderFilter === 'Akhwat' ? 'blue' : 'neutral'}>Tampilan: {genderFilter === 'Semua' ? 'Semua santri' : genderFilter}</Badge></div>}</div><div className="flex gap-2"><Button variant="outline" icon={Download} onClick={() => alert('Demo: ekspor laporan akan diaktifkan setelah integrasi backend.')}>Ekspor</Button>{page !== 'Laporan PDF' && page !== 'Audit Log' && page !== 'Pengaturan' && <Button icon={Plus} onClick={() => setShowModal(true)}>Tambah Data</Button>}</div></div>
    <div className="grid gap-3 sm:grid-cols-3">{cfg.stats.map(([label, value, tone]) => <div key={label} className="rounded-2xl border border-[#eee5da] bg-white p-4 shadow-soft"><p className="text-xs text-stone-500">{label}</p><p className="mt-2 font-display text-2xl font-extrabold text-latte-900">{value}</p><div className="mt-2"><Badge tone={tone === 'green' ? 'green' : tone === 'amber' ? 'amber' : tone === 'red' ? 'red' : 'brown'}>Data demo</Badge></div></div>)}</div>
    <section className="overflow-hidden rounded-2xl border border-[#eee5da] bg-white shadow-soft">
      <div className="flex flex-wrap items-center gap-3 border-b border-stone-100 p-4">
        <div className="relative min-w-[190px] flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={15}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Cari ${page.toLowerCase()}...`} className="w-full rounded-xl border border-stone-200 bg-latte-50/50 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-latte-400"/></div>
        {genderFilteredPage && <div className="flex items-center gap-2 rounded-xl border border-stone-200 px-3 py-2.5 text-xs font-semibold text-stone-500"><Users size={14}/><select aria-label="Filter kategori santri" value={genderFilter} onChange={e => setGenderFilter(e.target.value)} className="max-w-[145px] bg-transparent outline-none"><option value="Semua">Semua santri</option><option value="Ikhwan">Ikhwan</option><option value="Akhwat">Akhwat</option></select></div>}
        {meta && <>
          <label className="flex items-center gap-2 rounded-xl border border-stone-200 px-3 py-2.5 text-xs font-semibold text-stone-500"><Building2 size={14}/><span className="hidden sm:inline">Cabang</span><select aria-label="Filter cabang" value={selectedBranch} onChange={e => { setSelectedBranch(e.target.value); setSelectedDorm('Semua') }} className="max-w-[160px] bg-transparent outline-none"><option value="Semua">Semua cabang</option>{branches.map(branch => <option key={branch} value={branch}>{branch}</option>)}</select></label>
          <label className="flex items-center gap-2 rounded-xl border border-stone-200 px-3 py-2.5 text-xs font-semibold text-stone-500"><House size={14}/><span className="hidden sm:inline">Asrama</span><select aria-label="Filter asrama" value={selectedDorm} onChange={e => setSelectedDorm(e.target.value)} className="max-w-[155px] bg-transparent outline-none"><option value="Semua">Semua asrama</option>{dorms.map(dorm => <option key={dorm} value={dorm}>{dorm}</option>)}</select></label>
          <label className="flex items-center gap-2 rounded-xl border border-stone-200 px-3 py-2.5 text-xs font-semibold text-stone-500"><CalendarDays size={14}/><span className="hidden sm:inline">Tanggal</span><input aria-label="Filter tanggal" type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="max-w-[145px] bg-transparent text-xs outline-none"/></label>
          {(selectedBranch !== 'Semua' || selectedDorm !== 'Semua' || selectedDate) && <Button variant="ghost" onClick={() => { setSelectedBranch('Semua'); setSelectedDorm('Semua'); setSelectedDate('') }}>Reset filter</Button>}
        </>}
        {!genderFilteredPage && <div className="flex items-center gap-2 rounded-xl border border-stone-200 px-3 py-2.5 text-xs font-semibold text-stone-500"><Filter size={14}/><select value={filter} onChange={e => setFilter(e.target.value)} className="max-w-[160px] bg-transparent outline-none"><option>Semua</option><option>Aktif</option><option>Hadir</option><option>Ikhwan</option><option>Akhwat</option><option>Selesai</option><option>Cabang</option></select></div>}
      </div>
      <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left"><thead className="bg-latte-50/70"><tr>{cfg.cols.map(col => <th key={col} className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-stone-400">{col}</th>)}</tr></thead><tbody>{filteredRows.map((row, i) => <tr key={`${page}-${row[0]}-${i}`} className="border-t border-stone-100 hover:bg-latte-50/40">{row.map((cell, j) => <td key={j} className="px-5 py-4 text-xs text-stone-600">{j === 0 ? <span className="font-extrabold text-latte-900">{cell}</span> : renderCell(cell, j)}</td>)}</tr>)}</tbody></table></div>
      {filteredRows.length === 0 && <EmptyState title="Data tidak ditemukan" desc="Coba ubah kategori santri, cabang, asrama, tanggal, atau kata kunci pencarian."/>}
      <div className="border-t border-stone-100 px-5 py-3 text-[11px] text-stone-400">Menampilkan {filteredRows.length} dari {cfg.rows.length} data · Data dummy</div>
    </section>
    {showModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-latte-900/35 p-4 backdrop-blur-sm"><div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><div><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-latte-100 text-latte-700"><Icon size={20}/></div><h3 className="mt-4 font-display text-xl font-extrabold text-latte-900">Tambah {page}</h3><p className="mt-1 text-xs leading-5 text-stone-500">Ini adalah pratinjau alur form. Form lengkap mengikuti skema data saat backend mulai dikerjakan.</p></div><button onClick={() => setShowModal(false)} className="rounded-xl p-2 text-stone-400 hover:bg-stone-100"><X size={18}/></button></div><div className="mt-5 rounded-xl border border-dashed border-latte-200 bg-latte-50 p-4 text-xs leading-5 text-stone-600"><p className="font-bold text-latte-800">Field yang akan disiapkan</p><p className="mt-2">Identitas data · kategori · cabang/asrama terkait · status · catatan tambahan</p></div><div className="mt-5 flex justify-end gap-2"><Button variant="outline" onClick={() => setShowModal(false)}>Batal</Button><Button onClick={() => {setShowModal(false); alert('Form CRUD lengkap akan diimplementasikan bertahap.')}}>Lanjutkan</Button></div></div></div>}
  </div>
}

function StudentPortal({ santri }) {
  const [tab, setTab] = useState('Ringkasan')
  const student = santri[0]
  return <div className="space-y-5">
    <div className="relative overflow-hidden rounded-[26px] bg-[#e7eee2] p-6 md:p-8"><div className="absolute -right-5 -top-12 h-48 w-48 rounded-full border border-[#bdcbb5]"/><div className="relative z-10 flex flex-wrap items-center gap-4"><Avatar name={student?.name || 'Ahmad Fauzan'} tone="green" size="lg"/><div className="flex-1"><Badge tone="green"><BadgeCheck size={12}/> Santri Aktif</Badge><h2 className="mt-3 font-display text-2xl font-extrabold text-latte-900">Assalamu’alaikum, {student?.name || 'Ahmad Fauzan'}!</h2><p className="mt-1 text-sm text-stone-600">Semoga hari ini penuh keberkahan dan semangat dalam menuntut ilmu.</p></div><div className="rounded-2xl border border-white/70 bg-white/70 p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Nomor Induk</p><p className="mt-1 font-display font-extrabold text-latte-900">{student?.nis || 'DN-24001'}</p></div></div></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Kehadiran bulan ini" value={`${student?.attendance || 96}%`} change="+3,2%" note="vs bulan lalu" icon={ClipboardCheck} color="bg-[#e8f0e4] text-[#637d5a]"/><StatCard label="Hafalan tercapai" value={student?.tahfidz || '8 Juz'} change="+1 juz" note="bulan ini" icon={BookOpen} color="bg-latte-100 text-latte-700"/><StatCard label="Reward diterima" value="4" change="+1" note="bulan ini" icon={Award} color="bg-[#f8ead8] text-[#a16d35]"/><StatCard label="Catatan pembinaan" value="1" change="−2" note="bulan ini" icon={HeartHandshake} color="bg-[#f9e7e3] text-[#b66c5e]"/></div>
    <div className="flex gap-2 overflow-x-auto rounded-xl bg-white p-1.5 shadow-soft">{['Ringkasan','Riwayat Sholat','Tahfidz','Reward'].map(t => <button key={t} onClick={() => setTab(t)} className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-xs font-bold transition ${tab === t ? 'bg-latte-700 text-white' : 'text-stone-500 hover:bg-latte-50'}`}>{t}</button>)}</div>
    <section className="rounded-2xl border border-[#eee5da] bg-white p-5 shadow-soft"><div className="flex items-center justify-between"><div><h3 className="font-display text-base font-extrabold text-latte-900">{tab === 'Ringkasan' ? 'Aktivitas terbaru' : tab}</h3><p className="mt-1 text-xs text-stone-500">Informasi pribadi yang tercatat di sistem</p></div><BookMarked className="text-latte-500" size={20}/></div><div className="mt-5 space-y-3">{(tab === 'Tahfidz' ? [['Setoran Al-Baqarah ayat 1–10','Hari ini · Nilai A'],['Murojaah Juz 29','Kemarin · Nilai A+']] : tab === 'Reward' ? [['Teladan kedisiplinan','21 Okt 2026 · +50 poin'],['Hafalan konsisten','10 Okt 2026 · +25 poin']] : [['Sholat Subuh berjamaah','Hari ini · Hadir'],['Setoran tahfidz pagi','Hari ini · Selesai'],['Kajian Kitab Akhlak','Kemarin · Hadir']]).map(([a,b]) => <div key={a} className="flex items-center gap-3 rounded-xl border border-stone-100 p-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-latte-50 text-latte-700"><Check size={16}/></div><div className="flex-1"><p className="text-xs font-bold text-latte-900">{a}</p><p className="mt-1 text-[10px] text-stone-400">{b}</p></div><ChevronRight size={15} className="text-stone-300"/></div>)}</div></section>
  </div>
}

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('superadmin@darunnahdhah.id')
  const [password, setPassword] = useState('darunnahdhah')
  const [showPassword, setShowPassword] = useState(false)
  const [forgot, setForgot] = useState(false)
  return <div className="min-h-screen bg-[#f7f4ef] lg:grid lg:grid-cols-[1.05fr_.95fr]">
    <div className="relative hidden overflow-hidden bg-latte-800 p-12 text-white lg:flex lg:flex-col lg:justify-between">
      <div className="absolute inset-0 soft-grid opacity-20"/><div className="absolute -right-20 top-24 h-96 w-96 rounded-full border border-white/10"/><div className="absolute -right-2 top-44 h-64 w-64 rounded-full border border-white/10"/><div className="relative z-10"><Brand/><p className="mt-16 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.18em]"><Sparkles size={12}/> Santri management, made thoughtful</p><h1 className="mt-6 max-w-xl font-display text-5xl font-extrabold leading-[1.12]">Menjaga disiplin.<br/><span className="text-[#d9c5ae]">Menumbuhkan</span><br/>generasi Qur’ani.</h1><p className="mt-5 max-w-md text-sm leading-7 text-latte-100/75">Satu ruang digital untuk memantau ibadah, kegiatan, dan perjalanan hafalan santri Darun Nahdhah.</p></div>
      <div className="relative z-10 grid grid-cols-3 gap-3">{[['01','Terintegrasi'],['02','Terpantau'],['03','Terarah']].map(([n,t]) => <div key={n} className="border-t border-white/20 pt-3"><p className="text-xs font-bold text-[#d9c5ae]">{n}</p><p className="mt-1 text-xs text-white/75">{t}</p></div>)}</div>
    </div>
    <div className="flex min-h-screen items-center justify-center p-5 sm:p-10"><div className="w-full max-w-md">
      <div className="mb-10 flex items-center gap-3 lg:hidden"><Brand/></div>
      <div className="mb-8"><div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-latte-100 text-latte-700"><LockKeyhole size={22}/></div><p className="text-xs font-bold uppercase tracking-[.16em] text-latte-500">{forgot ? 'Pemulihan akun' : 'Selamat datang kembali'}</p><h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-latte-900">{forgot ? 'Lupa kata sandi?' : 'Masuk ke akun Anda'}</h2><p className="mt-2 text-sm leading-6 text-stone-500">{forgot ? 'Masukkan email akun untuk menerima instruksi pemulihan.' : 'Masuk untuk melanjutkan pengelolaan data santri.'}</p></div>
      <form onSubmit={e => {e.preventDefault(); if (forgot) {alert('Demo: instruksi reset password akan dikirim melalui backend.'); setForgot(false)} else onLogin(email)}} className="space-y-4">
        <label className="block text-xs font-bold text-stone-700">Email atau username<div className="relative mt-2"><UserRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={16}/><input required value={email} onChange={e => setEmail(e.target.value)} type="text" className="w-full rounded-xl border border-stone-200 bg-white py-3.5 pl-10 pr-4 text-sm outline-none transition focus:border-latte-400 focus:ring-4 focus:ring-latte-100" placeholder="nama@darunnahdhah.id"/></div></label>
        {!forgot && <label className="block text-xs font-bold text-stone-700">Kata sandi<div className="relative mt-2"><KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={16}/><input required value={password} onChange={e => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} className="w-full rounded-xl border border-stone-200 bg-white py-3.5 pl-10 pr-16 text-sm outline-none transition focus:border-latte-400 focus:ring-4 focus:ring-latte-100" placeholder="Masukkan kata sandi"/><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-latte-600">{showPassword ? 'Sembunyikan' : 'Lihat'}</button></div></label>}
        {!forgot && <div className="flex items-center justify-between text-xs"><label className="flex items-center gap-2 text-stone-500"><input type="checkbox" className="rounded border-stone-300 accent-latte-700"/> Ingat saya</label><button type="button" onClick={() => setForgot(true)} className="font-bold text-latte-700 hover:underline">Lupa password?</button></div>}
        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-latte-700 py-3.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-latte-800">{forgot ? 'Kirim instruksi reset' : 'Masuk ke Dashboard'}<ArrowRight size={16}/></button>
      </form>
      {!forgot && <div className="mt-6 rounded-xl border border-latte-200 bg-latte-50 p-4"><p className="flex items-center gap-2 text-xs font-extrabold text-latte-800"><CircleHelp size={14}/> Akun demo</p><p className="mt-2 text-[11px] leading-5 text-stone-500">Email: superadmin@darunnahdhah.id<br/>Password: darunnahdhah</p><p className="mt-1 text-[10px] text-stone-400">Preview frontend saja — autentikasi belum terhubung backend.</p></div>}
      {forgot && <button onClick={() => setForgot(false)} className="mt-5 flex items-center gap-2 text-xs font-bold text-latte-700"><ChevronLeft size={14}/> Kembali ke login</button>}
      <p className="mt-10 text-center text-[10px] text-stone-400">© 2026 Darun Nahdhah · E-Absensi System</p>
    </div></div>
  </div>
}

export default function App() {
  const [page, setPage] = useState('Dashboard')
  const [role, setRole] = useState('Super Admin')
  const [loggedIn, setLoggedIn] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [santri, setSantri] = useState(initialSantri)
  const [activities, setActivities] = useState(createInitialActivities)
  const [genderByModule, setGenderByModule] = useState({ 'Data Santri': 'Semua', 'Absensi Sholat': 'Semua', 'Absensi Kegiatan': 'Semua', 'Tahfidz': 'Semua' })
  const [expandedGenderMenus, setExpandedGenderMenus] = useState({})
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const handler = (e) => setPage(e.detail)
    window.addEventListener('navigate', handler)
    return () => window.removeEventListener('navigate', handler)
  }, [])

  // Keep the gender dropdown visible whenever one of the gender-based modules is active.
  useEffect(() => {
    if (['Absensi Sholat', 'Absensi Kegiatan', 'Tahfidz', 'Data Santri'].includes(page)) {
      setExpandedGenderMenus(current => ({ ...current, [page]: true }))
    }
  }, [page])

  if (!loggedIn) return <LoginPage onLogin={(email) => { setRole(email.toLowerCase().includes('santri') ? 'Santri' : email.toLowerCase().includes('admin.') ? 'Admin Cabang' : 'Super Admin'); setLoggedIn(true); setPage('Dashboard') }} />

  const roleOptions = ['Super Admin', 'Admin Cabang', 'Santri']
  const title = page === 'Dashboard' ? 'Dashboard' : page
  const isStudent = role === 'Santri'
  const filteredNav = isStudent ? [['Dashboard', LayoutDashboard], ['Data Santri', Users], ['Laporan PDF', FileText]] : navGroups.flatMap(g => g.items).filter(([name]) => role === 'Admin Cabang' ? name !== 'Cabang' && name !== 'Pengguna & Role' && name !== 'Audit Log' && name !== 'Pengaturan' : true)

  return <div className={`${dark ? 'dark-mode' : ''} min-h-screen bg-[#f7f4ef] text-ink`}>
    {sidebarOpen && <button aria-label="Tutup menu" onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-30 bg-latte-900/30 lg:hidden"/>}
    <aside className={`fixed inset-y-0 left-0 z-40 flex ${collapsed ? 'w-[88px]' : 'w-[260px]'} flex-col border-r border-[#e9dfd3] bg-[#fcfaf7] transition-all duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
      <div className={`flex h-[82px] items-center border-b border-[#eee5da] ${collapsed ? 'justify-center px-3' : 'justify-between px-6'}`}><Brand compact={collapsed}/>{!collapsed && <button onClick={() => setCollapsed(true)} className="hidden rounded-lg p-2 text-stone-400 hover:bg-latte-100 lg:block"><PanelLeftClose size={16}/></button>}{collapsed && <button onClick={() => setCollapsed(false)} className="hidden absolute -right-3 top-8 rounded-full border border-latte-200 bg-white p-1 text-latte-600 shadow-sm lg:block"><ChevronRight size={12}/></button>}</div>
      <div className={`px-4 pt-5 ${collapsed ? 'px-3' : ''}`}><button className={`flex w-full items-center gap-3 rounded-xl border border-latte-200 bg-white p-3 text-left transition hover:border-latte-300 ${collapsed ? 'justify-center' : ''}`}><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-latte-100 text-latte-700"><Building2 size={17}/></div>{!collapsed && <div className="min-w-0 flex-1"><p className="truncate text-[11px] font-extrabold text-latte-900">{role === 'Super Admin' ? 'Semua Cabang' : role === 'Admin Cabang' ? 'Pusat Darun Nahdhah' : 'Profil Santri'}</p><p className="mt-1 text-[10px] text-stone-400">{role === 'Super Admin' ? 'Organisasi utama' : role === 'Admin Cabang' ? 'Cabang aktif' : 'Akses personal'}</p></div>}{!collapsed && <ChevronDown size={14} className="text-stone-400"/>}</button></div>
      <nav className="scrollbar-none mt-5 flex-1 overflow-y-auto px-4 pb-5">
        {!collapsed ? navGroups.map(group => <div className="mb-5" key={group.label}>
          <p className="mb-2 px-3 text-[9px] font-extrabold tracking-[.18em] text-stone-400">{group.label}</p>
          <div className="space-y-1">
            {group.items.filter(([name]) => filteredNav.some(([n]) => n === name)).map(([name, Icon]) => {
              const hasGenderSubmenu = ['Absensi Sholat', 'Absensi Kegiatan', 'Tahfidz', 'Data Santri'].includes(name)
              const isExpanded = !!expandedGenderMenus[name]
              return <div key={name}>
                <div className={`flex w-full items-center rounded-xl transition ${page === name ? 'bg-latte-700 text-white shadow-sm' : 'text-stone-500 hover:bg-latte-100 hover:text-latte-800'}`}>
                  <button onClick={() => {
                    setPage(name)
                    if (hasGenderSubmenu) setExpandedGenderMenus(current => ({ ...current, [name]: true }))
                    else setSidebarOpen(false)
                  }} className="group flex min-w-0 flex-1 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold">
                    <Icon size={16} strokeWidth={page === name ? 2.4 : 1.9}/><span className="flex-1">{name}</span>
                    {page === name && !hasGenderSubmenu && <span className="h-1.5 w-1.5 rounded-full bg-latte-300"/>}
                  </button>
                  {hasGenderSubmenu && <button aria-label={`${isExpanded ? 'Tutup' : 'Buka'} pilihan ${name}`} aria-expanded={isExpanded} onClick={() => setExpandedGenderMenus(current => ({ ...current, [name]: !current[name] }))} className={`mr-2 rounded-lg p-1.5 transition ${page === name ? 'text-latte-100 hover:bg-white/10' : 'text-stone-400 hover:bg-white'}`}><ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}/></button>}
                </div>
                {hasGenderSubmenu && isExpanded && <div className="ml-7 mt-1 space-y-1 border-l border-latte-200 pl-3">
                  {[
                    { label: 'Semua Santri', value: 'Semua' },
                    { label: 'Ikhwan', value: 'Ikhwan' },
                    { label: 'Akhwat', value: 'Akhwat' },
                  ].map(option => {
                    const selected = page === name && genderByModule[name] === option.value
                    return <button key={option.value} onClick={() => {
                      setPage(name)
                      setGenderByModule(current => ({ ...current, [name]: option.value }))
                      setSidebarOpen(false)
                    }} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[11px] font-semibold transition ${selected ? 'bg-latte-100 text-latte-800' : 'text-stone-500 hover:bg-latte-50 hover:text-latte-800'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${selected ? 'bg-latte-700' : 'bg-latte-300'}`}/>{option.label}
                      {selected && <Check size={12} className="ml-auto"/>}
                    </button>
                  })}
                </div>}
              </div>
            })}
          </div>
        </div>) : filteredNav.map(([name, Icon]) => <button key={name} title={name} onClick={() => setPage(name)} className={`mb-2 flex w-full items-center justify-center rounded-xl p-3 transition ${page === name ? 'bg-latte-700 text-white' : 'text-stone-500 hover:bg-latte-100'}`}><Icon size={18}/></button>)}
      </nav>
      <div className={`border-t border-[#eee5da] p-4 ${collapsed ? 'px-3' : ''}`}><div className={`rounded-2xl bg-latte-100/70 p-3 ${collapsed ? 'flex justify-center' : ''}`}><div className={`flex items-center gap-2.5 ${collapsed ? 'justify-center' : ''}`}><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-latte-700"><CircleHelp size={17}/></div>{!collapsed && <div><p className="text-[11px] font-extrabold text-latte-900">Butuh bantuan?</p><p className="mt-1 text-[10px] text-stone-500">Pusat panduan sistem</p></div>}</div>{!collapsed && <button onClick={() => alert('Panduan penggunaan akan ditambahkan pada tahap dokumentasi.')} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-latte-200 bg-white py-2 text-[10px] font-bold text-latte-700">Buka panduan <ArrowRight size={12}/></button>}</div></div>
    </aside>

    <div className={`min-h-screen transition-all ${collapsed ? 'lg:pl-[88px]' : 'lg:pl-[260px]'}`}>
      <header className="sticky top-0 z-20 flex h-[82px] items-center justify-between gap-4 border-b border-[#e9dfd3] bg-[#f7f4ef]/90 px-4 backdrop-blur-xl sm:px-7 xl:px-9">
        <div className="flex min-w-0 items-center gap-3"><button onClick={() => setSidebarOpen(true)} className="rounded-xl border border-latte-200 bg-white p-2.5 text-latte-700 lg:hidden"><Menu size={17}/></button><div className="min-w-0"><div className="hidden items-center gap-2 text-[10px] text-stone-400 sm:flex"><span>Darun Nahdhah</span><ChevronRight size={11}/><span className="font-bold text-latte-700">{title}</span></div><h1 className="mt-1 truncate font-display text-lg font-extrabold text-latte-900 sm:text-xl">{title}</h1></div></div>
        <div className="flex items-center gap-2 sm:gap-3"><div className="relative hidden md:block"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"/><input placeholder="Cari apa saja..." className="w-48 rounded-xl border border-[#e9dfd3] bg-white/80 py-2.5 pl-9 pr-12 text-xs outline-none placeholder:text-stone-400 focus:border-latte-400 xl:w-60"/><kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-stone-200 px-1.5 py-0.5 text-[9px] text-stone-400">⌘ K</kbd></div>
          <button onClick={() => setDark(!dark)} title="Toggle theme" className="rounded-xl border border-[#e9dfd3] bg-white p-2.5 text-stone-500 hover:text-latte-700">{dark ? <Sun size={16}/> : <Moon size={16}/>}</button>
          <div className="relative"><button onClick={() => setNotificationsOpen(!notificationsOpen)} className="relative rounded-xl border border-[#e9dfd3] bg-white p-2.5 text-stone-500 hover:text-latte-700"><Bell size={16}/><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-400 ring-2 ring-white"/></button>{notificationsOpen && <div className="absolute right-0 top-12 z-30 w-72 rounded-2xl border border-latte-100 bg-white p-4 shadow-xl"><p className="font-display text-sm font-extrabold text-latte-900">Notifikasi</p><div className="mt-3 space-y-3"><p className="text-xs leading-5 text-stone-600"><span className="font-bold text-latte-800">8 santri</span> perlu ditinjau karena kehadiran di bawah 80%.</p><p className="text-xs leading-5 text-stone-600">Rekap setoran tahfidz minggu ini siap ditinjau.</p></div></div>}</div>
          <div className="relative"><button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 rounded-xl border border-[#e9dfd3] bg-white p-1.5 pr-2.5"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-latte-700 text-[10px] font-extrabold text-white">{role === 'Super Admin' ? 'SA' : role === 'Admin Cabang' ? 'AC' : 'SF'}</div><div className="hidden text-left sm:block"><p className="text-[10px] font-extrabold text-latte-900">{role === 'Super Admin' ? 'Super Admin' : role === 'Admin Cabang' ? 'Admin Pusat' : 'Ahmad Fauzan'}</p><p className="mt-0.5 text-[9px] text-stone-400">{role}</p></div><ChevronDown size={13} className="text-stone-400"/></button>{profileOpen && <div className="absolute right-0 top-12 z-30 w-56 rounded-2xl border border-latte-100 bg-white p-3 shadow-xl"><p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">Preview role</p>{roleOptions.map(r => <button key={r} onClick={() => {setRole(r); setProfileOpen(false); setPage('Dashboard')}} className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2.5 text-xs font-semibold ${role === r ? 'bg-latte-100 text-latte-800' : 'text-stone-600 hover:bg-stone-50'}`}>{r}{role === r && <Check size={14}/>}</button>)}<div className="my-2 border-t border-stone-100"/><button onClick={() => {setLoggedIn(false); setProfileOpen(false)}} className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50"><LogOut size={14}/> Logout</button></div>}</div>
        </div>
      </header>
      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-7 sm:py-8 xl:px-9">
        {page === 'Dashboard' ? (isStudent ? <StudentPortal santri={santri}/> : <Dashboard role={role} santri={santri} activities={activities}/>) : page === 'Data Santri' ? <SantriPage santri={santri} setSantri={setSantri} role={role} genderFilter={genderByModule['Data Santri']} setGenderFilter={gender => setGenderByModule(current => ({ ...current, 'Data Santri': gender }))}/> : page === 'Kegiatan' ? <ActivitiesPage activities={activities} setActivities={setActivities} role={role}/> : <GenericPage page={page} role={role} genderFilter={genderByModule[page] || 'Semua'} setGenderFilter={gender => setGenderByModule(current => ({ ...current, [page]: gender }))}/>}
        <footer className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-[#e9dfd3] pt-5 text-[10px] text-stone-400"><p>© 2026 E-Absensi Darun Nahdhah <span className="mx-1">·</span> Frontend preview v0.2.2</p><p className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"/> Data demo · Belum terhubung backend</p></footer>
      </main>
    </div>
    {dark && <style>{`.dark-mode{filter:none;background:#211c18;color:#f6f0e8}.dark-mode aside,.dark-mode header,.dark-mode main .bg-white{background:#302821!important;color:#f6f0e8!important}.dark-mode main .text-latte-900,.dark-mode header .text-latte-900{color:#f6f0e8!important}.dark-mode main .border-\\[\\#eee5da\\],.dark-mode header{border-color:#4c3c30!important}.dark-mode main .text-stone-500,.dark-mode main .text-stone-400{color:#c3b6a8!important}.dark-mode main .bg-\\[\\#f7f4ef\\]{background:#211c18!important}`}</style>}
  </div>
}
