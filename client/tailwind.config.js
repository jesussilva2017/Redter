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
        navy: {
          DEFAULT: '#1D3557',
          deep: '#1E3A8A',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#F8F9FA',
        },
        line: {
          DEFAULT: '#E9ECEF',
          strong: '#D1D5DB',
        },
      },
    },
  },
  plugins: [],
};
