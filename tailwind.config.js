/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        latte: {
          50: '#fbf9f6',
          100: '#f4efe8',
          200: '#e9ded0',
          300: '#d9c5ae',
          400: '#c5a78a',
          500: '#a98261',
          600: '#8b674b',
          700: '#6f513d',
          800: '#513b2e',
          900: '#34271f'
        },
        ink: '#302821'
      },
      boxShadow: {
        soft: '0 10px 35px rgba(70, 49, 32, 0.06)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: [],
}
