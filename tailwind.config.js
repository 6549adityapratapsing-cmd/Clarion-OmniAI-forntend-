/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        clarion: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#10B981',
          600: '#059669',
          900: '#064E3B'
        },
        slate: {
          850: '#151E2E',
          900: '#0F172A',
          950: '#0B0F19'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
