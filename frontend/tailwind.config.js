/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'f1-red': '#FF1E00',
        'f1-black': '#15151E',
        'f1-gray': '#38383F',
        'f1-white': '#F8F4F4',
        'team-red-bull': '#0600EF',
        'team-mercedes': '#00D2BE',
        'team-ferrari': '#DC0000',
        'team-mclaren': '#FF8700',
        'team-aston-martin': '#006F62',
        'team-alpine': '#0090FF',
        'team-williams': '#005AFF',
        'team-visa-rb': '#0B2343',
        'team-stake': '#900000',
        'team-haas': '#FFFFFF',
      },
      fontFamily: {
        'formula': ['"Formula1", "Titillium Web", sans-serif'],
        'sans': ['"Titillium Web", "Helvetica", "Arial", sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}
