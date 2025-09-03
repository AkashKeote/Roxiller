/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F7F6F2',
          100: '#F0F0F0',
          200: '#E8E8E8',
          300: '#D1D1D1',
          400: '#B5C7F7',
          500: '#9BB3F5',
          600: '#819FF3',
          700: '#678BF1',
          800: '#4D77EF',
          900: '#3363ED',
        },
        secondary: {
          50: '#F9E79F',
          100: '#F7DC8F',
          200: '#F5D17F',
          300: '#F3C66F',
          400: '#F1BB5F',
          500: '#EFB04F',
          600: '#EDA53F',
          700: '#EB9A2F',
          800: '#E98F1F',
          900: '#E7840F',
        },
        dark: {
          50: '#4A4A5A',
          100: '#3D3D4D',
          200: '#303040',
          300: '#232333',
          400: '#22223B',
          500: '#1B1B2B',
          600: '#14141B',
          700: '#0D0D0B',
          800: '#060601',
          900: '#000000',
        },
        accent: {
          50: '#E8F5E8',
          100: '#D1EBD1',
          200: '#BAE1BA',
          300: '#A3D7A3',
          400: '#8CCD8C',
          500: '#75C375',
          600: '#5EB95E',
          700: '#47AF47',
          800: '#30A530',
          900: '#199B19',
        },
        border: {
          50: '#F0F0F0',
          100: '#E8E8E8',
          200: '#D1D1D1',
          300: '#B5C7F7',
          400: '#9BB3F5',
          500: '#819FF3',
          600: '#678BF1',
          700: '#4D77EF',
          800: '#3363ED',
          900: '#22223B',
        }
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'pulse-gentle': 'pulseGentle 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(181, 199, 247, 0.15)',
        'medium': '0 8px 30px rgba(181, 199, 247, 0.2)',
        'large': '0 16px 40px rgba(181, 199, 247, 0.25)',
        'glow': '0 0 20px rgba(181, 199, 247, 0.3)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
