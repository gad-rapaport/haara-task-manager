/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amber: {
          DEFAULT: '#B8740A',
          light: '#D49830',
          dark: '#8E5708',
          tint: '#FFF4E0',
        }
      }
    },
  },
  plugins: [],
}