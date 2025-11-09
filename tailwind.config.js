/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'viet-style-raised': '-6px -6px 12px rgba(255, 255, 255, 0.9), 6px 6px 12px rgba(210, 190, 170, 0.5)',
        'viet-style-pressed': 'inset -3px -3px 6px rgba(255, 255, 255, 0.9), inset 3px 3px 6px rgba(210, 190, 170, 0.5)',
      },
      colors: {
        'lotus-pink': '#F472B6',
        'bamboo-green': '#10B981',
      },
    },
  },
  plugins: [],
}

