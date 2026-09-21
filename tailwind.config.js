/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#10203A',
          50: '#E8EDF4',
          100: '#C5D1E4',
          200: '#8EA5C8',
          300: '#5778AC',
          400: '#2E5090',
          500: '#10203A',
          600: '#0D1B31',
          700: '#0A1528',
          800: '#070F1F',
          900: '#040916',
        },
        cream: {
          DEFAULT: '#F5F0E7',
          50: '#FDFCFA',
          100: '#FAF8F3',
          200: '#F5F0E7',
          300: '#EDE4D3',
          400: '#E0D4BA',
          500: '#D0BF9D',
        },
        caramel: {
          DEFAULT: '#B9783F',
          50: '#FAF0E7',
          100: '#F3DBC4',
          200: '#E5BA8B',
          300: '#D49558',
          400: '#C4783F',
          500: '#B9783F',
          600: '#9D6335',
          700: '#7E4F2A',
          800: '#5F3B1F',
          900: '#402714',
        },
        beige: {
          DEFAULT: '#E8E0D0',
          light: '#F2EDE4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(16, 32, 58, 0.08), 0 10px 20px -2px rgba(16, 32, 58, 0.04)',
        'medium': '0 4px 25px -5px rgba(16, 32, 58, 0.12), 0 10px 30px -5px rgba(16, 32, 58, 0.06)',
        'strong': '0 10px 40px -10px rgba(16, 32, 58, 0.2), 0 20px 50px -10px rgba(16, 32, 58, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
