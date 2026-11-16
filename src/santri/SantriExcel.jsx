// Import & Export Excel Data Santri (SheetJS/xlsx).
// Frontend-only: file dibaca di browser, data masuk ke state React (belum ada backend).
import { useRef, useState } from 'react'
import * as XLSX from 'xlsx'
import { CheckCircle2, CircleAlert, Download, FileSpreadsheet, Upload } from 'lucide-react'
import { Badge, Button, Modal, toDateKey } from '../ui'
import { BRANCHES, DORMS, GENDER_OPTIONS, generateNisBatch } from '../data/master'

const TEMPLATE_HEADERS = ['Nama Lengkap', 'Cabang', 'Asrama', 'Jenis Kelamin']
const EXPORT_HEADERS = ['NIS', 'Nama', 'Jenis Kelamin', 'Cabang', 'Asrama', 'Status', 'Kehadiran', 'Poin']

const EXAMPLE_ROWS = [
  ['Ahmad Fauzan', 'Pusat Darun Nahdhah', 'Asrama Al-Falah', 'Ikhwan'],
  ['Muhammad Rizki', 'Pusat Darun Nahdhah', 'Asrama Al-Ikhlas', 'Ikhwan'],
  ['Aisyah Humaira', 'Cabang Depok', 'Asrama An-Nisa', 'Akhwat'],
  ['Fatimah Zahra', 'Cabang Bogor', 'Asrama Az-Zahra', 'Akhwat'],
]

const writeWorkbook = (sheets, filename) => {
  const workbook = XLSX.utils.book_new()
  sheets.forEach(([name, rows, cols]) => {
    const sheet = XLSX.utils.aoa_to_sheet(rows)
    if (cols) sheet['!cols'] = cols
    XLSX.utils.book_append_sheet(workbook, sheet, name)
  })
  // Nama file dan isi teks (termasuk karakter Indonesia) ditulis sebagai UTF-8.
  XLSX.writeFile(workbook, filename)
}

export const downloadSantriTemplate = () => {
  const masterRows = [
    ['Daftar Cabang'],
    ...BRANCHES.map((branch) => [branch]),
    [''],
    ['Daftar Asrama', 'Cabang', 'Kategori'],
    ...DORMS.map((dorm) => [dorm.name, dorm.branch, dorm.gender]),
  ]
  writeWorkbook([
    ['Template Import', [TEMPLATE_HEADERS, ...EXAMPLE_ROWS], [{ wch: 26 }, { wch: 24 }, { wch: 22 }, { wch: 15 }]],
    ['Master Data', masterRows, [{ wch: 26 }, { wch: 24 }, { wch: 14 }]],
  ], 'Template_Import_Santri_Darun_Nahdhah.xlsx')
}

export const exportSantriExcel = (rows, poinOf) => {
  const data = rows.map((santri) => [
    santri.nis,
    santri.name,
    santri.gender,
    santri.branch,
    santri.dorm,
    santri.status,
    Number(santri.attendance) || 0,
    poinOf(santri.nis),
  ])
  writeWorkbook([
    ['Data Santri', [EXPORT_HEADERS, ...data], [{ wch: 12 }, { wch: 28 }, { wch: 14 }, { wch: 24 }, { wch: 20 }, { wch: 16 }, { wch: 11 }, { wch: 8 }]],
  ], `Data_Santri_Darun_Nahdhah_${toDateKey()}.xlsx`)
}

const normalizeHeader = (key) => String(key).toLowerCase().replace(/\s+/g, ' ').trim()

// Baca nilai kolom dengan toleransi huruf besar/kecil dan spasi header.
const readCell = (row, aliases) => {
  for (const key of Object.keys(row)) {
    if (aliases.includes(normalizeHeader(key))) return row[key]
  }
  return ''
}

