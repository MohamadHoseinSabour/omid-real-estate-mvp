/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', './public/**/*.js'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f4f7fb',
          100: '#e8f0f8',
          200: '#d0e0f0',
          300: '#a8c6e4',
          400: '#75a3d3',
          500: '#4a82c0',
          600: '#254d7b',
          700: '#1b3a5d',
          800: '#0f2b48',
          900: '#0a192f',
          950: '#060f1e',
        },
        accent: {
          50: '#fdfbf7',
          100: '#fdf8ed',
          200: '#f9eccd',
          300: '#f2dc9f',
          400: '#dfb96c',
          500: '#cda34f',
          600: '#b38a38',
          700: '#8e6b29',
          800: '#6d5022',
          900: '#533c1d',
          950: '#2e1f0c',
        },
        status: {
          available: '#15803d',
          'available-bg': '#dcfce7',
          negotiating: '#b45309',
          'negotiating-bg': '#fef3c7',
          sold: '#4b5563',
          'sold-bg': '#f3f4f6',
        }
      },
      fontFamily: {
        vazir: ['Vazirmatn', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
