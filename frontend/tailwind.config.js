module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary-color': {
          light: '#8b5cf6',
          DEFAULT: '#7c3aed',
          dark: '#6d28d9',
        },
        'accent-color': {
          light: '#f97316',
          DEFAULT: '#ea580c',
          dark: '#c2410c',
        },
        'light-color': {
          DEFAULT: '#f8fafc',
          dark: '#f1f5f9',
        },
        'neutral-color': {
          light: '#f3f4f6',
          DEFAULT: '#e5e7eb',
          dark: '#d1d5db',
        },
        'secondary-color': {
          light: '#0ea5e9',
          DEFAULT: '#0284c7',
          dark: '#0369a1',
        },
        // Adding new soft background colors
        'bg-soft': {
          cream: '#fef9f0',
          beige: '#f9f5eb',
          gray: '#f7f8fa',
          blue: '#f0f7fa',
          lavender: '#f5f1fe',
        },
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'elegant': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'elegant-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'card-elegant': '0 10px 30px -15px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