// Validasi per baris: nama, master cabang/asrama, relasi asrama-cabang,
// kategori gender asrama, dan deteksi duplikat (dalam file maupun data existing).
export const validateImportRows = (rows, existingSantri) => {
  const seen = new Set()
  return rows.map((row, index) => {
    const name = String(readCell(row, ['nama lengkap', 'nama', 'nama santri'])).trim()
    const branch = String(readCell(row, ['cabang'])).trim()
    const dormName = String(readCell(row, ['asrama'])).trim()
    const gender = String(readCell(row, ['jenis kelamin', 'gender', 'kategori'])).trim()
    const errors = []

    if (!name) errors.push('Nama lengkap wajib diisi.')
    if (!branch) errors.push('Cabang wajib diisi.')
    else if (!BRANCHES.includes(branch)) errors.push(`Cabang "${branch}" tidak sesuai master data.`)

    if (!dormName) errors.push('Asrama wajib diisi.')
    const dorm = DORMS.find((item) => item.name === dormName)
    if (dormName && !dorm) errors.push(`Asrama "${dormName}" tidak sesuai master data.`)
    if (dorm) {
      if (branch && dorm.branch !== branch) errors.push(`Asrama "${dormName}" milik ${dorm.branch}, bukan ${branch}.`)
      if (gender && dorm.gender !== gender) errors.push(`Asrama "${dormName}" berkategori ${dorm.gender}; tidak cocok dengan jenis kelamin ${gender}.`)
    }

    if (!gender) errors.push('Jenis kelamin wajib diisi.')
    else if (!GENDER_OPTIONS.includes(gender)) errors.push('Jenis kelamin hanya boleh Ikhwan atau Akhwat.')

    const key = `${name}|${branch}|${dormName}|${gender}`.toLowerCase()
    if (name && seen.has(key)) errors.push('Duplikat baris di dalam file import.')
    seen.add(key)

    if (name && existingSantri.some((item) => item.name.toLowerCase() === name.toLowerCase() && item.branch === branch && item.dorm === dormName && item.gender === gender)) {
      errors.push('Duplikat dengan data santri yang sudah tersimpan.')
    }

    return { rowNumber: index + 2, name, branch, dorm: dormName, gender, errors, valid: errors.length === 0 }
  })
}

