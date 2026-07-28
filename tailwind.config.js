/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hana: {
          bg: '#FFFDF7',        // Krem lembut background
          yellow: '#FDE047',    // Kuning playful
          blue: '#3B82F6',      // Biru accent
          navy: '#1E293B',      // Dark slate untuk border & text
          teal: '#14B8A6',      // Hijau teal
          pink: '#F472B6',      // Pink playful
          card: '#FFFFFF',      // Putih bersih untuk kartu
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Poppins', 'sans-serif'],
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #1E293B',
        'brutal-lg': '6px 6px 0px 0px #1E293B',
        'brutal-sm': '2px 2px 0px 0px #1E293B',
      },
      borderRadius: {
        'hana': '1.5rem',
      }
    },
  },
  plugins: [],
}