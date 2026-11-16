import { useEffect, useMemo, useState } from 'react'
import {
  Activity, AlarmClock, ArrowDownRight, ArrowRight, Award, Bell, BookOpen,
  Building2, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight,
  CircleHelp, ClipboardCheck, Download, FileText, Filter, GraduationCap,
  History, House, LayoutDashboard, LogOut, Menu, MoreHorizontal, Search, Settings,
  ShieldCheck, SlidersHorizontal, Sparkles, Users, UserRound, UserCog,
  X, Moon, Sun, HeartHandshake, BookMarked, Clock3, TrendingUp, MapPin,
  Plus, Pencil, Trash2, Eye, KeyRound, ChevronUp, BadgeCheck,
  CircleAlert, CalendarCheck, ChartNoAxesCombined, PanelLeftClose
} from 'lucide-react'
import { Avatar, Badge, Button, EmptyState, StatCard, Toast, addDaysToKey, formatDateID, formatNumber, toDateKey } from './ui'
import BrandLogo from './components/BrandLogo'
import TahfidzPage from './tahfidz/TahfidzPage'
import RiwayatPage from './tahfidz/RiwayatPage'
import SantriPage from './santri/SantriPage'
import SholatPage from './absensi/SholatPage'
import KegiatanAbsensiPage from './absensi/KegiatanAbsensiPage'
import ActivitiesPage from './kegiatan/ActivitiesPage'
import GenericPage from './pages/GenericPage'
import { createInitialJadwal, createInitialSetoran } from './data/tahfidz'
import {
  INITIAL_HUKUMAN, INITIAL_PARTICIPANT_CATEGORIES, INITIAL_REWARDS, INITIAL_SANTRI,
  createInitialActivities,
} from './data/master'
import { createInitialKegiatanRecords, createInitialSholatRecords } from './data/absensi'

