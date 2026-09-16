export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'recife-primary': '#1B5E20',
        'recife-secondary': '#2E7D32',
        'recife-accent': '#43A047',
        'recife-light': '#E8F5E9',
        'recife-dark': '#0D3B12',
      },
      fontSize: {
        'idoso-base': '1.25rem',
        'idoso-lg': '1.5rem',
        'idoso-xl': '1.875rem',
        'idoso-2xl': '2.25rem',
      },
    },
  },
  plugins: [],
}
