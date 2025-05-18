/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundColor: {
        light: '#ffffff',
        dark: '#0f172a',
      },
      textColor: {
        light: '#0f172a',
        dark: '#ffffff',
      },
    },
  },
  plugins: [],
};
