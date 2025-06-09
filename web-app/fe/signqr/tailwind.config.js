/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // Definisikan palet warna baru yang modern
      colors: {
        'dark-bg': '#0D1117',
        'primary': '#8A2BE2', // Ungu Elektrik
        'secondary': '#00BFFF', // Cyan Cerah
        'accent': '#FF1493', // Pink sebagai aksen hover
        'card-bg': 'rgba(255, 255, 255, 0.05)', // Warna kartu "kaca"
        'border-color': 'rgba(255, 255, 255, 0.1)',
        'text-light': '#F0F6FC',
        'text-muted': '#8B949E',
      },
      // Atur font Poppins sebagai default
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};