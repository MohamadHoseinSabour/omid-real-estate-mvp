/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f4f7fb',
          100: '#e8f0f8',
          600: '#254d7b',
          700: '#1b3a5d',
          800: '#0f2b48',
          900: '#0a192f',
        },
        accent: {
          100: '#fdf8ed',
          400: '#dfb96c',
          500: '#cda34f',
          600: '#b38a38',
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
