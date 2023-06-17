/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'color-purple-dark': '#0C134F',
        'color-purple-light': '#1D267D',
        'color-purple-lighter': '#5C469C',
        'color-purple-lightest': '#D4ADFC',
        
      },
    },
  },
  plugins: [],
};

// font sizes (px)
// 10 / 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 44 / 52 / 62 / 74 / 86 / 98
// spacings (px)
// 2 / 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 80 / 96 / 128
