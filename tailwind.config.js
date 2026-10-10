/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          700: '#5B21B6',
          600: '#6D28D9',
          500: '#7C3AED',
          100: '#EDE9FE',
          50: '#F5F3FF',
        },
        lavender: {
          50: '#F7F5FF',
          100: '#F0ECFC',
          200: '#E4DCFA',
        },
        sidebar: {
          DEFAULT: '#211044',
          hover: '#2D1659',
          active: '#5B21B6',
          border: 'rgba(255, 255, 255, 0.1)',
        },
        app: {
          text: '#211A35',
          muted: '#6B6478',
          border: '#E7E2EF',
          card: '#FFFFFF',
        },
        status: {
          success: '#16865B',
          successBg: '#DDF7EA',
          warning: '#A66A00',
          warningBg: '#FFF2CC',
          error: '#B42318',
          errorBg: '#FEE4E2',
          info: '#2456C4',
          infoBg: '#E8F0FE',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 8px 24px rgba(35, 16, 68, 0.06)',
        'card-hover': '0 12px 32px rgba(35, 16, 68, 0.10)',
        dropdown: '0 16px 48px rgba(35, 16, 68, 0.12)',
        subtle: '0 1px 3px rgba(35, 16, 68, 0.06)',
      },
      borderRadius: {
        card: '16px',
      },
    },
  },
  plugins: [],
};
