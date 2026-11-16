/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Palet hijau tanaman (plant green):
        // 700 forest green (primer), 600 leaf green (sekunder), 400 sage (aksen).
        leaf: {
          50: '#f5f8f3',
          100: '#eaf1e6',
          200: '#e0e9de',
          300: '#c9d8c4',
          400: '#a9c5a0',
          500: '#78877a',
          600: '#4f8060',
          700: '#245c43',
          800: '#1d4634',
          900: '#20372a'
        },
        ink: '#20372a'
      },
      boxShadow: {
        soft: '0 10px 35px rgba(36, 92, 67, 0.06)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: [],
}
