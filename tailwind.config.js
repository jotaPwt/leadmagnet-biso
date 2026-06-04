/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
        primary: '#FF0068',
        'primary-hover': '#D4005A',
        background: '#F8F8F8',
        card: '#FFFFFF',
        foreground: '#222222',
        'foreground-muted': '#333333',
        muted: '#F2F2F2',
      },
      borderRadius: {
        '2xl': '20px',
        xl: '12px',
      },
      boxShadow: {
        card: '0 2px 16px rgba(255,0,104,0.06)',
        'card-hover': '0 4px 24px rgba(255,0,104,0.12)',
      },
    },
  },
  plugins: [],
}
