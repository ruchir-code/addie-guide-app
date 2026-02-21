/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        analysis: '#E74C3C',
        design: '#E67E22',
        develop: '#27AE60',
        implement: '#8E44AD',
        evaluate: '#2980B9',
      },
    },
  },
  plugins: [],
}
