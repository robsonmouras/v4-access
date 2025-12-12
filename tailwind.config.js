/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'v4-primary': '#E50915',
        'v4-secondary': '#B20710',
        'v4-accent': '#E50915',
        'v4-dark': '#1A1A1A',
        'v4-light': '#F5F5F5',
        'v4-red': '#E50915',
      },
    },
  },
  plugins: [],
}