export function SantriImportModal({ santri, onImport, onClose }) {
  const [rows, setRows] = useState(null)
  const [fileName, setFileName] = useState('')
  const [parseError, setParseError] = useState('')
  const [importedCount, setImportedCount] = useState(0)
  const fileRef = useRef(null)

  const validRows = (rows || []).filter((row) => row.valid)
  const invalidRows = (rows || []).filter((row) => !row.valid)

  const handleFile = async (file) => {
    if (!file) return
    setParseError('')
    setImportedCount(0)
    try {
      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer, { type: 'array' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const json = XLSX.utils.sheet_to_json(sheet, { defval: '' })
      setFileName(file.name)
      if (!json.length) {
        setRows([])
        setParseError('File tidak berisi baris data. Gunakan template yang telah disediakan.')
        return
      }
      setRows(validateImportRows(json, santri))
    } catch {
      setRows(null)
      setFileName('')
      setParseError('File tidak dapat dibaca. Pastikan file berformat .xlsx sesuai template.')
    }
  }

  const submit = () => {
    if (!validRows.length || importedCount) return
    const generated = generateNisBatch(santri.map((item) => item.nis), validRows.length)
    onImport(validRows.map((row, index) => ({
      nis: generated[index],
      name: row.name,
      gender: row.gender,
      branch: row.branch,
      dorm: row.dorm,
      status: 'Aktif',
      attendance: 100,
      tahfidz: '0 Juz',
    })))
    setImportedCount(validRows.length)
  }

  return <Modal
    title="Import Data Santri (Excel)"
    subtitle="Unggah file .xlsx sesuai template. NIS dibuat otomatis dan tidak perlu diisi pada file."
    icon={FileSpreadsheet}
    size="xl"
    onClose={onClose}
    footer={<>
      <Button variant="outline" onClick={onClose}>{importedCount ? 'Tutup' : 'Batal'}</Button>
      <Button icon={Upload} onClick={submit} disabled={!validRows.length || importedCount > 0}>{importedCount ? 'Data Terimport' : `Import ${validRows.length} Baris Valid`}</Button>
    </>}
  >
    <div className="mt-5 grid gap-3 sm:grid-cols-2">
      <div className="rounded-2xl border border-[#e0e9de] bg-leaf-50/60 p-4">
        <p className="text-xs font-extrabold text-leaf-900">1. Unduh template</p>
        <p className="mt-1 text-[11px] leading-5 text-stone-500">Kolom: Nama Lengkap, Cabang, Asrama, Jenis Kelamin. Sheet kedua berisi master cabang & asrama.</p>
        <Button variant="outline" icon={Download} className="mt-3" onClick={downloadSantriTemplate}>Unduh Template Excel</Button>
      </div>
      <div className="rounded-2xl border border-[#e0e9de] bg-white p-4">
        <p className="text-xs font-extrabold text-leaf-900">2. Unggah file terisi</p>
        <p className="mt-1 text-[11px] leading-5 text-stone-500">{fileName ? `File terpilih: ${fileName}` : 'Format .xlsx, baris pertama adalah header.'}</p>
        <input ref={fileRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={(event) => handleFile(event.target.files?.[0])}/>
        <Button icon={Upload} className="mt-3" onClick={() => fileRef.current?.click()}>Pilih File Excel</Button>
      </div>
    </div>

    {parseError && <div className="mt-3 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-[11px] font-semibold text-rose-700"><CircleAlert size={14} className="mt-0.5 shrink-0"/>{parseError}</div>}

    {rows && rows.length > 0 && <div className="mt-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="neutral">{rows.length} baris terbaca</Badge>
        <Badge tone="green">{validRows.length} valid</Badge>
        <Badge tone="red">{invalidRows.length} gagal</Badge>
        <span className="text-[11px] text-stone-400">Baris valid dapat diimport tanpa menghilangkan daftar baris gagal.</span>
      </div>
      {importedCount > 0 && <div className="mt-3 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-[11px] font-semibold text-emerald-800"><CheckCircle2 size={14} className="mt-0.5 shrink-0"/>{importedCount} santri berhasil diimport dengan NIS otomatis. Baris gagal tetap ditampilkan di bawah untuk diperbaiki lalu diunggah ulang.</div>}
      <div className="mt-3 max-h-72 overflow-auto rounded-xl border border-stone-200">
        <table className="w-full min-w-[720px] text-left">
          <thead className="sticky top-0 bg-leaf-50/95 backdrop-blur">
            <tr className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              <th className="px-3 py-2.5">Baris</th><th className="px-3 py-2.5">Nama Lengkap</th><th className="px-3 py-2.5">Cabang</th><th className="px-3 py-2.5">Asrama</th><th className="px-3 py-2.5">Jenis Kelamin</th><th className="px-3 py-2.5">Validasi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => <tr key={row.rowNumber} className={`border-t border-stone-100 ${row.valid ? '' : 'bg-rose-50/40'}`}>
              <td className="px-3 py-2.5 text-[11px] font-semibold text-stone-400">{row.rowNumber}</td>
              <td className="px-3 py-2.5 text-xs font-bold text-leaf-900">{row.name || <span className="text-rose-500">(kosong)</span>}</td>
              <td className="px-3 py-2.5 text-[11px] text-stone-600">{row.branch || '-'}</td>
              <td className="px-3 py-2.5 text-[11px] text-stone-600">{row.dorm || '-'}</td>
              <td className="px-3 py-2.5 text-[11px] text-stone-600">{row.gender || '-'}</td>
              <td className="px-3 py-2.5">
                {row.valid
                  ? <Badge tone="green">Valid</Badge>
                  : <div className="space-y-1">{row.errors.map((error, index) => <p key={index} className="flex items-start gap-1 text-[10px] font-semibold leading-4 text-rose-600"><CircleAlert size={11} className="mt-0.5 shrink-0"/>{error}</p>)}</div>}
              </td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </div>}

    {rows && rows.length === 0 && !parseError && <p className="mt-4 rounded-xl border border-dashed border-stone-200 px-3.5 py-4 text-center text-xs text-stone-400">Belum ada baris data pada file.</p>}
  </Modal>
}

export function SantriExportModal({ allRows, filteredRows, poinOf, onClose, notify }) {
  const [mode, setMode] = useState('filtered')
  const rows = mode === 'all' ? allRows : filteredRows
  const options = [
    { value: 'filtered', label: 'Export Data Terfilter', desc: 'Mengikuti seluruh filter yang aktif pada tabel saat ini.', count: filteredRows.length },
    { value: 'all', label: 'Export Seluruh Data', desc: 'Seluruh santri lintas kategori, cabang, dan asrama.', count: allRows.length },
  ]
  return <Modal
    title="Export Data Santri (Excel)"
    subtitle="Pilih cakupan data. File .xlsx berisi NIS, nama, jenis kelamin, cabang, asrama, status, kehadiran, dan poin."
    icon={Download}
    onClose={onClose}
    footer={<>
      <Button variant="outline" onClick={onClose}>Batal</Button>
      <Button icon={Download} disabled={rows.length === 0} onClick={() => {
        exportSantriExcel(rows, poinOf)
        notify(`Export ${rows.length} data santri berhasil diunduh.`, 'success')
        onClose()
      }}>Unduh Excel ({rows.length})</Button>
    </>}
  >
    <div className="mt-5 space-y-3">
      {options.map((option) => <button key={option.value} type="button" onClick={() => setMode(option.value)} className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition ${mode === option.value ? 'border-leaf-400 bg-leaf-50 ring-2 ring-leaf-100' : 'border-[#e0e9de] bg-white hover:border-leaf-300'}`}>
        <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${mode === option.value ? 'border-leaf-700 bg-leaf-700' : 'border-stone-300'}`}>{mode === option.value && <span className="h-1.5 w-1.5 rounded-full bg-white"/>}</span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs font-extrabold text-leaf-900">{option.label}</span><Badge tone={mode === option.value ? 'green' : 'neutral'}>{option.count} santri</Badge></span>
          <span className="mt-1 block text-[11px] leading-5 text-stone-500">{option.desc}</span>
        </span>
      </button>)}
      {mode === 'filtered' && filteredRows.length === 0 && <p className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-[11px] font-semibold text-amber-700">Tidak ada data pada hasil filter saat ini. Pilih "Export Seluruh Data" atau sesuaikan filter.</p>}
      <p className="text-[10px] leading-5 text-stone-400">Nama file: Data_Santri_Darun_Nahdhah_{toDateKey()}.xlsx</p>
    </div>
  </Modal>
}
