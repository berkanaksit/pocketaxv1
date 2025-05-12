/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#b8dfff',
          300: '#7cc7ff',
          400: '#38a8ff',
          500: '#0088ff',
          600: '#0066ff',
          700: '#0055d4',
          800: '#0044a8',
          900: '#003380',
          950: '#001f4d'
        },
        accent: {
          50: '#fff7e6',
          100: '#ffe4b3',
          200: '#ffd180',
          300: '#ffbe4d',
          400: '#ffab1a',
          500: '#ff9800',
          600: '#cc7a00',
          700: '#995c00',
          800: '#663d00',
          900: '#331f00'
        },
        success: {
          50: '#e6fff2',
          100: '#b3ffdc',
          200: '#80ffc6',
          300: '#4dffb0',
          400: '#1aff9a',
          500: '#00e680',
          600: '#00b366',
          700: '#00804d',
          800: '#004d33',
          900: '#00261a'
        },
        neutral: {
          200: '#F5F7FA',
          800: '#2F2F2F'
        },
        error: {
          50: '#ffe6e6',
          100: '#ffb3b3',
          200: '#ff8080',
          300: '#ff4d4d',
          400: '#ff1a1a',
          500: '#ff0000',
          600: '#cc0000',
          700: '#990000',
          800: '#660000',
          900: '#330000'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      spacing: {
        2: '8px',
        3: '12px',
        4: '16px',
        6: '24px',
        8: '32px'
      }
    },
  },
  plugins: [],
};
