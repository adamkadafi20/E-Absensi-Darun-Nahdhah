// Logo resmi Pondok Pesantren Darun Nahdhah Al-Islamiyah.
// Sumber tunggal: /images/logo-darun-nahdhah.png. Jangan membuat ulang logo
// dengan CSS/SVG/ikon. Logo ditampilkan apa adanya dengan object-contain.
const VARIANTS = {
  sidebar: { box: 'h-11 w-11 rounded-xl p-1', ring: 'ring-1 ring-[#e0e9de]' },
  login: { box: 'h-28 w-28 rounded-3xl p-2', ring: 'ring-1 ring-[#e0e9de]' },
  document: { box: 'h-20 w-20 rounded-xl p-1.5', ring: 'ring-1 ring-[#e0e9de]' },
}

export default function BrandLogo({
  variant = 'sidebar',
  size,
  width,
  className = '',
  alt = 'Logo Pondok Pesantren Darun Nahdhah Al-Islamiyah',
}) {
  const preset = VARIANTS[variant] || VARIANTS.sidebar
  const style = {}
  if (width) style.width = typeof width === 'number' ? `${width}px` : width
  if (size) {
    const value = typeof size === 'number' ? `${size}px` : size
    style.height = value
    if (!width) style.width = value
  }

  return <span className={`inline-flex shrink-0 items-center justify-center overflow-hidden bg-white ${preset.box} ${preset.ring} ${className}`} style={style}>
    <img
      src="/images/logo-darun-nahdhah.png"
      alt={alt}
      width="446"
      height="448"
      decoding="async"
      draggable="false"
      className="h-full w-full object-contain"
    />
  </span>
}
