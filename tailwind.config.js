/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary navy — sampled from the Modern Estimator logo (#14284A)
        brand: {
          50: '#ECF0F7', 100: '#D7DEEC', 200: '#AFC0DC', 300: '#87A0CB', 400: '#5F80BB',
          500: '#234B86', 600: '#1A3A6B', 700: '#14284A', 800: '#0E1C36', 900: '#091224',
        },
        ink: {
          900: '#0B1B33', 800: '#142A4D', 700: '#1F3A66', 600: '#3A5680', 500: '#5B7399', 400: '#8497B5',
        },
        // Accent orange — from the logo (#ED7D22)
        accent: {
          50: '#FEF3E9', 100: '#FCE1C8', 200: '#F9C99B', 300: '#F4A45E', 400: '#F08C30',
          500: '#ED7D22', 600: '#D96F12', 700: '#B85A0E',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(20,40,74,0.30)',
        card: '0 6px 20px -6px rgba(11,27,51,0.10)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg,#091224 0%,#14284A 50%,#234B86 100%)',
      },
    },
  },
  plugins: [],
};
