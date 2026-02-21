/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        analysis:  '#DC2626',
        design:    '#EA580C',
        develop:   '#059669',
        implement: '#9333EA',
        evaluate:  '#2563EB',
      },
    },
  },
  plugins: [],
}
