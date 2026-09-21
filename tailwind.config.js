/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'recife-primary': '#1B5E20',
        'recife-secondary': '#2E7D32',
        'recife-accent': '#43A047',
        'recife-light': '#E8F5E9',
        'recife-dark': '#0D3B12',
        saude: {
          primary: '#0F8B5F',
          primaryHover: '#0B6E4B',
          light: '#E6F4EA',
          darkText: '#111827',
          secondaryText: '#6B7280',
          border: '#E5E7EB',
          card: '#FFFFFF',
          background: '#F8FAFC'
        }
      },
      fontSize: {
        'idoso-base': '1.25rem',
        'idoso-lg': '1.5rem',
        'idoso-xl': '1.875rem',
        'idoso-2xl': '2.25rem',
      },
      borderRadius: {
        'card': '24px',
      }
    },
  },
  plugins: [],
}
