import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#090a0a',
        coal: '#101110',
        champagne: '#e7bf82',
        ivory: '#f3eee7',
        muted: '#a8a6a1',
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'Arial', 'sans-serif'],
        display: ['Inter', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