const navGroups = [
  { label: 'WORKSPACE', items: [
    ['Dashboard', LayoutDashboard],
    ['Data Santri', Users],
    ['Absensi Sholat', ClipboardCheck],
    ['Absensi Kegiatan', CalendarCheck],
    ['Tahfidz', BookOpen],
    ['Kegiatan', CalendarDays],
    ['Riwayat Setoran', History],
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

const activityRows = [
  { title: 'Sholat Subuh berjamaah', type: 'Sholat', time: '04.30', present: 184, total: 192, status: 'Selesai' },
  { title: 'Setoran tahfidz pagi', type: 'Tahfidz', time: '06.00', present: 176, total: 192, status: 'Berlangsung' },
  { title: 'Kajian Kitab Akhlak', type: 'Kegiatan', time: '08.00', present: 188, total: 192, status: 'Terjadwal' },
  { title: 'Sholat Dzuhur berjamaah', type: 'Sholat', time: '12.15', present: 0, total: 192, status: 'Terjadwal' },
]

function Brand({ compact = false, invert = false }) {
  return <div className="flex min-w-0 items-center gap-3">
    <BrandLogo variant="sidebar" />
    {!compact && <div className="min-w-0">
      <p className={`truncate font-display text-sm font-extrabold tracking-tight ${invert ? 'text-white' : 'text-leaf-900'}`}>E-Absensi</p>
      <p className={`mt-0.5 truncate text-[10px] font-bold uppercase tracking-[.19em] ${invert ? 'text-leaf-200' : 'text-leaf-500'}`}>Darun Nahdhah</p>
    </div>}
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
  const dotColor = (category) => category === 'Tahfidz' ? 'bg-emerald-600' : category === 'Sholat' ? 'bg-amber-500' : category === 'Pembinaan' ? 'bg-rose-500' : 'bg-leaf-600'

  return <>
    <section className="rounded-2xl border border-[#e0e9de] bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-leaf-100 text-leaf-700"><CalendarDays size={17}/></div><div><h3 className="font-display text-base font-extrabold text-leaf-900">Kalender kegiatan</h3><p className="mt-1 text-xs text-stone-500">Klik tanggal bertitik untuk melihat pengingat.</p></div></div>
        </div>
        <div className="flex items-center gap-1">
          <button aria-label="Bulan sebelumnya" onClick={() => changeMonth(-1)} className="rounded-lg border border-leaf-100 p-2 text-leaf-700 hover:bg-leaf-50"><ChevronLeft size={15}/></button>
          <button aria-label="Bulan berikutnya" onClick={() => changeMonth(1)} className="rounded-lg border border-leaf-100 p-2 text-leaf-700 hover:bg-leaf-50"><ChevronRight size={15}/></button>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between gap-2"><h4 className="font-display text-sm font-extrabold capitalize text-leaf-900">{monthLabel}</h4><button onClick={() => { const now = new Date(); setMonth(new Date(now.getFullYear(), now.getMonth(), 1)); setSelectedDate(todayKey); setDetailOpen(true) }} className="rounded-lg px-2.5 py-1.5 text-[10px] font-extrabold text-leaf-700 hover:bg-leaf-50">Hari ini</button></div>
      <div className="mt-3 grid grid-cols-7 gap-1 text-center">
        {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map(day => <div key={day} className="py-2 text-[10px] font-bold text-stone-400">{day}</div>)}
        {cells.map((day, index) => {
          if (!day) return <div key={`empty-${index}`} className="min-h-[48px] rounded-xl" />
          const key = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const dayEvents = eventMap[key] || []
          const isToday = key === todayKey
          const isSelected = key === selectedDate
          return <button key={key} onClick={() => pickDate(day)} aria-label={`${day} ${monthLabel}${dayEvents.length ? `, ${dayEvents.length} kegiatan` : ''}`} className={`relative flex min-h-[48px] flex-col items-center justify-start rounded-xl px-1 py-2 transition ${isSelected ? 'bg-leaf-700 text-white shadow-sm' : isToday ? 'border border-leaf-300 bg-leaf-50 text-leaf-800' : 'text-stone-600 hover:bg-leaf-50'}`}>
            <span className="text-xs font-bold">{day}</span>
            {dayEvents.length > 0 && <span className="mt-1 flex max-w-full items-center justify-center gap-0.5">{dayEvents.slice(0, 3).map((event, dotIndex) => <span key={`${event.id}-${dotIndex}`} className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white' : dotColor(event.category)}`} />)}</span>}
            {dayEvents.length > 1 && <span className={`mt-0.5 text-[8px] font-bold ${isSelected ? 'text-white/80' : 'text-stone-400'}`}>{dayEvents.length} agenda</span>}
          </button>
        })}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-stone-100 pt-3">
        <span className="flex items-center gap-1.5 text-[10px] text-stone-500"><span className="h-2 w-2 rounded-full bg-leaf-600"/>Kegiatan</span>
        <span className="flex items-center gap-1.5 text-[10px] text-stone-500"><span className="h-2 w-2 rounded-full bg-emerald-600"/>Tahfidz</span>
        <span className="flex items-center gap-1.5 text-[10px] text-stone-500"><span className="h-2 w-2 rounded-full bg-amber-500"/>Sholat</span>
        <span className="ml-auto text-[10px] font-semibold text-leaf-700">{activities.length} agenda tersimpan</span>
      </div>
      {eventsOnSelectedDate.length > 0 && <div className="mt-4 rounded-xl bg-leaf-50 p-3"><div className="flex items-center justify-between gap-2"><div><p className="text-[10px] font-bold uppercase tracking-wider text-leaf-600">Agenda terdekat</p><p className="mt-1 text-xs font-extrabold text-leaf-900">{eventsOnSelectedDate[0].title}</p></div><button onClick={() => setDetailOpen(true)} className="shrink-0 rounded-lg bg-white px-3 py-2 text-[10px] font-extrabold text-leaf-700 shadow-sm hover:bg-leaf-100">Lihat detail</button></div><p className="mt-1 text-[10px] text-stone-500">{formatDateID(selectedDate)} · {eventsOnSelectedDate[0].time} WIB</p></div>}
    </section>
    {detailOpen && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-leaf-900/40 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setDetailOpen(false) }}>
      <div role="dialog" aria-modal="true" aria-labelledby="calendar-detail-title" className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between bg-leaf-800 p-5 text-white"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-leaf-200">Pengingat kegiatan</p><h3 id="calendar-detail-title" className="mt-2 font-display text-xl font-extrabold capitalize">{formatDateID(selectedDate)}</h3><p className="mt-1 text-xs text-leaf-100/75">{eventsOnSelectedDate.length} kegiatan pada tanggal ini</p></div><button onClick={() => setDetailOpen(false)} aria-label="Tutup detail" className="rounded-xl bg-white/10 p-2 text-white hover:bg-white/20"><X size={17}/></button></div>
        <div className="max-h-[60vh] space-y-3 overflow-y-auto p-5">
          {eventsOnSelectedDate.length === 0 ? <div className="py-8 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-leaf-50 text-leaf-500"><CalendarDays size={21}/></div><p className="mt-3 text-sm font-extrabold text-leaf-900">Belum ada kegiatan</p><p className="mt-1 text-xs text-stone-500">Belum ada agenda yang dijadwalkan pada tanggal ini.</p></div> : eventsOnSelectedDate.slice().sort((a, b) => a.time.localeCompare(b.time)).map(event => <div key={event.id} className="rounded-2xl border border-stone-100 p-4"><div className="flex items-start gap-3"><div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${event.category === 'Tahfidz' ? 'bg-emerald-50 text-emerald-700' : event.category === 'Sholat' ? 'bg-amber-50 text-amber-700' : event.category === 'Pembinaan' ? 'bg-rose-50 text-rose-700' : 'bg-leaf-100 text-leaf-700'}`}><CalendarDays size={18}/></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-2"><h4 className="text-sm font-extrabold text-leaf-900">{event.title}</h4><Badge tone={event.category === 'Tahfidz' ? 'green' : event.category === 'Sholat' ? 'amber' : event.category === 'Pembinaan' ? 'red' : 'leaf'}>{event.category}</Badge></div><div className="mt-3 grid gap-2 sm:grid-cols-2"><p className="flex items-center gap-2 text-xs text-stone-600"><Clock3 size={14} className="text-leaf-500"/>{event.time} WIB</p><p className="flex items-center gap-2 text-xs text-stone-600"><Users size={14} className="text-leaf-500"/>{event.participants}</p><p className="flex items-center gap-2 text-xs text-stone-600"><Building2 size={14} className="text-leaf-500"/>{event.branch}</p>{event.location && <p className="flex items-center gap-2 text-xs text-stone-600"><MapPin size={14} className="text-leaf-500"/>{event.location}</p>}</div>{event.notes && <p className="mt-3 border-t border-stone-100 pt-3 text-xs leading-5 text-stone-500">{event.notes}</p>}</div></div></div>)}
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
    <div className="relative overflow-hidden rounded-[26px] bg-leaf-800 p-6 text-white md:p-8">
      <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border border-white/10" />
      <div className="absolute -right-1 top-5 h-44 w-44 rounded-full border border-white/10" />
      <div className="absolute bottom-0 right-28 h-24 w-24 rounded-full bg-leaf-500/20 blur-2xl" />
      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.17em] text-leaf-100"><Sparkles size={12}/> Ringkasan hari ini · {todayLabel}</div>
        <div className="mt-4 inline-flex flex-wrap items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2"><span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-70"></span><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300"></span></span><span className="text-[10px] font-extrabold uppercase tracking-[.14em] text-emerald-100">REAL TIME</span><span className="text-xs font-bold tabular-nums text-white">{timeLabel} WIB</span><span className="text-[10px] text-leaf-100/70">· Jam live, data dashboard masih demo</span></div>
        <h2 className="mt-5 font-display text-2xl font-extrabold leading-tight md:text-3xl">Assalamu’alaikum, {isSuper ? 'Pengelola Darun Nahdhah' : 'Admin Cabang'} <span className="inline-block">✦</span></h2>
        <p className="mt-2 max-w-lg text-sm leading-6 text-leaf-100/80">Pantau kedisiplinan, aktivitas ibadah, dan perkembangan santri dari satu ruang kerja yang terintegrasi.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'Absensi Sholat' }))} className="!bg-white !text-leaf-800 hover:!bg-leaf-100" icon={ClipboardCheck}>Input Absensi</Button>
          <Button variant="ghost" onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'Laporan PDF' }))} className="!text-white hover:!bg-white/10" icon={ArrowRight}>Lihat Laporan</Button>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 hidden h-full w-[36%] items-end justify-center md:flex">
        <div className="mb-[-22px] mr-10 flex h-56 w-56 items-center justify-center rounded-t-full border border-white/15 bg-white/[.06]">
          <div className="flex h-40 w-40 items-center justify-center rounded-t-full border border-white/20 bg-white/[.05]">
            <BrandLogo variant="document" size={88} className="shadow-soft" />
          </div>
        </div>
      </div>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total Santri" value={formatNumber(isSuper ? 1248 : 192)} change="+8,2%" note="vs bulan lalu" icon={Users} color="bg-leaf-100 text-leaf-700"/>
      <StatCard label="Kehadiran Sholat" value="94,8%" change="+2,4%" note="rata-rata hari ini" icon={ClipboardCheck} color="bg-[#e4efdf] text-[#4f8060]"/>
      <StatCard label="Setoran Tahfidz" value={formatNumber(isSuper ? 326 : 48)} change="+12,6%" note="setoran minggu ini" icon={BookOpen} color="bg-[#fbf0dc] text-[#b07d2b]"/>
      <StatCard label="Perlu Perhatian" value={formatNumber(isSuper ? 27 : 8)} change="−3 santri" note="dari minggu lalu" icon={HeartHandshake} color="bg-[#fbe9e4] text-[#c1705f]"/>
    </div>

    <CalendarWidget activities={activities} />

    <div className="grid gap-5 xl:grid-cols-[1.45fr_1fr]">
      <section className="rounded-2xl border border-[#e0e9de] bg-white p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h3 className="font-display text-base font-extrabold text-leaf-900">Kehadiran santri</h3><p className="mt-1 text-xs text-stone-500">Persentase kehadiran 7 hari terakhir</p></div>
          <button className="inline-flex items-center gap-2 rounded-lg border border-leaf-100 px-3 py-2 text-[11px] font-bold text-leaf-700">Minggu ini <ChevronDown size={13}/></button>
        </div>
        <div className="mt-7 flex h-44 items-end justify-between gap-3 px-1">
          {[['Sab',68,78],['Min',78,86],['Sen',74,82],['Sel',85,92],['Rab',80,88],['Kam',90,96],['Jum',86,94]].map(([day, a, b]) => <div className="flex flex-1 flex-col items-center gap-2" key={day}>
            <div className="flex h-36 w-full items-end justify-center gap-1.5">
              <div className="w-[36%] rounded-t-md bg-leaf-200 transition-all" style={{height: `${a}%`}}/>
              <div className="w-[36%] rounded-t-md bg-leaf-700 transition-all" style={{height: `${b}%`}}/>
            </div><span className="text-[10px] font-semibold text-stone-400">{day}</span>
          </div>)}
        </div>
        <div className="mt-4 flex items-center justify-center gap-5 border-t border-stone-100 pt-4">
          <span className="flex items-center gap-2 text-[11px] font-semibold text-stone-500"><span className="h-2.5 w-2.5 rounded-sm bg-leaf-200"/>Kegiatan</span>
          <span className="flex items-center gap-2 text-[11px] font-semibold text-stone-500"><span className="h-2.5 w-2.5 rounded-sm bg-leaf-700"/>Sholat berjamaah</span>
        </div>
      </section>

      <section className="rounded-2xl border border-[#e0e9de] bg-white p-5 shadow-soft">
        <div className="flex items-start justify-between"><div><h3 className="font-display text-base font-extrabold text-leaf-900">Komposisi santri</h3><p className="mt-1 text-xs text-stone-500">Berdasarkan kategori</p></div><button className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-50"><MoreHorizontal size={18}/></button></div>
        <div className="mt-5 flex items-center gap-5">
          <div className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-full" style={{background: 'conic-gradient(#245c43 0 57%, #a9c5a0 57% 100%)'}}>
            <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white"><span className="font-display text-2xl font-extrabold text-leaf-900">{isSuper ? '1.248' : '192'}</span><span className="text-[10px] text-stone-400">Santri</span></div>
          </div>
          <div className="min-w-0 flex-1 space-y-4">
            <div><div className="flex items-center justify-between text-xs"><span className="flex items-center gap-2 font-semibold text-stone-600"><span className="h-2.5 w-2.5 rounded-full bg-leaf-700"/>Ikhwan</span><strong className="text-leaf-900">57%</strong></div><p className="mt-1 text-[10px] text-stone-400">{isSuper ? '711' : '109'} santri</p></div>
            <div><div className="flex items-center justify-between text-xs"><span className="flex items-center gap-2 font-semibold text-stone-600"><span className="h-2.5 w-2.5 rounded-full bg-leaf-300"/>Akhwat</span><strong className="text-leaf-900">43%</strong></div><p className="mt-1 text-[10px] text-stone-400">{isSuper ? '537' : '83'} santri</p></div>
          </div>
        </div>
        <div className="mt-5 rounded-xl bg-leaf-50 p-3.5"><div className="flex items-center gap-2 text-xs font-bold text-leaf-800"><Sparkles size={14}/>Insight singkat</div><p className="mt-1.5 text-[11px] leading-5 text-stone-500">Kehadiran sholat meningkat 2,4% dibanding periode sebelumnya. Pertahankan konsistensi pembinaan.</p></div>
      </section>
    </div>

    <section className="rounded-2xl border border-[#e0e9de] bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-display text-base font-extrabold text-leaf-900">Aktivitas hari ini</h3><p className="mt-1 text-xs text-stone-500">Jadwal dan ringkasan kehadiran terbaru</p></div><Button variant="outline" onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'Kegiatan' }))}>Semua aktivitas <ArrowRight size={14}/></Button></div>
      <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[580px] text-left"><thead><tr className="border-b border-stone-100 text-[10px] uppercase tracking-wider text-stone-400"><th className="pb-3 font-bold">Aktivitas</th><th className="pb-3 font-bold">Waktu</th><th className="pb-3 font-bold">Kehadiran</th><th className="pb-3 font-bold">Status</th><th className="pb-3 text-right font-bold">Detail</th></tr></thead><tbody>{activityRows.map((item) => <tr className="border-b border-stone-50 last:border-0" key={item.title}><td className="py-3.5"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-leaf-50 text-leaf-700">{item.type === 'Tahfidz' ? <BookOpen size={16}/> : item.type === 'Sholat' ? <Clock3 size={16}/> : <CalendarDays size={16}/>}</div><div><p className="text-xs font-bold text-leaf-900">{item.title}</p><p className="mt-1 text-[10px] text-stone-400">{item.type}</p></div></div></td><td className="py-3.5 text-xs font-semibold text-stone-600">{item.time}</td><td className="py-3.5"><div className="flex items-center gap-2"><div className="h-1.5 w-20 overflow-hidden rounded-full bg-stone-100"><div className="h-full rounded-full bg-leaf-600" style={{width: `${item.total ? item.present/item.total*100 : 0}%`}}/></div><span className="text-[10px] text-stone-500">{item.present ? `${item.present}/${item.total}` : 'Belum ada'}</span></div></td><td className="py-3.5"><Badge tone={item.status === 'Selesai' ? 'green' : item.status === 'Berlangsung' ? 'amber' : 'neutral'}>{item.status}</Badge></td><td className="py-3.5 text-right"><button className="rounded-lg p-2 text-stone-400 hover:bg-leaf-50 hover:text-leaf-700"><ChevronRight size={15}/></button></td></tr>)}</tbody></table></div>
    </section>
  </div>
}

function StudentPortal({ santri }) {
  const [tab, setTab] = useState('Ringkasan')
  const student = santri[0]
  return <div className="space-y-5">
    <div className="relative overflow-hidden rounded-[26px] bg-[#eaf2e6] p-6 md:p-8"><div className="absolute -right-5 -top-12 h-48 w-48 rounded-full border border-[#c8d6c2]"/><div className="relative z-10 flex flex-wrap items-center gap-4"><Avatar name={student?.name || 'Ahmad Fauzan'} tone="green" size="lg"/><div className="flex-1"><Badge tone="green"><BadgeCheck size={12}/> Santri Aktif</Badge><h2 className="mt-3 font-display text-2xl font-extrabold text-leaf-900">Assalamu’alaikum, {student?.name || 'Ahmad Fauzan'}!</h2><p className="mt-1 text-sm text-stone-600">Semoga hari ini penuh keberkahan dan semangat dalam menuntut ilmu.</p></div><div className="rounded-2xl border border-white/70 bg-white/70 p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Nomor Induk</p><p className="mt-1 font-display font-extrabold text-leaf-900">{student?.nis || 'DN-24001'}</p></div></div></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Kehadiran bulan ini" value={`${student?.attendance || 96}%`} change="+3,2%" note="vs bulan lalu" icon={ClipboardCheck} color="bg-[#e4efdf] text-[#4f8060]"/><StatCard label="Hafalan tercapai" value={student?.tahfidz || '8 Juz'} change="+1 juz" note="bulan ini" icon={BookOpen} color="bg-leaf-100 text-leaf-700"/><StatCard label="Reward diterima" value="4" change="+1" note="bulan ini" icon={Award} color="bg-[#fbf0dc] text-[#b07d2b]"/><StatCard label="Catatan pembinaan" value="1" change="−2" note="bulan ini" icon={HeartHandshake} color="bg-[#fbe9e4] text-[#c1705f]"/></div>
    <div className="flex gap-2 overflow-x-auto rounded-xl bg-white p-1.5 shadow-soft">{['Ringkasan','Riwayat Sholat','Tahfidz','Reward'].map(t => <button key={t} onClick={() => setTab(t)} className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-xs font-bold transition ${tab === t ? 'bg-leaf-700 text-white' : 'text-stone-500 hover:bg-leaf-50'}`}>{t}</button>)}</div>
    <section className="rounded-2xl border border-[#e0e9de] bg-white p-5 shadow-soft"><div className="flex items-center justify-between"><div><h3 className="font-display text-base font-extrabold text-leaf-900">{tab === 'Ringkasan' ? 'Aktivitas terbaru' : tab}</h3><p className="mt-1 text-xs text-stone-500">Informasi pribadi yang tercatat di sistem</p></div><BookMarked className="text-leaf-500" size={20}/></div><div className="mt-5 space-y-3">{(tab === 'Tahfidz' ? [['Setoran Al-Baqarah ayat 1–10','Hari ini · Nilai A'],['Murojaah Juz 29','Kemarin · Nilai A+']] : tab === 'Reward' ? [['Teladan kedisiplinan','21 Okt 2026 · +50 poin'],['Hafalan konsisten','10 Okt 2026 · +25 poin']] : [['Sholat Subuh berjamaah','Hari ini · Hadir'],['Setoran tahfidz pagi','Hari ini · Selesai'],['Kajian Kitab Akhlak','Kemarin · Hadir']]).map(([a,b]) => <div key={a} className="flex items-center gap-3 rounded-xl border border-stone-100 p-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-leaf-50 text-leaf-700"><Check size={16}/></div><div className="flex-1"><p className="text-xs font-bold text-leaf-900">{a}</p><p className="mt-1 text-[10px] text-stone-400">{b}</p></div><ChevronRight size={15} className="text-stone-300"/></div>)}</div></section>
  </div>
}

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('superadmin@darunnahdhah.id')
  const [password, setPassword] = useState('darunnahdhah')
  const [showPassword, setShowPassword] = useState(false)
  const [forgot, setForgot] = useState(false)
  return <div className="min-h-screen bg-[#f5f8f3] lg:grid lg:grid-cols-[1.05fr_.95fr]">
    <div className="relative hidden overflow-hidden bg-leaf-800 p-12 text-white lg:flex lg:flex-col lg:justify-between">
      <div className="absolute inset-0 soft-grid opacity-20"/><div className="absolute -right-20 top-24 h-96 w-96 rounded-full border border-white/10"/><div className="absolute -right-2 top-44 h-64 w-64 rounded-full border border-white/10"/><div className="relative z-10"><Brand invert/><p className="mt-4 max-w-xs text-[10px] font-bold uppercase leading-5 tracking-[.16em] text-leaf-100/60">Pondok Pesantren Darun Nahdhah Al-Islamiyah</p><p className="mt-16 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.18em]"><Sparkles size={12}/> Santri management, made thoughtful</p><h1 className="mt-6 max-w-xl font-display text-5xl font-extrabold leading-[1.12]">Menjaga disiplin.<br/><span className="text-[#a9c5a0]">Menumbuhkan</span><br/>generasi Qur’ani.</h1><p className="mt-5 max-w-md text-sm leading-7 text-leaf-100/75">Satu ruang digital untuk memantau ibadah, kegiatan, dan perjalanan hafalan santri Darun Nahdhah.</p></div>
      <div className="relative z-10 grid grid-cols-3 gap-3">{[['01','Terintegrasi'],['02','Terpantau'],['03','Terarah']].map(([n,t]) => <div key={n} className="border-t border-white/20 pt-3"><p className="text-xs font-bold text-[#a9c5a0]">{n}</p><p className="mt-1 text-xs text-white/75">{t}</p></div>)}</div>
    </div>
    <div className="flex min-h-screen items-center justify-center p-5 sm:p-10"><div className="w-full max-w-md">
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <BrandLogo variant="login" />
          <div className="min-w-0">
            <p className="font-display text-sm font-extrabold leading-5 text-leaf-900">Pondok Pesantren<br/>Darun Nahdhah Al-Islamiyah</p>
            <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-leaf-500">E-Absensi Darun Nahdhah</p>
          </div>
        </div>
        <p className="mt-7 text-xs font-bold uppercase tracking-[.16em] text-leaf-500">{forgot ? 'Pemulihan akun' : 'Selamat datang kembali'}</p><h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-leaf-900">{forgot ? 'Lupa kata sandi?' : 'Masuk ke akun Anda'}</h2><p className="mt-2 text-sm leading-6 text-stone-500">{forgot ? 'Masukkan email akun untuk menerima instruksi pemulihan.' : 'Masuk untuk melanjutkan pengelolaan data santri.'}</p>
      </div>
      <form onSubmit={e => {e.preventDefault(); if (forgot) {alert('Demo: instruksi reset password akan dikirim melalui backend.'); setForgot(false)} else onLogin(email)}} className="space-y-4">
        <label className="block text-xs font-bold text-stone-700">Email atau username<div className="relative mt-2"><UserRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={16}/><input required value={email} onChange={e => setEmail(e.target.value)} type="text" className="w-full rounded-xl border border-stone-200 bg-white py-3.5 pl-10 pr-4 text-sm outline-none transition focus:border-leaf-400 focus:ring-4 focus:ring-leaf-100" placeholder="nama@darunnahdhah.id"/></div></label>
        {!forgot && <label className="block text-xs font-bold text-stone-700">Kata sandi<div className="relative mt-2"><KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={16}/><input required value={password} onChange={e => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} className="w-full rounded-xl border border-stone-200 bg-white py-3.5 pl-10 pr-16 text-sm outline-none transition focus:border-leaf-400 focus:ring-4 focus:ring-leaf-100" placeholder="Masukkan kata sandi"/><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-leaf-600">{showPassword ? 'Sembunyikan' : 'Lihat'}</button></div></label>}
        {!forgot && <div className="flex items-center justify-between text-xs"><label className="flex items-center gap-2 text-stone-500"><input type="checkbox" className="rounded border-stone-300 accent-leaf-700"/> Ingat saya</label><button type="button" onClick={() => setForgot(true)} className="font-bold text-leaf-700 hover:underline">Lupa password?</button></div>}
        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-leaf-700 py-3.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-leaf-800">{forgot ? 'Kirim instruksi reset' : 'Masuk ke Dashboard'}<ArrowRight size={16}/></button>
      </form>
      {!forgot && <div className="mt-6 rounded-xl border border-leaf-200 bg-leaf-50 p-4"><p className="flex items-center gap-2 text-xs font-extrabold text-leaf-800"><CircleHelp size={14}/> Akun demo</p><p className="mt-2 text-[11px] leading-5 text-stone-500">Email: superadmin@darunnahdhah.id<br/>Password: darunnahdhah</p><p className="mt-1 text-[10px] text-stone-400">Preview frontend saja — autentikasi belum terhubung backend.</p></div>}
      {forgot && <button onClick={() => setForgot(false)} className="mt-5 flex items-center gap-2 text-xs font-bold text-leaf-700"><ChevronLeft size={14}/> Kembali ke login</button>}
      <p className="mt-10 text-center text-[10px] text-stone-400">© 2026 Pondok Pesantren Darun Nahdhah Al-Islamiyah · E-Absensi</p>
    </div></div>
  </div>
}

export default function App() {
  const [page, setPage] = useState('Dashboard')
  const [role, setRole] = useState('Super Admin')
  const [loggedIn, setLoggedIn] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [santri, setSantri] = useState(INITIAL_SANTRI)
  const [activities, setActivities] = useState(createInitialActivities)
  const [participantCategories, setParticipantCategories] = useState(INITIAL_PARTICIPANT_CATEGORIES)
  const [sholatRecords, setSholatRecords] = useState(createInitialSholatRecords)
  const [kegiatanRecords, setKegiatanRecords] = useState(() => createInitialKegiatanRecords(createInitialActivities()))
  const [rewards] = useState(INITIAL_REWARDS)
  const [hukuman] = useState(INITIAL_HUKUMAN)
  const [jadwalTahfidz, setJadwalTahfidz] = useState(createInitialJadwal)
  const [setoranTahfidz, setSetoranTahfidz] = useState(createInitialSetoran)
  const [riwayatPreset, setRiwayatPreset] = useState(null)
  const [genderByModule, setGenderByModule] = useState({ 'Data Santri': null, 'Absensi Sholat': null, 'Absensi Kegiatan': null, 'Tahfidz': null })
  const [toast, setToast] = useState(null)
  const [expandedGenderMenus, setExpandedGenderMenus] = useState({})
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const handler = (e) => setPage(e.detail)
    window.addEventListener('navigate', handler)
    return () => window.removeEventListener('navigate', handler)
  }, [])

  const notify = (message, tone = 'success') => setToast({ message, tone, id: Date.now() })

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

  return <div className={`${dark ? 'dark-mode' : ''} min-h-screen bg-[#f5f8f3] text-ink`}>
    {sidebarOpen && <button aria-label="Tutup menu" onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-30 bg-leaf-900/30 lg:hidden"/>}
    <aside className={`fixed inset-y-0 left-0 z-40 flex ${collapsed ? 'w-[88px]' : 'w-[260px]'} flex-col border-r border-[#dce6d8] bg-[#fafcf8] transition-all duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
      <div className={`flex h-[82px] items-center border-b border-[#e0e9de] ${collapsed ? 'justify-center px-3' : 'justify-between px-6'}`}><Brand compact={collapsed}/>{!collapsed && <button onClick={() => setCollapsed(true)} className="hidden rounded-lg p-2 text-stone-400 hover:bg-leaf-100 lg:block"><PanelLeftClose size={16}/></button>}{collapsed && <button onClick={() => setCollapsed(false)} className="hidden absolute -right-3 top-8 rounded-full border border-leaf-200 bg-white p-1 text-leaf-600 shadow-sm lg:block"><ChevronRight size={12}/></button>}</div>
      <div className={`px-4 pt-5 ${collapsed ? 'px-3' : ''}`}><button className={`flex w-full items-center gap-3 rounded-xl border border-leaf-200 bg-white p-3 text-left transition hover:border-leaf-300 ${collapsed ? 'justify-center' : ''}`}><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-leaf-100 text-leaf-700"><Building2 size={17}/></div>{!collapsed && <div className="min-w-0 flex-1"><p className="truncate text-[11px] font-extrabold text-leaf-900">{role === 'Super Admin' ? 'Semua Cabang' : role === 'Admin Cabang' ? 'Pusat Darun Nahdhah' : 'Profil Santri'}</p><p className="mt-1 text-[10px] text-stone-400">{role === 'Super Admin' ? 'Organisasi utama' : role === 'Admin Cabang' ? 'Cabang aktif' : 'Akses personal'}</p></div>}{!collapsed && <ChevronDown size={14} className="text-stone-400"/>}</button></div>
      <nav className="scrollbar-none mt-5 flex-1 overflow-y-auto px-4 pb-5">
        {!collapsed ? navGroups.map(group => <div className="mb-5" key={group.label}>
          <p className="mb-2 px-3 text-[9px] font-extrabold tracking-[.18em] text-stone-400">{group.label}</p>
          <div className="space-y-1">
            {group.items.filter(([name]) => filteredNav.some(([n]) => n === name)).map(([name, Icon]) => {
              const hasGenderSubmenu = ['Absensi Sholat', 'Absensi Kegiatan', 'Tahfidz', 'Data Santri'].includes(name)
              const isExpanded = !!expandedGenderMenus[name]
              return <div key={name}>
                <div className={`flex w-full items-center rounded-xl transition ${page === name ? 'bg-leaf-700 text-white shadow-sm' : 'text-stone-500 hover:bg-leaf-100 hover:text-leaf-800'}`}>
                  <button onClick={() => {
                    setPage(name)
                    if (hasGenderSubmenu) setExpandedGenderMenus(current => ({ ...current, [name]: true }))
                    else setSidebarOpen(false)
                  }} className="group flex min-w-0 flex-1 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold">
                    <Icon size={16} strokeWidth={page === name ? 2.4 : 1.9}/><span className="flex-1">{name}</span>
                    {page === name && !hasGenderSubmenu && <span className="h-1.5 w-1.5 rounded-full bg-leaf-300"/>}
                  </button>
                  {hasGenderSubmenu && <button aria-label={`${isExpanded ? 'Tutup' : 'Buka'} pilihan ${name}`} aria-expanded={isExpanded} onClick={() => setExpandedGenderMenus(current => ({ ...current, [name]: !current[name] }))} className={`mr-2 rounded-lg p-1.5 transition ${page === name ? 'text-leaf-100 hover:bg-white/10' : 'text-stone-400 hover:bg-white'}`}><ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}/></button>}
                </div>
                {hasGenderSubmenu && isExpanded && <div className="ml-7 mt-1 space-y-1 border-l border-leaf-200 pl-3">
                  {[
                    { label: 'Ikhwan', value: 'Ikhwan' },
                    { label: 'Akhwat', value: 'Akhwat' },
                  ].map(option => {
                    const selected = page === name && genderByModule[name] === option.value
                    return <button key={option.value} onClick={() => {
                      setPage(name)
                      setGenderByModule(current => ({ ...current, [name]: option.value }))
                      setSidebarOpen(false)
                    }} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[11px] font-semibold transition ${selected ? 'bg-leaf-100 text-leaf-800' : 'text-stone-500 hover:bg-leaf-50 hover:text-leaf-800'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${selected ? 'bg-leaf-700' : 'bg-leaf-300'}`}/>{option.label}
                      {selected && <Check size={12} className="ml-auto"/>}
                    </button>
                  })}
                </div>}
              </div>
            })}
          </div>
        </div>) : filteredNav.map(([name, Icon]) => <button key={name} title={name} onClick={() => setPage(name)} className={`mb-2 flex w-full items-center justify-center rounded-xl p-3 transition ${page === name ? 'bg-leaf-700 text-white' : 'text-stone-500 hover:bg-leaf-100'}`}><Icon size={18}/></button>)}
      </nav>
      <div className={`border-t border-[#e0e9de] p-4 ${collapsed ? 'px-3' : ''}`}><div className={`rounded-2xl bg-leaf-100/70 p-3 ${collapsed ? 'flex justify-center' : ''}`}><div className={`flex items-center gap-2.5 ${collapsed ? 'justify-center' : ''}`}><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-leaf-700"><CircleHelp size={17}/></div>{!collapsed && <div><p className="text-[11px] font-extrabold text-leaf-900">Butuh bantuan?</p><p className="mt-1 text-[10px] text-stone-500">Pusat panduan sistem</p></div>}</div>{!collapsed && <button onClick={() => alert('Panduan penggunaan akan ditambahkan pada tahap dokumentasi.')} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-leaf-200 bg-white py-2 text-[10px] font-bold text-leaf-700">Buka panduan <ArrowRight size={12}/></button>}</div></div>
    </aside>

    <div className={`app-shell min-h-screen transition-all ${collapsed ? 'lg:pl-[88px]' : 'lg:pl-[260px]'}`}>
      <header className="sticky top-0 z-20 flex h-[82px] items-center justify-between gap-4 border-b border-[#dce6d8] bg-[#f5f8f3]/90 px-4 backdrop-blur-xl sm:px-7 xl:px-9">
        <div className="flex min-w-0 items-center gap-3"><button onClick={() => setSidebarOpen(true)} className="rounded-xl border border-leaf-200 bg-white p-2.5 text-leaf-700 lg:hidden"><Menu size={17}/></button><div className="min-w-0"><div className="hidden items-center gap-2 text-[10px] text-stone-400 sm:flex"><span>Darun Nahdhah</span><ChevronRight size={11}/><span className="font-bold text-leaf-700">{title}</span></div><h1 className="mt-1 truncate font-display text-lg font-extrabold text-leaf-900 sm:text-xl">{title}</h1></div></div>
        <div className="flex items-center gap-2 sm:gap-3"><div className="relative hidden md:block"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"/><input placeholder="Cari apa saja..." className="w-48 rounded-xl border border-[#dce6d8] bg-white/80 py-2.5 pl-9 pr-12 text-xs outline-none placeholder:text-stone-400 focus:border-leaf-400 xl:w-60"/><kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-stone-200 px-1.5 py-0.5 text-[9px] text-stone-400">⌘ K</kbd></div>
          <button onClick={() => setDark(!dark)} title="Toggle theme" className="rounded-xl border border-[#dce6d8] bg-white p-2.5 text-stone-500 hover:text-leaf-700">{dark ? <Sun size={16}/> : <Moon size={16}/>}</button>
          <div className="relative"><button onClick={() => setNotificationsOpen(!notificationsOpen)} className="relative rounded-xl border border-[#dce6d8] bg-white p-2.5 text-stone-500 hover:text-leaf-700"><Bell size={16}/><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-400 ring-2 ring-white"/></button>{notificationsOpen && <div className="absolute right-0 top-12 z-30 w-72 rounded-2xl border border-leaf-100 bg-white p-4 shadow-xl"><p className="font-display text-sm font-extrabold text-leaf-900">Notifikasi</p><div className="mt-3 space-y-3"><p className="text-xs leading-5 text-stone-600"><span className="font-bold text-leaf-800">8 santri</span> perlu ditinjau karena kehadiran di bawah 80%.</p><p className="text-xs leading-5 text-stone-600">Rekap setoran tahfidz minggu ini siap ditinjau.</p></div></div>}</div>
          <div className="relative"><button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 rounded-xl border border-[#dce6d8] bg-white p-1.5 pr-2.5"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-leaf-700 text-[10px] font-extrabold text-white">{role === 'Super Admin' ? 'SA' : role === 'Admin Cabang' ? 'AC' : 'SF'}</div><div className="hidden text-left sm:block"><p className="text-[10px] font-extrabold text-leaf-900">{role === 'Super Admin' ? 'Super Admin' : role === 'Admin Cabang' ? 'Admin Pusat' : 'Ahmad Fauzan'}</p><p className="mt-0.5 text-[9px] text-stone-400">{role}</p></div><ChevronDown size={13} className="text-stone-400"/></button>{profileOpen && <div className="absolute right-0 top-12 z-30 w-56 rounded-2xl border border-leaf-100 bg-white p-3 shadow-xl"><p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">Preview role</p>{roleOptions.map(r => <button key={r} onClick={() => {setRole(r); setProfileOpen(false); setPage('Dashboard')}} className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2.5 text-xs font-semibold ${role === r ? 'bg-leaf-100 text-leaf-800' : 'text-stone-600 hover:bg-stone-50'}`}>{r}{role === r && <Check size={14}/>}</button>)}<div className="my-2 border-t border-stone-100"/><button onClick={() => {setLoggedIn(false); setProfileOpen(false)}} className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50"><LogOut size={14}/> Logout</button></div>}</div>
        </div>
      </header>
      <main className="app-main mx-auto max-w-[1600px] px-4 py-6 sm:px-7 sm:py-8 xl:px-9">
        {page === 'Dashboard' ? (isStudent ? <StudentPortal santri={santri}/> : <Dashboard role={role} santri={santri} activities={activities}/>)
          : page === 'Data Santri' ? <SantriPage santri={santri} setSantri={setSantri} role={role} genderFilter={genderByModule['Data Santri']} setGenderFilter={gender => setGenderByModule(current => ({ ...current, 'Data Santri': gender }))} rewards={rewards} hukuman={hukuman} notify={notify}/>
          : page === 'Absensi Sholat' ? <SholatPage santri={santri} records={sholatRecords} setRecords={setSholatRecords} role={role} genderFilter={genderByModule['Absensi Sholat']} setGenderFilter={gender => setGenderByModule(current => ({ ...current, 'Absensi Sholat': gender }))} notify={notify}/>
          : page === 'Absensi Kegiatan' ? <KegiatanAbsensiPage santri={santri} activities={activities} participantCategories={participantCategories} records={kegiatanRecords} setRecords={setKegiatanRecords} role={role} genderFilter={genderByModule['Absensi Kegiatan']} setGenderFilter={gender => setGenderByModule(current => ({ ...current, 'Absensi Kegiatan': gender }))} notify={notify}/>
          : page === 'Kegiatan' ? <ActivitiesPage activities={activities} setActivities={setActivities} santri={santri} role={role} participantCategories={participantCategories} setParticipantCategories={setParticipantCategories} kegiatanRecords={kegiatanRecords} setKegiatanRecords={setKegiatanRecords} notify={notify}/>
          : page === 'Tahfidz' ? <TahfidzPage role={role} santri={santri} jadwal={jadwalTahfidz} setJadwal={setJadwalTahfidz} setoran={setoranTahfidz} setSetoran={setSetoranTahfidz} genderFilter={genderByModule['Tahfidz']} setGenderFilter={gender => setGenderByModule(current => ({ ...current, 'Tahfidz': gender }))} onOpenRiwayat={(nis) => { setRiwayatPreset(nis ? { santriNis: nis } : null); setPage('Riwayat Setoran') }}/>
          : page === 'Riwayat Setoran' ? <RiwayatPage role={role} santri={santri} jadwal={jadwalTahfidz} setoran={setoranTahfidz} preset={riwayatPreset} onPresetConsumed={() => setRiwayatPreset(null)} genderFilter={genderByModule['Tahfidz']} setGenderFilter={gender => setGenderByModule(current => ({ ...current, 'Tahfidz': gender }))}/>
          : <GenericPage page={page} role={role} santri={santri} rewards={rewards} hukuman={hukuman}/>}
        <footer className="print:hidden mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-[#dce6d8] pt-5 text-[10px] text-stone-400"><p>© 2026 E-Absensi Darun Nahdhah <span className="mx-1">·</span> Frontend preview v0.3.0</p><p className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"/> Data demo · Belum terhubung backend</p></footer>
      </main>
    </div>
    <Toast toast={toast} onClose={() => setToast(null)}/>
    {dark && <style>{`.dark-mode{filter:none;background:#16211a;color:#e8efe5}.dark-mode aside,.dark-mode header,.dark-mode main .bg-white{background:#1b2a21!important;color:#e8efe5!important}.dark-mode main .text-leaf-900,.dark-mode header .text-leaf-900{color:#e8efe5!important}.dark-mode main .border-\\[\\#e0e9de\\],.dark-mode main .border-\\[\\#dce6d8\\],.dark-mode header{border-color:#2e4034!important}.dark-mode main .text-stone-500,.dark-mode main .text-stone-400{color:#9fb3a4!important}.dark-mode main .bg-\\[\\#f5f8f3\\],.dark-mode main .bg-\\[\\#fafcf8\\]{background:#16211a!important}.dark-mode main .bg-leaf-50,.dark-mode main .bg-leaf-50\\/70,.dark-mode main .bg-leaf-50\\/60,.dark-mode main .bg-leaf-50\\/50,.dark-mode main .bg-leaf-100,.dark-mode main .bg-leaf-100\\/70{background:#22362b!important}`}</style>}
  </div>
}
